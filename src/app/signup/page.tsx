'use client';

import Navigation from '@/components/Layout/Navigation';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useThemeStore } from '@/store/themeStore';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, AlertCircle, Loader, GraduationCap, Eye as EyeDisabled, Volume2, Ear, ArrowRight, CheckCircle2, Chrome } from 'lucide-react';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [university, setUniversity] = useState('');
  const [category, setCategory] = useState<'blind' | 'mute' | 'deaf' | 'general'>('general');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  
  // Select individual fields to avoid unnecessary re-renders
  const register = useAuthStore((state) => state.register);
  const authError = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);
  const currentTheme = useThemeStore((state) => state.currentTheme);

  useEffect(() => {
    setMounted(true);
    return () => {
      clearError();
    };
  }, [clearError]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!name || !email || !password || !confirmPassword || !university) {
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

      if (password !== confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }

      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        setLoading(false);
        return;
      }

      // Use the register action from the store and save university
      await register(email, password, name, category);
      
      // Store university in profile after registration
      const { useProfileStore } = await import('@/store/profileStore');
      const profile = useProfileStore.getState().profile;
      if (profile) {
        await useProfileStore.getState().updateProfile({ department: university });
      }
      
  clearError();

  // After signup go to the main dashboard (keep the previous behaviour)
  router.push('/dashboard');
    } catch (err) {
      console.error('Signup failed:', err);
      const errorMessage = 
        err instanceof Error ? err.message : 'Signup failed. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { value: 'general', label: 'General Student', Icon: GraduationCap },
    { value: 'blind', label: 'Blind Student', Icon: EyeDisabled },
    { value: 'mute', label: 'Mute Student', Icon: Volume2 },
    { value: 'deaf', label: 'Deaf Student', Icon: Ear },
  ];

  if (!mounted) {
    return null;
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${currentTheme === 'light' ? 'from-slate-50 to-slate-100' : 'from-slate-950 via-slate-900 to-slate-950'}`}>
      <Navigation />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`rounded-3xl overflow-hidden border backdrop-blur-xl transition-all shadow-2xl ${
            currentTheme === 'light'
              ? 'bg-white/80 border-white/30 shadow-lg shadow-slate-200/30'
              : 'bg-slate-900/50 border-slate-700/30 shadow-lg shadow-black/40'
          }`}
        >
          <div className="p-8 sm:p-10">
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="inline-block mb-4 p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500"
              >
                <User className="text-white" size={28} />
              </motion.div>
              <h1 className={`text-4xl font-black mb-2 ${
                currentTheme === 'light' ? 'text-slate-900' : 'text-white'
              }`}>
                Join SenseAid
              </h1>
              <p className={`text-sm ${
                currentTheme === 'light' ? 'text-slate-600' : 'text-slate-400'
              }`}>
                Create your account and start learning today
              </p>
            </div>

            <form onSubmit={handleSignup} className="space-y-6">
              {(error || authError) && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-xl flex items-start gap-3 border-l-4 ${
                    currentTheme === 'light'
                      ? 'bg-red-50 border-red-500 text-red-700'
                      : 'bg-red-900/20 border-red-600 text-red-400'
                  }`}
                >
                  <AlertCircle size={20} className="mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-sm">Error</p>
                    <p className="text-xs mt-0.5">{error || authError}</p>
                  </div>
                </motion.div>
              )}

              {/* Name */}
              <div>
                <label className={`block text-sm font-semibold mb-2.5 ${
                  currentTheme === 'light' ? 'text-slate-700' : 'text-slate-300'
                }`}>
                  Full Name
                </label>
                <div className="relative">
                  <User className={`absolute left-3 top-3 ${
                    currentTheme === 'light' ? 'text-slate-400' : 'text-slate-500'
                  }`} size={20} />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border backdrop-blur-md transition-all ${currentTheme === 'light' ? 'bg-white/70 border-white/40 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-emerald-500' : 'bg-white/10 border-white/20 text-white placeholder-slate-300 focus:ring-2 focus:ring-emerald-400'} focus:outline-none`}
                    placeholder="John Doe"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

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
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border backdrop-blur-md transition-all ${currentTheme === 'light' ? 'bg-white/70 border-white/40 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-emerald-500' : 'bg-white/10 border-white/20 text-white placeholder-slate-300 focus:ring-2 focus:ring-emerald-400'} focus:outline-none`}
                    placeholder="you@example.com"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className={`block text-sm font-semibold mb-3.5 ${
                  currentTheme === 'light' ? 'text-slate-700' : 'text-slate-300'
                }`}>
                  I am a
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {categories.map((cat) => {
                    const isSelected = category === cat.value;
                    return (
                      <motion.button
                        key={cat.value}
                        type="button"
                        onClick={() => setCategory(cat.value as typeof category)}
                        disabled={loading}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`p-4 rounded-xl border-2 transition-all text-center disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden ${
                          isSelected
                            ? 'bg-gradient-to-br from-emerald-600 to-cyan-500 border-transparent text-white shadow-lg'
                            : currentTheme === 'light'
                              ? 'border-slate-200 text-slate-700 hover:border-slate-300 bg-white'
                              : 'border-slate-600 text-slate-300 hover:border-slate-500 bg-slate-700/20'
                        }`}
                      >
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-2 right-2"
                          >
                            <CheckCircle2 size={20} />
                          </motion.div>
                        )}
                        <div className="mb-2 flex justify-center">
                          <cat.Icon size={32} />
                        </div>
                        <p className="text-sm font-semibold">{cat.label}</p>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* University */}
              <div>
                <label className={`block text-sm font-semibold mb-2.5 ${
                  currentTheme === 'light' ? 'text-slate-700' : 'text-slate-300'
                }`}>
                  University
                </label>
                <div className="relative">
                  <GraduationCap className={`absolute left-3 top-3 ${
                    currentTheme === 'light' ? 'text-slate-400' : 'text-slate-500'
                  }`} size={20} />
                  <input
                    type="text"
                    value={university}
                    onChange={(e) => setUniversity(e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border backdrop-blur-md transition-all ${currentTheme === 'light' ? 'bg-white/70 border-white/40 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-emerald-500' : 'bg-white/10 border-white/20 text-white placeholder-slate-300 focus:ring-2 focus:ring-emerald-400'} focus:outline-none`}
                    placeholder="e.g., University of Lagos"
                    required
                    disabled={loading}
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
                    className={`w-full pl-10 pr-10 py-3 rounded-xl border backdrop-blur-md transition-all ${currentTheme === 'light' ? 'bg-white/70 border-white/40 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-emerald-500' : 'bg-white/10 border-white/20 text-white placeholder-slate-300 focus:ring-2 focus:ring-emerald-400'} focus:outline-none`}
                    placeholder="••••••••"
                    required
                    disabled={loading}
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

              {/* Confirm Password */}
              <div>
                <label className={`block text-sm font-semibold mb-2.5 ${
                  currentTheme === 'light' ? 'text-slate-700' : 'text-slate-300'
                }`}>
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className={`absolute left-3 top-3 ${
                    currentTheme === 'light' ? 'text-slate-400' : 'text-slate-500'
                  }`} size={20} />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full pl-10 pr-10 py-3 rounded-xl border backdrop-blur-md transition-all ${currentTheme === 'light' ? 'bg-white/70 border-white/40 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-emerald-500' : 'bg-white/10 border-white/20 text-white placeholder-slate-300 focus:ring-2 focus:ring-emerald-400'} focus:outline-none`}
                    placeholder="••••••••"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={loading}
                    className={`absolute right-3 top-3 transition-colors ${
                      currentTheme === 'light'
                        ? 'text-slate-400 hover:text-slate-600'
                        : 'text-slate-400 hover:text-slate-300'
                    } disabled:opacity-50`}
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="terms"
                  className={`w-5 h-5 rounded border-2 cursor-pointer ${
                    currentTheme === 'light'
                      ? 'border-slate-300 accent-indigo-600'
                      : 'border-slate-600 accent-indigo-500'
                  }`}
                  required
                  disabled={loading}
                />
                <label htmlFor="terms" className={`text-sm cursor-pointer ${
                  currentTheme === 'light' ? 'text-slate-700' : 'text-slate-300'
                }`}>
                  I agree to the Terms of Service and Privacy Policy
                </label>
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
                    Creating Account...
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </motion.button>
            </form>

            <div className="mt-8 pt-6 border-t" style={{
              borderColor: currentTheme === 'light' ? '#e2e8f0' : '#475569'
            }}>
              <p className={`text-center text-sm ${
                currentTheme === 'light' ? 'text-slate-600' : 'text-slate-400'
              }`}>
                Already have an account?{' '}
                <Link
                  href="/login"
                  className="font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </div>

              {/* Shortcut to Google sign-in flow */}
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
