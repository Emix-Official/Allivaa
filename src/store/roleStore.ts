import { create } from 'zustand';

export type UserRole = 'student' | 'professor' | 'admin';
export type DisabilityCategory = 'blind' | 'deaf' | 'mute' | 'general';

export interface User {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  disabilityCategory?: DisabilityCategory;
  university?: string;
  createdAt: string;
  department?: string;
  profileImage?: string;
  bio?: string;
  courses?: string[];
}

interface RoleStore {
  currentRole: UserRole | null;
  setRole: (role: UserRole) => void;
  isStudent: boolean;
  isProfessor: boolean;
  isAdmin: boolean;
}

export const useRoleStore = create<RoleStore>((set, get) => ({
  currentRole: null,
  isStudent: false,
  isProfessor: false,
  isAdmin: false,

  setRole: (role: UserRole) => {
    set({
      currentRole: role,
      isStudent: role === 'student',
      isProfessor: role === 'professor',
      isAdmin: role === 'admin',
    });
  },
}));
