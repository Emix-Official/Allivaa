'use client';

import { useAccessibilityStore } from '@/store/accessibilityStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Captions, Bell, Video, FileText, Users, Hand } from 'lucide-react';
import Link from 'next/link';
import UploadPanel from '@/components/UI/UploadPanel';

export default function DeafDashboard() {
  const { captionsEnabled, toggleCaptions, visualAlertsEnabled, toggleVisualAlerts } = useAccessibilityStore();

  const features = [
    {
      label: captionsEnabled ? 'Disable Live Captions' : 'Enable Live Captions',
      icon: Captions,
      action: toggleCaptions,
      description: 'Toggle real-time captions for all audio content.',
    },
    {
      label: 'Sign-to-Text',
      icon: Hand,
      href: '/sign-to-text',
      description: 'Translate sign language into text via your camera.',
    },
    {
      label: 'Text-to-Sign',
      icon: Video,
      href: '/text-to-sign',
      description: 'Convert written text into sign language animations.',
    },
    {
      label: 'Request Interpreter',
      icon: Users,
      href: '/accommodation-request?service=Sign%20Language%20Interpretation',
      description: 'Schedule a sign language interpreter for a class.',
    },
    {
      label: visualAlertsEnabled ? 'Disable Visual Alerts' : 'Enable Visual Alerts',
      icon: Bell,
      action: toggleVisualAlerts,
      description: 'Receive visual notifications for important alerts.',
    },
  ];

  const scheduledSessions = [
    { title: 'CHEM101 Lecture', time: 'Tomorrow at 10:00 AM', interpreter: 'John Doe' },
    { title: 'HIST205 Study Group', time: 'Friday at 2:00 PM', interpreter: 'Jane Smith' },
  ];

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-12">
        <h2 className="text-3xl font-bold mb-6">Hearing-Assist Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Link href={feature.href || '#'} key={feature.label} className="group">
              <div
                onClick={feature.action}
                className={`bg-slate-800/50 p-6 rounded-xl border border-cyan-500/20 hover:border-cyan-500/50 transition-all h-full flex flex-col cursor-pointer bg-gradient-to-br hover:from-slate-800/50 ${feature.action ? `hover:to-cyan-900/40` : `hover:to-slate-900/20`}`}
              >
                <div className="flex-shrink-0 mb-4">
                  <feature.icon size={28} className="text-cyan-400" />
                </div>
                <h4 className="font-bold text-xl mb-2">{feature.label}</h4>
                <p className="text-gray-400 text-sm flex-grow">{feature.description}</p>
                <div className="mt-4 text-cyan-400 font-medium group-hover:underline">
                  {feature.href ? 'Access Tool →' : 'Activate'}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <h3 className="text-2xl font-bold mb-6">Scheduled Interpretations</h3>
        <div className="space-y-4">
          {scheduledSessions.map((session, idx) => (
            <div key={idx} className="p-4 bg-slate-800/50 rounded-lg border-l-4 border-cyan-500 flex justify-between items-center">
              <div>
                <p className="font-semibold">{session.title}</p>
                <p className="text-xs text-gray-400">Interpreter: {session.interpreter}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-cyan-400">{session.time}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
      <div className="mt-8">
        <UploadPanel />
      </div>
    </>
  );
}