'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Navigation from '@/components/Layout/Navigation';
import { useAuthStore } from '@/store/authStore';
import { useThemeStore } from '@/store/themeStore';
import { useRouter } from 'next/navigation';
import BlindDashboard from './BlindDashboard';
import DeafDashboard from './DeafDashboard';
import MuteDashboard from './MuteDashboard';
import GeneralDashboard from './GeneralDashboard';
import VideoManager from '@/components/UI/VideoManager';
import { LoaderCircle } from 'lucide-react';


export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const profile = useAuthStore((state) => state.profile);
  const loading = useAuthStore((state) => state.loading);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const router = useRouter();
  const colors = useThemeStore((state) => state.colors);

  useEffect(() => {
    // Only redirect if auth has finished loading AND user is not authenticated
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  // Show loading while auth is initializing
  if (loading) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${colors.bgDark}`}>
        <Navigation />
        <div className="flex justify-center items-center h-64">
          <LoaderCircle className="animate-spin text-purple-400" size={48} />
        </div>
      </div>
    );
  }

  // If user is not authenticated after loading, don't render anything (will redirect)
  if (!isAuthenticated || !user) {
    return null;
  }

  const renderDashboard = () => {
    if (loading || !profile) {
      return (
        <div className="flex justify-center items-center h-64">
          <LoaderCircle className="animate-spin text-purple-400" size={48} />
        </div>
      );
    }
    if (!profile) {
      return <GeneralDashboard />; // Default or loading state
    }
    switch (profile?.disabilityCategory) {
      case 'blind':
        return <BlindDashboard />;
      case 'deaf':
        return <DeafDashboard />;
      case 'mute':
        return <MuteDashboard />;
      default:
        return <GeneralDashboard />;
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${colors.bgDark}`}>
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className={`text-4xl font-bold mb-2 ${colors.text}`}>
            Welcome back,{' '}
            <span className="text-purple-400">
              {profile?.displayName || user.email?.split('@')[0]}
            </span>
            !
          </h1>
          <p className={colors.textMuted}>
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </motion.div>

        {renderDashboard()}

        {/* Videos manager integrated into the existing signed-in dashboard */}
        <VideoManager />
      </div>
    </div>
  );
}