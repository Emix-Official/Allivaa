'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navigation from '@/components/Layout/Navigation';
import { useThemeStore } from '@/store/themeStore';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, AlertCircle, Loader, ArrowRight } from 'lucide-react';
import { Chrome } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';

function AdminLoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const currentTheme = useThemeStore((state) => state.currentTheme);

  const redirect = (() => {
    const raw = params.get('redirect');
    if (!raw) return '/admin/dashboard';
    if (raw.startsWith('http://') || raw.startsWith('https://')) return '/admin/dashboard';
    if (!raw.startsWith('/')) return '/admin/dashboard';
    if (raw === '/admin/login' || raw.startsWith('/admin/login/')) return '/admin/dashboard';
    return raw;
  })();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!email || !password) {
        setError('Please enter both email and password');
        setLoading(false);
        return;
      }

      // For demo/development: accept any non-empty email and password as admin
      // No Firebase auth check; immediate admin profile creation and redirect
      const adminProfile = {
        uid: `admin-${Date.now()}`,
        email,
        displayName: email.split('@')[0] || 'Admin',
        role: 'admin' as const,
        createdAt: new Date(),
        lastLogin: new Date(),
      };

      useAuthStore.setState({
        profile: adminProfile,
        isAuthenticated: true,
        user: null,
        loading: false,
      });
      
      const { useProfileStore } = await import('@/store/profileStore');
      useProfileStore.getState().setProfile(adminProfile);

      setLoading(false);
      router.push(redirect);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  const handleGoogleAdmin = async () => {
    // Try Google sign-in and then navigate to admin if the profile has admin role
    try {
      const { useAuthStore } = await import('@/store/authStore');
      const signInWithGoogle = useAuthStore.getState().signInWithGoogle;
      await signInWithGoogle();
      const profile = (await import('@/store/profileStore')).useProfileStore.getState().profile;
      if (profile && profile.role === 'admin') {
        router.push(redirect);
      } else {
        setError('Google account does not have admin privileges.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google sign-in failed');
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
          className={`w-full max-w-md rounded-2xl backdrop-blur-xl border transition-all ${
            currentTheme === 'light'
              ? 'bg-white/80 border-slate-200 shadow-xl'
              : 'bg-slate-800/40 border-slate-700/50 shadow-2xl'
          } p-8`}
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="inline-block mb-4 p-3 rounded-xl bg-gradient-to-br from-emerald-600 to-cyan-600"
            >
              <Lock className="text-white" size={28} />
            </motion.div>
            <h1 className={`text-3xl font-black mb-2 ${
              currentTheme === 'light' ? 'text-slate-900' : 'text-white'
            }`}>
              Admin Portal
            </h1>
            <p className={`text-sm ${
              currentTheme === 'light' ? 'text-slate-600' : 'text-slate-400'
            }`}>
              Sign in to access admin controls
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-6 p-4 rounded-xl flex items-start gap-3 border-l-4 ${
                currentTheme === 'light'
                  ? 'bg-red-50 border-red-500 text-red-700'
                  : 'bg-red-900/20 border-red-600 text-red-400'
              }`}
            >
              <AlertCircle size={20} className="mt-0.5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className={`block text-sm font-semibold mb-2.5 ${
                currentTheme === 'light' ? 'text-slate-700' : 'text-slate-300'
              }`}>
                Email Address
              </label>
              <div className="relative">
                <Mail className={`absolute left-3 top-3 ${
                  currentTheme === 'light' ? 'text-slate-400' : 'text-slate-500'
                }`} size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all ${
                    currentTheme === 'light'
                      ? 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
                      : 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-400 focus:border-transparent'
                  } focus:outline-none`}
                  placeholder="admin@example.com"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className={`block text-sm font-semibold mb-2.5 ${
                currentTheme === 'light' ? 'text-slate-700' : 'text-slate-300'
              }`}>
                Password
              </label>
              <div className="relative">
                <Lock className={`absolute left-3 top-3 ${
                  currentTheme === 'light' ? 'text-slate-400' : 'text-slate-500'
                }`} size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className={`w-full pl-10 pr-10 py-3 rounded-xl border transition-all ${
                    currentTheme === 'light'
                      ? 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
                      : 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-400 focus:border-transparent'
                  } focus:outline-none`}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  className={`absolute right-3 top-3 transition-colors ${
                    currentTheme === 'light'
                      ? 'text-slate-400 hover:text-slate-600'
                      : 'text-slate-400 hover:text-slate-300'
                  } disabled:opacity-50`}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
            >
              {loading ? (
                <>
                  <Loader size={18} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={18} />
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-4 flex gap-2">
            <button type="button" onClick={handleGoogleAdmin} className="w-full py-2 px-3 rounded-lg bg-gray-100 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-gray-200 dark:hover:bg-slate-700">
              <Chrome size={16} /> Sign in with Google
            </button>
          </div>

          <div className="mt-6 pt-6 border-t" style={{
            borderColor: currentTheme === 'light' ? '#e2e8f0' : '#475569'
          }}>
            <p className={`text-center text-sm ${
              currentTheme === 'light' ? 'text-slate-600' : 'text-slate-400'
            }`}>
              Student user?{' '}
              <Link href="/login" className="font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent hover:underline">
                Go to student login
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <Loader size={40} className="animate-spin text-gray-400" />
      </div>
    }>
      <AdminLoginForm />
    </Suspense>
  );
}
