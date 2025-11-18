'use client';

import Navigation from '@/components/Layout/Navigation';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useProfileStore, UserProfile } from '@/store/profileStore';
import { useThemeStore } from '@/store/themeStore';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, AlertCircle, Loader, Chrome, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  
  // Select individual fields to avoid unnecessary re-renders
  const login = useAuthStore((state) => state.login);
  const authError = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);
  const currentTheme = useThemeStore((state) => state.currentTheme);

  useEffect(() => {
    setMounted(true);
    return () => {
      clearError();
    };
  }, [clearError]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!email || !password) {
        setError('Please fill in all fields');
        setLoading(false);
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError('Please enter a valid email address');
        setLoading(false);
        return;
      }

      // Admin login: bypass Firebase auth, accept any email/password
      if (isAdminLogin) {
        // Create a lightweight admin profile and mark the session as authenticated.
        // Persist to both auth store and profile store so UI (Navigation, Admin page)
        // recognizes the admin session even without a real Firebase User object.
        const adminProfile: UserProfile = {
          uid: 'admin-bypass',
          email,
          displayName: email.split('@')[0] || 'Admin',
          role: 'admin',
          createdAt: new Date(),
          lastLogin: new Date(),
        } as UserProfile;

        // Set auth store state (profile + isAuthenticated). We intentionally don't set a real Firebase User.
        useAuthStore.setState({ profile: adminProfile, isAuthenticated: true, user: null });
        // Also set profile store so other parts that read from profile store stay consistent.
        useProfileStore.getState().setProfile(adminProfile);

        router.push('/admin');
        return;
      }

    // Student login: use Firebase auth
    await login(email, password);
    clearError();
    // return to the original dashboard after sign-in
    router.push('/dashboard');
    } catch (err) {
      console.error('Login failed:', err);
      const errorMessage = 
        err instanceof Error ? err.message : 'Login failed. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return null;
  }
  return (
    <div className={`min-h-screen bg-gradient-to-br ${currentTheme === 'light' ? 'from-slate-50 to-slate-100' : 'from-slate-950 via-slate-900 to-slate-950'}`}>
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={`rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-2 shadow-2xl border backdrop-blur-xl transition-all ${
            currentTheme === 'light'
              ? 'bg-white/80 border-white/30 shadow-lg shadow-slate-200/30'
              : 'bg-slate-900/50 border-slate-700/30 shadow-lg shadow-black/40'
          }`}
        >
          {/* Left: Illustration / branding */}
          <div className="p-10 bg-gradient-to-br from-emerald-600 to-cyan-600 text-white flex flex-col justify-center items-start gap-6">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="rounded-xl p-3 bg-white/10">
              <Lock size={28} />
            </motion.div>
            <div>
              <h2 className="text-3xl font-extrabold">Welcome back</h2>
              <p className="mt-2 text-sm opacity-90">Sign in and continue learning with SenseAid.</p>
            </div>
            <div className="mt-4 text-sm opacity-90">
              <p>Need an account? <Link href="/signup" className="underline font-semibold">Create one</Link></p>
              <p className="mt-2 text-xs">Admin access is available via the Admin tab.</p>
            </div>
          </div>

          {/* Right: Form */}
          <div className="p-8 sm:p-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className={`text-2xl font-bold ${currentTheme === 'light' ? 'text-slate-900' : 'text-white'}`}>Sign in</h3>
                <p className={`text-sm ${currentTheme === 'light' ? 'text-slate-600' : 'text-slate-300'}`}>Sign in to your {isAdminLogin ? 'admin' : 'SenseAid'} account</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setIsAdminLogin(false); setError(''); }} className={`px-3 py-1 rounded-lg text-sm font-semibold backdrop-blur-md transition-all ${!isAdminLogin ? 'bg-emerald-100/60 text-emerald-700' : `${currentTheme === 'light' ? 'bg-white/40 text-slate-600' : 'bg-slate-700/30 text-slate-400'}`}`}>Student</button>
                <button onClick={() => { setIsAdminLogin(true); setError(''); }} className={`px-3 py-1 rounded-lg text-sm font-semibold backdrop-blur-md transition-all ${isAdminLogin ? 'bg-emerald-100/60 text-emerald-700' : `${currentTheme === 'light' ? 'bg-white/40 text-slate-600' : 'bg-slate-700/30 text-slate-400'}`}`}>Admin</button>
              </div>
            </div>

            { (error || authError) && (
              <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="p-3 rounded-md bg-red-50 text-red-700 mb-4 border border-red-200">
                <div className="flex items-start gap-3">
                  <AlertCircle size={18} />
                  <div>
                    <strong className="block">Error</strong>
                    <div className="text-xs mt-1">{error || authError}</div>
                  </div>
                </div>
              </motion.div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <label className={`block text-sm font-medium ${currentTheme === 'light' ? 'text-slate-900' : 'text-white'}`}>Email address</label>
              <div className="relative">
                <Mail className={`absolute left-3 top-3 ${currentTheme === 'light' ? 'text-slate-400' : 'text-slate-400'}`} size={18} />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required disabled={loading} className={`w-full pl-10 pr-4 py-3 rounded-xl border backdrop-blur-md transition-all ${currentTheme === 'light' ? 'bg-white/70 border-white/40 text-slate-900 placeholder-slate-400' : 'bg-white/10 border-white/20 text-white placeholder-slate-300'} focus:outline-none focus:ring-2 focus:ring-emerald-500`} />
              </div>

              <label className={`block text-sm font-medium ${currentTheme === 'light' ? 'text-slate-900' : 'text-white'}`}>Password</label>
              <div className="relative">
                <Lock className={`absolute left-3 top-3 ${currentTheme === 'light' ? 'text-slate-400' : 'text-slate-400'}`} size={18} />
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required disabled={loading} className={`w-full pl-10 pr-10 py-3 rounded-xl border backdrop-blur-md transition-all ${currentTheme === 'light' ? 'bg-white/70 border-white/40 text-slate-900 placeholder-slate-400' : 'bg-white/10 border-white/20 text-white placeholder-slate-300'} focus:outline-none focus:ring-2 focus:ring-emerald-500`} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className={`absolute right-3 top-3 ${currentTheme === 'light' ? 'text-slate-400' : 'text-slate-300'}`}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input id="remember" type="checkbox" className="h-4 w-4" />
                  <label htmlFor="remember" className={`text-sm ${currentTheme === 'light' ? 'text-slate-900' : 'text-white'}`}>Remember me</label>
                </div>
                {!isAdminLogin && <Link href="/forgot-password" className="text-sm text-emerald-600 hover:text-emerald-700">Forgot?</Link>}
              </div>

              <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full py-3 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2 backdrop-blur-sm">
                {loading ? (<><Loader size={16} className="animate-spin"/> Signing in...</>) : (<><span>Sign In</span><ArrowRight size={18} /></>)}
              </motion.button>
            </form>

            <div className={`mt-6 text-center text-sm ${currentTheme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
              Don't have an account? <Link href="/signup" className="font-semibold text-emerald-600 hover:text-emerald-700">Sign up</Link>
            </div>
            
            {/* Google sign-in shortcut (redirect to the Google sign-in flow) */}
            <div className="mt-4 text-center">
              <Link href="/signin-google" className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg backdrop-blur-md border text-sm font-semibold transition-all ${currentTheme === 'light' ? 'bg-white/50 border-white/40 text-slate-900 hover:bg-white/70' : 'bg-white/10 border-white/20 text-white hover:bg-white/20'}`}>
                <Chrome size={16} /> Continue with Google
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
