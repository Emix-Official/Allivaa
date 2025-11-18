'use client';

import { motion } from 'framer-motion';
import { FileText, MessageSquare, Settings, LifeBuoy, GraduationCap } from 'lucide-react';
import Link from 'next/link';
import { useThemeStore } from '@/store/themeStore';
import UploadPanel from '@/components/UI/UploadPanel';
import MediaControlPanel from '@/components/UI/MediaControlPanel';

export default function GeneralDashboard() {
  const { currentTheme } = useThemeStore();
  
  const features = [
    {
      label: 'View All Courses',
      icon: GraduationCap,
      href: '/courses',
      description: 'Browse and enroll in available courses.',
    },
    {
      label: 'My Assignments',
      icon: FileText,
      href: '/assignments',
      description: 'View upcoming and submitted assignments.',
    },
    {
      label: 'Request Accommodations',
      icon: LifeBuoy,
      href: '/accommodation-request',
      description: 'Request special accommodations for your courses.',
    },
     {
      label: 'Contact a Lecturer',
      description: 'Send a message to any of your lecturers for help.',
      icon: MessageSquare,
      href: '/messages',
    },
    {
      label: 'Accessibility Settings',
      description: 'Customize your experience with themes and other options.',
      icon: Settings,
      href: '/profile#settings',
    },
  ];

  const cardBgClass = currentTheme === 'light' 
    ? 'bg-blue-50 border-blue-200 hover:border-blue-300'
    : 'bg-slate-800/50 border-slate-700/50 hover:border-slate-600/80';
    
  const iconColorClass = currentTheme === 'light' ? 'text-blue-600' : 'text-slate-400';
  const textColorClass = currentTheme === 'light' ? 'text-gray-700' : 'text-gray-400';
  const headingClass = currentTheme === 'light' ? 'text-gray-900' : 'text-white';
  const linkColorClass = currentTheme === 'light' ? 'text-blue-600' : 'text-slate-400';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mb-12"
    >
      <h2 className={`text-3xl font-bold mb-6 ${headingClass}`}>Student Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => (
          <Link href={feature.href || '#'} key={feature.label} className="group">
            <div
              className={`${cardBgClass} p-6 rounded-xl border transition-all h-full flex flex-col cursor-pointer hover:shadow-lg`}
            >
              <div className="flex-shrink-0 mb-4">
                <feature.icon size={28} className={iconColorClass} />
              </div>
              <h4 className={`font-bold text-xl mb-2 ${headingClass}`}>{feature.label}</h4>
              <p className={`${textColorClass} text-sm flex-grow`}>{feature.description}</p>
              <div className={`mt-4 ${linkColorClass} font-medium group-hover:underline`}>
                Access Tool →
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      {/* Uploads & Sign Demo */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <UploadPanel />
        </div>
        <div>
          <div className={`p-4 bg-gradient-to-br ${currentTheme === 'light' ? 'from-white to-white' : 'from-slate-800 to-slate-700'} rounded-xl border`}>
            <h3 className="font-semibold mb-2">Live Sign Demo</h3>
            <p className="text-sm text-gray-500 mb-3">Try the sign-language camera demo here.</p>
            <MediaControlPanel name="Live Sign Demo" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}