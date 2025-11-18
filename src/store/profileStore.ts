import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { User, updateProfile as updateAuthProfile } from 'firebase/auth';
import { useAuthStore } from './authStore';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  disabilityCategory?: 'blind' | 'mute' | 'deaf' | 'general';
  disabilitySubCategory?: string;
  studentId?: string;
  department?: string;
  // partner id (e.g. 'babcock') when user belongs to a partnered institution
  partner?: string;
  // Allow professor role for instructor accounts
  role?: 'student' | 'admin' | 'professor';
  // Accessibility preferences persisted on profile
  highContrast?: boolean;
  dyslexicFont?: boolean;
  fontSize?: 'small' | 'normal' | 'large' | 'xlarge';
  createdAt: Date;
  lastLogin: Date;
}
import { getPartnerForEmail, inferRoleFromEmail, PartnerConfig } from '@/config/partners';

interface ProfileState {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  fetchProfile: (user: User) => Promise<UserProfile | null>;
  createProfile: (user: User, displayName: string, disabilityCategory?: UserProfile['disabilityCategory']) => Promise<UserProfile>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  setProfile: (profile: UserProfile | null) => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
      profile: null,
      loading: false,
      error: null,
      setProfile: (profile) => set({ profile }),
      fetchProfile: async (user: User) => {
        set({ loading: true, error: null });
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            const profile: UserProfile = {
              uid: user.uid,
              email: user.email!,
              displayName: data.displayName || user.displayName || '',
              photoURL: data.photoURL || user.photoURL || undefined,
              disabilityCategory: data.disabilityCategory,
              studentId: data.studentId,
              department: data.department,
              role: data.role || 'student',
              partner: data.partner || undefined,
              createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
              lastLogin: new Date(), // This will be updated on login
            };
            await setDoc(doc(db, 'users', user.uid), { lastLogin: new Date() }, { merge: true });
            set({ profile, loading: false });
            return profile;
          }
          set({ loading: false });
          return null;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to fetch profile.';
          set({ error: errorMessage, loading: false });
          throw error;
        }
      },
      createProfile: async (user, displayName, disabilityCategory) => {
        // Detect partner from email and infer role heuristically for partner domains
        const partner: PartnerConfig | undefined = getPartnerForEmail(user.email || undefined) || undefined;
        const inferredRole = inferRoleFromEmail(user.email || '', partner);

        // Build profile object for local state (may contain `partner` as undefined)
        const profile: UserProfile = {
          uid: user.uid,
          email: user.email!,
          displayName,
          disabilityCategory: (disabilityCategory as UserProfile['disabilityCategory']) || 'general',
          role: (inferredRole as UserProfile['role']) || 'student',
          partner: partner ? partner.id : undefined,
          createdAt: new Date(),
          lastLogin: new Date(),
        };

        // Prepare Firestore payload but omit undefined fields (Firestore rejects undefined)
        const firestorePayload = profile.partner ? { ...profile, partner: profile.partner } : {
          uid: profile.uid,
          email: profile.email,
          displayName: profile.displayName,
          disabilityCategory: profile.disabilityCategory,
          role: profile.role,
          createdAt: profile.createdAt,
          lastLogin: profile.lastLogin,
        };

        await setDoc(doc(db, 'users', user.uid), firestorePayload);
        set({ profile });
        return profile;
      },
      updateProfile: async (updates) => {
        const { profile } = get();
        const user = useAuthStore.getState().user;

        if (!user || !profile) return;

        set({ loading: true, error: null });
        try {
          // Update Firebase Auth profile if displayName or photoURL changed
          if (updates.displayName || updates.photoURL) {
            await updateAuthProfile(user, {
              displayName: updates.displayName || user.displayName,
              photoURL: updates.photoURL || user.photoURL,
            });
          }

          // Update Firestore profile
          const updatedProfile = { ...profile, ...updates } as UserProfile;
          // Remove undefined fields to avoid Firestore errors
          const sanitized = Object.fromEntries(
            Object.entries(updatedProfile as unknown as Record<string, unknown>).filter(([, v]) => v !== undefined)
          );

          await setDoc(doc(db, 'users', user.uid), sanitized, { merge: true });

          set({
            profile: updatedProfile,
            loading: false,
          });
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred during profile update.';
          set({ error: errorMessage, loading: false });
          throw error;
        }
      },
    }),
    {
      name: 'profile-storage',
      storage: createJSONStorage(() => localStorage, {
        reviver: (key, value) => {
          if (key === 'createdAt' || key === 'lastLogin') {
            return new Date(value as string);
          }
          return value;
        },
      }),
      partialize: (state) => ({ profile: state.profile }),
    }
  )
);