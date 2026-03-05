import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeName = 'light' | 'dark';

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  gradient: string;
  bgDark: string;
  bgLight: string;
  text: string;
  textMuted: string;
  cardBg: string;
  border: string;
}

export const themes: Record<ThemeName, ThemeColors> = {
  light: {
    primary: 'from-emerald-600 to-cyan-500',
    secondary: 'from-emerald-50 to-cyan-50',
    accent: 'from-emerald-500 to-cyan-400',
    gradient: 'from-emerald-600 to-cyan-500',
    bgDark: 'from-emerald-50 to-cyan-50',
    bgLight: 'from-white to-white',
    text: 'text-slate-900',
    textMuted: 'text-slate-600',
    cardBg: 'bg-white',
    border: 'border-slate-200',
  },
  dark: {
    primary: 'from-emerald-800 to-cyan-500',
    secondary: 'from-slate-900 to-slate-800',
    accent: 'from-emerald-600 to-cyan-400',
    gradient: 'from-emerald-900 to-cyan-600',
    bgDark: 'from-slate-900 to-slate-800',
    bgLight: 'from-slate-800 to-slate-700',
    text: 'text-white',
    textMuted: 'text-slate-400',
    cardBg: 'bg-slate-950',
    border: 'border-slate-700',
  },
};

interface ThemeStore {
  currentTheme: ThemeName;
  colors: ThemeColors;
  setTheme: (theme: ThemeName) => void;
  initializeTheme: () => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      currentTheme: 'light',
      colors: themes.light,
      setTheme: (theme: ThemeName) => {
        set({
          currentTheme: theme,
          colors: themes[theme],
        });
        // Apply to document for Tailwind dark mode
        if (typeof window !== 'undefined') {
          if (theme === 'dark') {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
      },
      initializeTheme: () => {
        if (typeof window !== 'undefined') {
          const stored = localStorage.getItem('theme-storage');
          if (stored) {
            try {
              const { state } = JSON.parse(stored);
              const theme = state.currentTheme as ThemeName;
              if (theme === 'dark') {
                document.documentElement.classList.add('dark');
              } else {
                document.documentElement.classList.remove('dark');
              }
            } catch {
              // Use default theme
            }
          }
        }
      },
    }),
    {
      name: 'theme-storage',
    }
  )
);

