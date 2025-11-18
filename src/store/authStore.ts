import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  updateProfile,
  sendPasswordResetEmail,
  signInWithPopup,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '@/lib/firebase';
import { useProfileStore, UserProfile } from './profileStore';

interface AuthState {
  user: User | null;
  loading: boolean;
  profile: UserProfile | null;
  error: string | null;
  isAuthenticated: boolean;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string, disabilityCategory?: UserProfile['disabilityCategory']) => Promise<void>;
  signInWithGoogle: (disabilityCategory?: UserProfile['disabilityCategory']) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  initializeAuth: () => void;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      profile: null,
      loading: true, // Start with loading true
      error: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        set({ loading: true, error: null });
        try {
          const result = await signInWithEmailAndPassword(auth, email, password);
          const user = result.user;

          const profile = await useProfileStore.getState().fetchProfile(user);

          set({
            user,
            isAuthenticated: true,
            profile,
            loading: false,
          });
        } catch (error: unknown) {
          set({
            error:
              error instanceof Error ? error.message : 'An unknown error occurred during login.',
            loading: false,
          });
          throw error;
        }
      },

      signInWithGoogle: async (disabilityCategory) => {
        set({ loading: true, error: null });
        try {
          const result = await signInWithPopup(auth, googleProvider);
          const user = result.user;

          // Check if user profile exists
          let profile = await useProfileStore.getState().fetchProfile(user);

          // If no profile, create one with the provided disability category
          if (!profile) {
            profile = await useProfileStore.getState().createProfile(
              user,
              user.displayName || 'Google User',
              disabilityCategory
            );
          }

          set({
            user,
            isAuthenticated: true,
            profile,
            loading: false,
          });
          useProfileStore.getState().setProfile(profile);
        } catch (error: unknown) {
          set({
            error:
              error instanceof Error ? error.message : 'An unknown error occurred during Google sign-in.',
            loading: false,
          });
          throw error;
        }
      },

      register: async (email, password, displayName, disabilityCategory) => {
        set({ loading: true, error: null });
        try {
          if (!auth) throw new Error('Firebase Auth not initialized!');
          const result = await createUserWithEmailAndPassword(auth, email, password);
          const user = result.user;
      
          // Update Firebase Auth profile
          await updateProfile(user, { displayName });
      
          const profile = await useProfileStore.getState().createProfile(user, displayName, disabilityCategory);
      
          set({
            user,
            isAuthenticated: true,
            profile,
            loading: false,
          });
          useProfileStore.getState().setProfile(profile);
        } catch (error: unknown) {
          set({ 
            error:
              error instanceof Error ? error.message : 'An unknown error occurred during registration.',
            loading: false,
          });
          throw error;
        }
      },

      logout: async () => {
        set({ loading: true, error: null });
        try {
          // Attempt to sign out of Firebase if a session exists.
          // Failure here (no session or network error) shouldn't prevent clearing local state
          // because admin-bypass sessions don't rely on Firebase.
          await signOut(auth);
        } catch (error) {
          // Log but continue to clear local state to ensure admin-bypass is removed.
          // Do not rethrow so logout always results in a cleared local session.
          console.warn('signOut failed or no active Firebase session:', error);
        } finally {
          // Always clear local auth/profile state so admin-bypass or stale sessions are removed.
          set({
            user: null,
            isAuthenticated: false,
            profile: null,
            loading: false,
          });
          try {
            useProfileStore.getState().setProfile(null);
          } catch (err) {
            // swallow any issue with profile store clearing
            console.warn('Failed to clear profile store during logout:', err);
          }
        }
      },

      resetPassword: async (email: string) => {
        set({ loading: true, error: null });
        try {
          await sendPasswordResetEmail(auth, email);
          set({ loading: false });
        } catch (error: unknown) {
          set({
            error:
              error instanceof Error ? error.message : 'An unknown error occurred during password reset.',
            loading: false,
          });
          throw error;
        }
      },

      initializeAuth: () => {
        set({ loading: true });
        onAuthStateChanged(auth, async (user) => {
          if (user) {
            try {
              let profile = await useProfileStore.getState().fetchProfile(user);

              // If the user is authenticated but has no profile, create one.
              if (!profile) {
                profile = await useProfileStore.getState().createProfile(user, user.displayName || 'New User');
              }

              set({ user, isAuthenticated: true, loading: false, profile });
              useProfileStore.getState().setProfile(profile);
            } catch (error) {
              console.error('Error fetching user profile on auth init:', error);
              set({ user, isAuthenticated: true, loading: false });
              useProfileStore.getState().setProfile(null);
            }
          } else {
            // If there's no Firebase user, don't stomp over an existing
            // admin-bypass session that was created client-side. This lets
            // developers/testers use the admin bypass without Firebase auth
            // clearing the session immediately when the auth listener runs.
            const current = get();
            const hasClientAdmin = current.profile && current.profile.role === 'admin' && current.isAuthenticated;
            if (hasClientAdmin) {
              // Keep the admin-bypass session intact. Do not clear profile/user here.
              set({ loading: false });
            } else {
              set({ user: null, isAuthenticated: false, loading: false, profile: null });
              try {
                useProfileStore.getState().setProfile(null);
              } catch (err) {
                console.warn('Failed to clear profile store during auth init:', err);
              }
            }
          }
        });
      },

      updateUserProfile: async (updates) => {
        const { user, profile } = get();

        if (!user || !profile) return;

        set({ loading: true, error: null });
        try {
          // Update Firebase Auth profile if displayName or photoURL changed
          if (updates.displayName || updates.photoURL) {
            await updateProfile(user, {
              displayName: updates.displayName || user.displayName,
              photoURL: updates.photoURL || user.photoURL,
            });
          }

          // Update Firestore profile. Remove undefined fields to avoid
          // Firestore rejecting the write (it doesn't accept `undefined`).
          const updatedProfile = { ...profile, ...updates } as Record<string, unknown>;
          const sanitized = Object.fromEntries(
            Object.entries(updatedProfile).filter(([, v]) => v !== undefined)
          );

          await setDoc(doc(db, 'users', user.uid), sanitized, { merge: true });

          set({ profile: { ...profile, ...updates } as UserProfile, loading: false });
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred during profile update.';
          set({ error: errorMessage, loading: false });
          throw error;
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        profile: state.profile,
      }),
    }
  )
);
