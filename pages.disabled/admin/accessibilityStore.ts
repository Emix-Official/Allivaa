import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type FontSize = 'small' | 'normal' | 'large' | 'xlarge';

export interface AccessibilityState {
  fontSize: FontSize;
  highContrast: boolean;
  screenReaderOptimized: boolean;
  reduceMotion: boolean;
  captionsEnabled: boolean;
  brailleMode: boolean;
  visualAlertsEnabled: boolean;

  setFontSize: (size: FontSize) => void;
  toggleHighContrast: () => void;
  toggleScreenReader: () => void;
  toggleReduceMotion: () => void;
  toggleCaptions: () => void;
  toggleBrailleMode: () => void;
  toggleVisualAlerts: () => void;
  resetToDefaults: () => void;
}

const initialState = {
  fontSize: 'normal' as FontSize,
  highContrast: false,
  screenReaderOptimized: false,
  reduceMotion: false,
  captionsEnabled: false,
  brailleMode: false,
  visualAlertsEnabled: false,
};

export const useAccessibilityStore = create<AccessibilityState>()(
  persist(
    (set) => ({
      ...initialState,
      setFontSize: (size) => set({ fontSize: size }),
      toggleHighContrast: () => set((state) => ({ highContrast: !state.highContrast })),
      toggleScreenReader: () => set((state) => ({ screenReaderOptimized: !state.screenReaderOptimized })),
      toggleReduceMotion: () => set((state) => ({ reduceMotion: !state.reduceMotion })),
      toggleCaptions: () => set((state) => ({ captionsEnabled: !state.captionsEnabled })),
      toggleBrailleMode: () => set((state) => ({ brailleMode: !state.brailleMode })),
      toggleVisualAlerts: () => set((state) => ({ visualAlertsEnabled: !state.visualAlertsEnabled })),
      resetToDefaults: () => set(initialState),
    }),
    {
      name: 'accessibility-settings',
      storage: createJSONStorage(() => localStorage),
    }
  )
);