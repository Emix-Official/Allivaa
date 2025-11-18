'use client';

import Navigation from '@/components/Layout/Navigation';
import { useAuthStore } from '@/store/authStore';
import { useProfileStore } from '@/store/profileStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useThemeStore } from '@/store/themeStore';
import { motion } from 'framer-motion';
import { Mail, MapPin, Award, Book, LogOut } from 'lucide-react';
import { useAccessibilityStore } from '@/store/accessibilityStore';

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user);
  const authLoading = useAuthStore((state) => state.loading);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);
  const profileLoading = useProfileStore((state) => state.loading);
  const profile = useProfileStore((state) => state.profile);
  const router = useRouter();
  const colors = useThemeStore((state) => state.colors);
  const highContrastPref = useAccessibilityStore((s) => s.highContrast);
  const dyslexicPref = useAccessibilityStore((s) => s.dyslexicFont);
  const accFontSize = useAccessibilityStore((s) => s.fontSize);
  const toggleHighContrastPref = useAccessibilityStore((s) => s.toggleHighContrast);
  const toggleDyslexicPref = useAccessibilityStore((s) => s.toggleDyslexicFont);
  const setAccFontSize = useAccessibilityStore((s) => s.setFontSize);

  useEffect(() => {
    // Only redirect if auth has finished loading AND user is not authenticated
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  // Show loading while auth is initializing
  if (authLoading || profileLoading) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${colors.bgDark}`}>
        <Navigation />
        <div className="flex items-center justify-center h-64">
          <Award className="animate-spin text-purple-400" size={48} />
        </div>
      </div>
    );
  }

  // If user is not authenticated after loading, don't render anything (will redirect)
  if (!isAuthenticated || !user || !profile) {
    return null;
  }

  const handleLogout = async () => {
    try {
      logout();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${colors.bgDark} text-white`}>
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-5xl font-bold mb-2">My Profile</h1>
          <p className={`text-lg ${colors.textMuted}`}>Manage your account and preferences</p>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`bg-gradient-to-br ${colors.bgLight} rounded-2xl p-8 border border-slate-700/50 mb-8`}
        >
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            {/* Avatar */}
            <div
              className={`w-32 h-32 rounded-full bg-gradient-to-br ${colors.primary} flex items-center justify-center text-5xl font-bold flex-shrink-0`}
            >
              {profile.displayName.charAt(0).toUpperCase()}
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-bold mb-2">{profile.displayName}</h2>
              <p className="text-gray-400 mb-6">
                {profile.disabilityCategory === 'general'
                  ? 'General Student'
                  : profile.disabilityCategory === 'blind'
                  ? 'Blind Student'
                  : profile.disabilityCategory === 'mute'
                  ? 'Mute Student'
                  : 'Deaf Student'}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 justify-center md:justify-start">
                  <Mail size={18} className={`bg-gradient-to-br ${colors.primary} bg-clip-text text-transparent`} />
                  <span className="text-gray-300">{profile.email}</span>
                </div>
                <div className="flex items-center gap-3 justify-center md:justify-start">
                  <Award size={18} className={`bg-gradient-to-br ${colors.primary} bg-clip-text text-transparent`} />
                  <span className="text-gray-300">{profile.studentId}</span>
                </div>
                <div className="flex items-center gap-3 justify-center md:justify-start">
                  <Book size={18} className={`bg-gradient-to-br ${colors.primary} bg-clip-text text-transparent`} />
                  <span className="text-gray-300">{profile.department}</span>
                </div>
                <div className="flex items-center gap-3 justify-center md:justify-start">
                  <MapPin size={18} className={`bg-gradient-to-br ${colors.primary} bg-clip-text text-transparent`} />
                  <span className="text-gray-300">Active</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-3 gap-6 mb-8"
        >
          {[
            { label: 'Courses Enrolled', value: 0 },
            {
              label: 'Join Date',
              value: new Date(profile.createdAt).toLocaleDateString(),
            },
            { label: 'Account Status', value: 'Active' },
          ].map((stat, idx) => (
            <div
              key={idx}
              className={`bg-gradient-to-br ${colors.bgLight} rounded-xl p-6 border border-slate-700/50`}
            >
              <p className="text-sm text-gray-400 mb-2">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          ))}
        </motion.div>

        {/* Enrolled Courses */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`bg-gradient-to-br ${colors.bgLight} rounded-2xl p-8 border border-slate-700/50 mb-8`}
        >
          <h3 className="text-2xl font-bold mb-6">Enrolled Courses</h3>
          {/* {user.courses.length > 0 ? (
            <div className="grid gap-4">
              {user.courses.map((courseId: any, idx: any) => (
                <motion.div
                  key={idx}
                  whileHover={{ x: 5 }}
                  className={`p-4 bg-slate-800/50 rounded-lg border border-slate-700/50 hover:border-slate-600 transition-colors`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-lg bg-gradient-to-br ${colors.primary} flex items-center justify-center font-bold`}
                    >
                      {courseId.substring(0, 2)}
                    </div>
                    <div>
                      <p className="font-semibold">{courseId}</p>
                      <p className="text-sm text-gray-400">Currently enrolled</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div> */}
          ) : (
            <p className="text-gray-400">No courses enrolled yet</p>
          )
        </motion.div>

        {/* Settings Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`bg-gradient-to-br ${colors.bgLight} rounded-2xl p-8 border border-slate-700/50 mb-8`}
        >
          <h3 className="text-2xl font-bold mb-6">Account Settings</h3>
          <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                <div>
                  <p className="font-semibold">High Contrast</p>
                  <p className="text-sm text-gray-400">Increase color contrast for readability</p>
                </div>
                <label className="inline-flex items-center">
                  <input type="checkbox" checked={highContrastPref} onChange={() => { toggleHighContrastPref(); useProfileStore.getState().updateProfile({ highContrast: !highContrastPref }); }} className="mr-2" />
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                <div>
                  <p className="font-semibold">Dyslexic Font</p>
                  <p className="text-sm text-gray-400">Enable dyslexia-friendly font</p>
                </div>
                <label className="inline-flex items-center">
                  <input type="checkbox" checked={dyslexicPref} onChange={() => { toggleDyslexicPref(); useProfileStore.getState().updateProfile({ dyslexicFont: !dyslexicPref }); }} className="mr-2" />
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                <div>
                  <p className="font-semibold">Text Size</p>
                  <p className="text-sm text-gray-400">Adjust the base text size for the site</p>
                </div>
                <div className="flex items-center gap-2">
                  <select value={accFontSize} onChange={(e) => { const val = e.target.value as any; setAccFontSize(val); useProfileStore.getState().updateProfile({ fontSize: val }); }} className="bg-slate-800/40 rounded p-2">
                    <option value="small">Small</option>
                    <option value="normal">Normal</option>
                    <option value="large">Large</option>
                    <option value="xlarge">Extra Large</option>
                  </select>
                </div>
              </div>
            </div>
        </motion.div>

        {/* Logout Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex gap-4"
        >
          <button
            onClick={handleLogout}
            className={`flex-1 py-3 px-6 bg-gradient-to-r ${colors.primary} rounded-lg hover:shadow-lg transition-all font-semibold flex items-center justify-center gap-2`}
          >
            <LogOut size={20} />
            Logout
          </button>
          <button
            onClick={() => router.back()}
            className="flex-1 py-3 px-6 border border-slate-600 rounded-lg hover:bg-slate-700/50 transition-all font-semibold"
          >
            Back
          </button>
        </motion.div>
      </div>
    </div>
  );
}
