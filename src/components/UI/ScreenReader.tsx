'use client';

import { useEffect } from 'react';
import { useAccessibilityStore } from '@/store/accessibilityStore';

export default function ScreenReader() {
  const screenReaderOptimized = useAccessibilityStore((state) => state.screenReaderOptimized);

  useEffect(() => {
    const handleRead = (event: MouseEvent | FocusEvent) => {
      if (!screenReaderOptimized || !('speechSynthesis' in window)) return;

      const target = event.target as HTMLElement;
      const text = target.innerText || target.getAttribute('aria-label');

      if (text) {
        window.speechSynthesis.cancel(); // Stop any previous speech
        const utterance = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(utterance);
      }
    };

    document.body.addEventListener('mouseover', handleRead);
    document.body.addEventListener('focusin', handleRead);

    return () => {
      document.body.removeEventListener('mouseover', handleRead);
      document.body.removeEventListener('focusin', handleRead);
    };
  }, [screenReaderOptimized]);

  return null; // This component does not render anything
}