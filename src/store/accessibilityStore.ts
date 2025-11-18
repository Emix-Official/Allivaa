import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type FontSize = 'small' | 'normal' | 'large' | 'xlarge';

interface AccessibilityState {
  screenReaderOptimized: boolean;
  fontSize: FontSize;
  highContrast: boolean;
  dyslexicFont: boolean;
  reducedMotion: boolean;
  captionsEnabled: boolean;
  visualAlertsEnabled: boolean;
  brailleMode: boolean;
  toggleScreenReader: () => void;
  triggerVisualAlert: () => void;
  setFontSize: (size: FontSize) => void;
  toggleHighContrast: () => void;
  toggleDyslexicFont: () => void;
  toggleReducedMotion: () => void;
  toggleCaptions: () => void;
  toggleVisualAlerts: () => void;
  toggleBrailleMode: () => void;
  resetSettings: () => void;
}
export const useAccessibilityStore = create<AccessibilityState>()(
  persist(
    (set) => ({
      screenReaderOptimized: false,
      fontSize: 'normal',
      highContrast: false,
      dyslexicFont: false,
      reducedMotion: false,
      captionsEnabled: false,
      visualAlertsEnabled: false,
      brailleMode: false,
      toggleScreenReader: () =>
        set((state) => ({ screenReaderOptimized: !state.screenReaderOptimized })),
      triggerVisualAlert: () => {
        document.body.style.animation = 'visual-alert-flash 0.5s ease-out';
        setTimeout(() => {
          document.body.style.animation = '';
        }, 500);
      },
      setFontSize: (size) => {
        if (typeof document !== 'undefined') {
          const map: Record<FontSize, string> = { small: '14px', normal: '16px', large: '18px', xlarge: '20px' };
          document.documentElement.style.fontSize = map[size];
        }
        set({ fontSize: size });
      },
      toggleHighContrast: () => {
        set((state) => {
          const next = !state.highContrast;
          if (typeof document !== 'undefined') {
            document.documentElement.classList.toggle('high-contrast', next);
          }
          return { highContrast: next } as Partial<AccessibilityState> as AccessibilityState;
        });
      },
      toggleDyslexicFont: () => {
        set((state) => {
          const next = !state.dyslexicFont;
          if (typeof document !== 'undefined') {
            document.documentElement.classList.toggle('dyslexic-font', next);
          }
          return { dyslexicFont: next } as Partial<AccessibilityState> as AccessibilityState;
        });
      },
      toggleReducedMotion: () => set((state) => ({ reducedMotion: !state.reducedMotion })),
      toggleCaptions: () => set((state) => ({ captionsEnabled: !state.captionsEnabled })),      
      toggleVisualAlerts: () => set((state) => ({ visualAlertsEnabled: !state.visualAlertsEnabled })),
      toggleBrailleMode: () => set((state) => ({ brailleMode: !state.brailleMode })),
      resetSettings: () => set({
        fontSize: 'normal',
        highContrast: false,
        dyslexicFont: false,
        reducedMotion: false,
        screenReaderOptimized: false,
        captionsEnabled: false,
        brailleMode: false,
        visualAlertsEnabled: false,
      }),
    }),
    {
      name: 'accessibility-storage',
    }
  )
);