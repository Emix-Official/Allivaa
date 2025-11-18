'use client';

import { motion } from 'framer-motion';
import { Keyboard, Video, FileSignature, MessageCircle, Grid, Hand } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import UploadPanel from '@/components/UI/UploadPanel';

export default function MuteDashboard() {
  const features = [
    {
      label: 'AAC Communication Board',
      icon: Grid,
      href: '/aac-board',
      description: 'Use a symbol-based board for communication.',
    },
    {
      label: 'Text-to-Speech Chat',
      icon: MessageCircle,
      href: '/messages?feature=text-to-speech',
      description: 'Type messages and have them read aloud in chats.',
    },
    {
      label: 'Sign-to-Text',
      icon: Hand,
      href: '/sign-to-text',
      description: 'Communicate using sign language via your camera.',
    },
    {
      label: 'Video-based Presentations',
      description: 'Submit presentation assignments as pre-recorded videos.',
      icon: Video,
      href: '/assignments/submit?type=video',
    },
    {
      label: 'Written Q&A Forums',
      description: 'Participate in class discussions through written forums.',
      icon: FileSignature,
      href: '/forums',
    },
  ];

  const quickPhrases = [
    "Can you please repeat that?",
    "I have a question.",
    "Thank you for your help.",
  ];

  const handleQuickPhraseClick = (phrase: string) => {
    navigator.clipboard.writeText(phrase);
    toast.success(`Copied: "${phrase}"`);
  };

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-12">
        <h2 className="text-3xl font-bold mb-6">Speech-Assist Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Link href={feature.href || '#'} key={feature.label} className="group">
              <div
                className={`bg-slate-800/50 p-6 rounded-xl border border-rose-500/20 hover:border-rose-500/50 transition-all h-full flex flex-col cursor-pointer bg-gradient-to-br hover:from-slate-800/50 hover:to-rose-900/40`}
              >
                <div className="flex-shrink-0 mb-4">
                  <feature.icon size={28} className="text-rose-400" />
                </div>
                <h4 className="font-bold text-xl mb-2">{feature.label}</h4>
                <p className="text-gray-400 text-sm flex-grow">{feature.description}</p>
                <div className="mt-4 text-rose-400 font-medium group-hover:underline">
                  Access Tool →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <h3 className="text-2xl font-bold mb-6">Your Quick Phrases</h3>
        <div className="space-y-4">
          {quickPhrases.map((phrase, idx) => (
            <div key={idx} className="p-4 bg-slate-800/50 rounded-lg border-l-4 border-rose-500 flex justify-between items-center">
              <p className="font-semibold">{phrase}</p>
              <button onClick={() => handleQuickPhraseClick(phrase)} className="p-2 bg-rose-600 rounded-lg hover:bg-rose-700" aria-label={`Copy phrase: ${phrase}`}><Keyboard size={20} /></button>
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