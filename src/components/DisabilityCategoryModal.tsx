'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Ear, Volume2, GraduationCap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface DisabilityCategoryModalProps {
  isOpen: boolean;
  onSelectCategory?: (category: 'blind' | 'deaf' | 'mute' | 'general') => void;
  isNewUser?: boolean;
}

export default function DisabilityCategoryModal({
  isOpen,
  onSelectCategory,
  isNewUser = true,
}: DisabilityCategoryModalProps) {
  const router = useRouter();
  const [selected, setSelected] = useState<'blind' | 'deaf' | 'mute' | 'general' | null>(null);
  const [loading, setLoading] = useState(false);

  const categories = [
    {
      value: 'blind' as const,
      label: 'Blind Student',
      icon: Eye,
      description: 'Screen reader optimized, braille support, audio descriptions',
      color: 'from-blue-600 to-cyan-500',
    },
    {
      value: 'deaf' as const,
      label: 'Deaf Student',
      icon: Ear,
      description: 'Video captions, sign language support, visual notifications',
      color: 'from-purple-600 to-pink-500',
    },
    {
      value: 'mute' as const,
      label: 'Mute Student',
      icon: Volume2,
      description: 'Text transcription, chat support, written communication',
      color: 'from-amber-600 to-orange-500',
    },
    {
      value: 'general' as const,
      label: 'General Student',
      icon: GraduationCap,
      description: 'Standard features with accessibility options',
      color: 'from-emerald-600 to-teal-500',
    },
  ];

  const handleSelect = async (category: 'blind' | 'deaf' | 'mute' | 'general') => {
    setSelected(category);
    setLoading(true);

    try {
      // Call the callback if provided
      if (onSelectCategory) {
        onSelectCategory(category);
      }

      // Update user profile with disability category
      const { useAuthStore } = await import('@/store/authStore');
      const updateUserProfile = useAuthStore.getState().updateUserProfile;
      await updateUserProfile({ disabilityCategory: category });

      // Redirect to dashboard
      setTimeout(() => {
        router.push('/dashboard');
      }, 500);
    } catch (error) {
      console.error('Error selecting category:', error);
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25 }}
            className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-2xl w-full p-8"
          >
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent mb-2">
                Personalise Your Experience
              </h2>
              <p className="text-slate-600 dark:text-slate-300 text-lg">
                {isNewUser
                  ? 'Select your disability category to get started with features tailored for you'
                  : 'Choose your disability category to customize your dashboard'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {categories.map((category) => {
                const Icon = category.icon;
                const isSelected = selected === category.value;

                return (
                  <motion.button
                    key={category.value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelect(category.value)}
                    disabled={loading}
                    className={`p-6 rounded-2xl border-2 transition-all text-left overflow-hidden relative group ${
                      isSelected
                        ? `bg-gradient-to-br ${category.color} border-transparent text-white shadow-lg`
                        : 'border-slate-200 dark:border-slate-700 hover:border-emerald-400 dark:hover:border-emerald-500'
                    } ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    {/* Background glow effect */}
                    {isSelected && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 bg-white/20 pointer-events-none"
                      />
                    )}

                    <div className="relative z-10">
                      <div className="flex items-start gap-4">
                        <div
                          className={`p-3 rounded-xl transition-all ${
                            isSelected
                              ? 'bg-white/30'
                              : 'bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 group-hover:from-emerald-100 dark:group-hover:from-emerald-900'
                          }`}
                        >
                          <Icon size={28} className={isSelected ? 'text-white' : 'text-slate-700 dark:text-slate-300'} />
                        </div>
                        <div className="flex-1">
                          <h3 className={`font-bold text-lg ${isSelected ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                            {category.label}
                          </h3>
                          <p
                            className={`text-sm mt-1 ${
                              isSelected ? 'text-white/90' : 'text-slate-600 dark:text-slate-400'
                            }`}
                          >
                            {category.description}
                          </p>
                        </div>
                      </div>

                      {/* Checkmark for selected */}
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-3 right-3 bg-white/30 rounded-full p-1"
                        >
                          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </motion.div>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Continue Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={!selected || loading}
              className="w-full py-3 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Personalizing your dashboard...
                </>
              ) : (
                <>
                  Get Started
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </motion.button>

            <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-4">
              You can change this anytime in your profile settings
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
