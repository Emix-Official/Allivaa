'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useThemeStore } from '@/store/themeStore';
import PartnerThemeProvider from '@/components/Partner/PartnerThemeProvider';
import { useAccessibilityStore } from '@/store/accessibilityStore';

export default function RootLayoutClient({ children }: { children: React.ReactNode }) {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const initializeTheme = useThemeStore((state) => state.initializeTheme);
  const highContrast = useAccessibilityStore((s) => s.highContrast);
  const dyslexicFont = useAccessibilityStore((s) => s.dyslexicFont);
  const fontSize = useAccessibilityStore((s) => s.fontSize);

  useEffect(() => {
    initializeAuth();
    initializeTheme();
  }, [initializeAuth, initializeTheme]);

  // Sync accessibility preferences to DOM whenever they change
  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.classList.toggle('high-contrast', !!highContrast);
    document.documentElement.classList.toggle('dyslexic-font', !!dyslexicFont);
    const map: Record<typeof fontSize, string> = { small: '14px', normal: '16px', large: '18px', xlarge: '20px' };
    document.documentElement.style.fontSize = map[fontSize || 'normal'];
  }, [highContrast, dyslexicFont, fontSize]);

  return (
    <>
      <PartnerThemeProvider />
      {children}
    </>
  );
}