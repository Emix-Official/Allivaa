'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Layout/Navigation';
import { useThemeStore } from '@/store/themeStore';
import { Mail, Lock, Eye, EyeOff, AlertCircle, Loader, Chrome, ArrowRight } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export default function ProfessorLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const currentTheme = useThemeStore((s) => s.currentTheme);

  const signInWithGoogle = useAuthStore((s) => s.signInWithGoogle);

  const handleProfessorBypass = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Please enter email and password');
      setLoading(false);
      return;
    }

    // lightweight client-side professor bypass
    const adminProfile = {
      uid: `prof-${Date.now()}`,
      email,
      displayName: email.split('@')[0] || 'Professor',
      role: 'professor' as const,
      createdAt: new Date(),
      lastLogin: new Date(),
    };

    useAuthStore.setState({ profile: adminProfile, isAuthenticated: true, user: null });
    const { useProfileStore } = await import('@/store/profileStore');
    useProfileStore.getState().setProfile(adminProfile);

    setLoading(false);
    router.push('/professor/dashboard');
  };

  const handleGoogle = async () => {
    setError('');
    setLoading(true);
    try {
      await signInWithGoogle();
      const profile = (await import('@/store/profileStore')).useProfileStore.getState().profile;
      if (profile && profile.role === 'professor') {
        router.push('/professor/dashboard');
      } else {
        setError('Google account is not a professor account.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${currentTheme === 'light' ? 'from-slate-50 to-slate-100' : 'from-slate-950 via-slate-900 to-slate-950'}`}>
      <Navigation />

      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4">
        <div className={`w-full max-w-md rounded-2xl p-8 ${currentTheme === 'light' ? 'bg-white/80 border-slate-200' : 'bg-slate-800/40 border-slate-700/50'}`}>
          <h1 className="text-2xl font-bold mb-4">Professor Portal</h1>

          {error && <div className="mb-4 p-3 rounded bg-red-50 text-red-700">{error}</div>}

          <form onSubmit={handleProfessorBypass} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
                <input value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full pl-10 pr-4 py-3 rounded-xl border bg-white/80" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full pl-10 pr-10 py-3 rounded-xl border bg-white/80" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-slate-400">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full py-3 rounded bg-indigo-600 text-white">{loading ? 'Signing in...' : 'Sign In as Professor (Bypass)'}</button>
          </form>

          <div className="mt-4">
            <button onClick={handleGoogle} disabled={loading} className="w-full py-2 px-3 rounded-lg bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-sm font-semibold flex items-center justify-center gap-2">
              <Chrome size={16} /> Sign in with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
