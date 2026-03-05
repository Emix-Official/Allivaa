'use client';

import Navigation from '@/components/Layout/Navigation';
import { useAuthStore } from '@/store/authStore';
import { useThemeStore } from '@/store/themeStore';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Chrome, Loader, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import DisabilityCategoryModal from '@/components/DisabilityCategoryModal';

export default function SignInGooglePage() {
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const signInWithGoogle = useAuthStore((state) => state.signInWithGoogle);
  const authError = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);
  const currentTheme = useThemeStore((state) => state.currentTheme);

  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);

    try {
      // Sign in without category, will show modal after
      await signInWithGoogle();
      clearError();
      setShowCategoryModal(true);
    } catch {
      setError(authError || 'Google sign-in failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${currentTheme === 'light' ? 'from-slate-50 to-slate-100' : 'from-slate-950 via-slate-900 to-slate-950'}`}>
      <Navigation />
      
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`w-full max-w-md p-8 rounded-3xl shadow-2xl border backdrop-blur-xl transition-all ${
            currentTheme === 'light'
              ? 'bg-white/80 border-white/30 shadow-lg shadow-slate-200/30'
              : 'bg-slate-900/50 border-slate-700/30 shadow-lg shadow-black/40'
          }`}
        >
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Chrome size={40} className={`text-emerald-600 ${currentTheme === 'dark' ? 'text-cyan-400' : ''}`} />
            </div>
            <h1 className={`text-3xl font-bold mb-2 ${currentTheme === 'light' ? 'text-slate-900' : 'text-white'}`}>
              Sign in with Google
            </h1>
            <p className={currentTheme === 'light' ? 'text-slate-600' : 'text-slate-300'}>
              Connect with your Google account to get started
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-6 p-4 rounded-lg flex items-start gap-3 border-l-4 border-red-500 ${
                currentTheme === 'light' ? 'bg-red-50' : 'bg-red-900/20'
              }`}
            >
              <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
              <p className={`text-sm ${currentTheme === 'light' ? 'text-red-700' : 'text-red-400'}`}>{error}</p>
            </motion.div>
          )}

          {/* Category selection moved to modal after sign-in */}

          {/* Google Sign-In Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGoogleSignIn}
            disabled={loading}
            className={`w-full py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all bg-gradient-to-r from-emerald-600 to-cyan-600 text-white hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {loading ? (
              <>
                <Loader size={20} className="animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <Chrome size={20} />
                Continue with Google
              </>
            )}
          </motion.button>

          <div className="mt-6 text-center">
            <p className={currentTheme === 'light' ? 'text-slate-600' : 'text-slate-300'}>
              Or{' '}
              <Link href="/signup" className="font-semibold text-emerald-600 hover:text-emerald-700 hover:underline">
                sign up with email
              </Link>
            </p>
          </div>

          <div className="mt-4 text-center">
            <p className={currentTheme === 'light' ? 'text-slate-600' : 'text-slate-300'}>
              Already have an account?{' '}
              <Link href="/login" className="font-semibold text-emerald-600 hover:text-emerald-700 hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
      <DisabilityCategoryModal
        isOpen={showCategoryModal}
        isNewUser={false}
        onSelectCategory={async (category: 'blind' | 'deaf' | 'mute' | 'general') => {
          const { useProfileStore } = await import('@/store/profileStore');
          await useProfileStore.getState().updateProfile({ disabilityCategory: category });
          setShowCategoryModal(false);
          router.push('/dashboard');
        }}
      />
    </div>
  );
}
