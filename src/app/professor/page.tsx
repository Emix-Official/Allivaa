'use client';

import Navigation from '@/components/Layout/Navigation';
import { useAuthStore } from '@/store/authStore';
import { useThemeStore } from '@/store/themeStore';
import { motion } from 'framer-motion';

export default function ProfessorDashboard() {
  const profile = useAuthStore((s) => s.profile);
  const colors = useThemeStore((s) => s.colors);

  if (!profile || profile.role !== 'professor') {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${colors.bgDark}`}>
        <Navigation />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Access Denied</h1>
            <p className="text-gray-600 dark:text-gray-400">You need professor privileges to access this page.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${colors.bgDark}`}>
      <Navigation />
      <div className="max-w-6xl mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold mb-4">Professor Dashboard</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">Welcome, {profile.displayName}. Manage your courses and students here.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 rounded-xl bg-white dark:bg-slate-800 border">
            <h3 className="font-semibold mb-2">My Courses</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Create and manage course materials, assignments, and grading.</p>
          </div>
          <div className="p-6 rounded-xl bg-white dark:bg-slate-800 border">
            <h3 className="font-semibold mb-2">Student Requests</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">View accommodation requests and messages from students.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
