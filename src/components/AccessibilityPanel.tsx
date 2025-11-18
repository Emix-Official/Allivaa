'use client';

import { useAccessibilityStore } from '@/store/accessibilityStore';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';

interface AccessibilityPanelProps {
  onClose: () => void;
}

export default function AccessibilityPanel({ onClose }: AccessibilityPanelProps) {
  const accessibility = useAccessibilityStore();

  const fontSizes: Array<'small' | 'normal' | 'large' | 'xlarge'> = [
    'small',
    'normal',
    'large',
    'xlarge',
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center md:justify-center"
    >
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="bg-white w-full md:w-96 rounded-t-2xl md:rounded-2xl shadow-2xl p-6"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Accessibility Settings</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Font Size */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Font Size
            </label>
            <div className="grid grid-cols-4 gap-2">
              {fontSizes.map((size) => (
                <button
                  key={size}
                  onClick={() => accessibility.setFontSize(size)}
                  className={`py-2 px-3 rounded-lg font-medium transition-colors capitalize ${
                    accessibility.fontSize === size
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* High Contrast */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-gray-700">High Contrast</label>
            <button
              onClick={() => accessibility.toggleHighContrast()}
              className={`w-12 h-6 rounded-full transition-colors ${
                accessibility.highContrast
                  ? 'bg-purple-600'
                  : 'bg-gray-300'
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  accessibility.highContrast ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          {/* Screen Reader */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-gray-700">
              Screen Reader Optimized
            </label>
            <button
              onClick={() => accessibility.toggleScreenReader()}
              className={`w-12 h-6 rounded-full transition-colors ${
                accessibility.screenReaderOptimized
                  ? 'bg-purple-600'
                  : 'bg-gray-300'
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  accessibility.screenReaderOptimized ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          {/* Reduced Motion */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-gray-700">
              Reduce Motion
            </label>
            <button
              onClick={() => accessibility.toggleReducedMotion()}
              className={`w-12 h-6 rounded-full transition-colors ${
                accessibility.reducedMotion
                  ? 'bg-purple-600'
                  : 'bg-gray-300'
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  accessibility.reducedMotion ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          {/* Captions */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-gray-700">
              Enable Captions
            </label>
            <button
              onClick={() => accessibility.toggleCaptions()}
              className={`w-12 h-6 rounded-full transition-colors ${
                accessibility.captionsEnabled
                  ? 'bg-purple-600'
                  : 'bg-gray-300'
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  accessibility.captionsEnabled ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          {/* Braille Mode */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-gray-700">
              Braille Mode
            </label>
            <button
              onClick={() => accessibility.toggleBrailleMode()}
              className={`w-12 h-6 rounded-full transition-colors ${
                accessibility.brailleMode
                  ? 'bg-purple-600'
                  : 'bg-gray-300'
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  accessibility.brailleMode ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          {/* Reset */}
          <button
            onClick={() => accessibility.resetSettings()}
            className="w-full py-2 px-4 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 font-semibold transition-colors mt-8"
          >
            Reset to Defaults
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
