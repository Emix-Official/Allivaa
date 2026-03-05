'use client';

import { useAccessibilityStore } from '@/store/accessibilityStore';
import { AnimatePresence, motion } from 'framer-motion';

export default function VisualAlert() {
  const visualAlertsEnabled = useAccessibilityStore((state) => state.visualAlertsEnabled);

  return (
    <AnimatePresence>
      {visualAlertsEnabled && (
          <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.7, 0] }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, times: [0, 0.2, 1] }}
          className="fixed inset-0 bg-white/80 dark:bg-black/80 pointer-events-none z-[9999]"
        ></motion.div>
      )}
    </AnimatePresence>
  );
}