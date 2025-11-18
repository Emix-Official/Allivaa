'use client';

import { useAccessibilityStore } from '@/store/accessibilityStore';
import { useThemeStore } from '@/store/themeStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, Mic, FileText, BookOpen, Calendar, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import UploadPanel from '@/components/UI/UploadPanel';


// Local helper types to avoid depending on ambient SpeechRecognition types in all editors
type LocalSpeechRecognitionResult = { readonly isFinal?: boolean; [index: number]: { transcript: string } };
type LocalSpeechRecognitionResultList = { readonly length: number; [index: number]: LocalSpeechRecognitionResult };

// SpeechRecognition types are also centralized in src/types/speech.d.ts but some editors/TS setups
// still flag the ambient names as unresolved; these local types are only used for narrow casts below.

export default function BlindDashboard() {
  const { screenReaderOptimized, toggleScreenReader } = useAccessibilityStore();
  const { currentTheme } = useThemeStore();
  const router = useRouter();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  const handleCommand = (command: string) => {
    if (command.includes('go to courses')) {
      router.push('/courses');
      setIsListening(false);
    } else if (command.includes('go to messages')) {
      router.push('/messages');
      setIsListening(false);
    } else if (command.includes('open document reader')) {
      router.push('/reader');
      setIsListening(false);
    } else if (command.includes('stop listening')) {
      setIsListening(false);
      toast.success('Voice commands deactivated.');
    }
  };

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    // Some TypeScript environments may not include SpeechRecognition.lang in the declared type.
    // Set it via a safe cast to avoid type errors while keeping runtime behavior.
    try {
      // Cast through unknown to avoid linter complaints about `any` while still setting the property at runtime
      (recognition as unknown as { lang?: string }).lang = 'en-US';
    } catch {}

    recognition.onresult = (event: Event) => {
      // runtime-guard: ensure results exists before using it
      if ('results' in event) {
        // Narrow to a local typed shape to avoid using global ambient types directly
        const srEvent = event as unknown as { results: LocalSpeechRecognitionResultList };
  // srEvent.results is array-like but may not be recognized as Iterable in some TS setups.
  // Cast through unknown to a typed array to satisfy Array.from without using `any`.
  const resultsArray: LocalSpeechRecognitionResult[] = Array.from(srEvent.results as unknown as LocalSpeechRecognitionResult[]);
        const currentTranscript = resultsArray
          .map((result) => (result && result[0] ? result[0].transcript : ''))
          .join('');
        setTranscript(currentTranscript);
        handleCommand(currentTranscript.toLowerCase());
      }
    };

    recognition.onend = () => {
      if (isListening) {
        recognition.start(); // Restart if it was meant to be listening
      }
    };

    if (isListening) {
      recognition.start();
    }

    return () => {
      recognition.stop();
    };
  // handleCommand is stable for our use here
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isListening]);

  const toggleListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error('Sorry, your browser does not support voice commands.');
      return;
    }
    setIsListening((prevState) => !prevState);
    setTranscript('');
    toast.success(isListening ? 'Voice commands deactivated.' : 'Voice commands activated! Try "Go to courses".');
  };
  const features = [
    {
      label: screenReaderOptimized ? 'Disable Screen Reader' : 'Enable Screen Reader',
      icon: Volume2,
      action: toggleScreenReader,
      color: 'from-emerald-600 to-cyan-600',
      description: 'Toggle screen reader compatibility mode.',
    },
    {
      label: isListening ? 'Deactivate Voice Commands' : 'Activate Voice Commands',
      icon: Mic,
      action: toggleListening,
      color: 'from-emerald-600 to-cyan-600',
      description: 'Control the interface with your voice.',
    },
    {
      label: 'Document Reader',
      description: 'Upload and listen to documents with text-to-speech.',
      icon: FileText,
      color: 'from-emerald-600 to-cyan-600',
    },
    {
      label: 'Audio-Described Lectures',
      description: 'Access lectures with descriptive audio for visual content.',
      icon: Volume2,
      href: '/courses?filter=audio-described',
      color: 'from-emerald-600 to-cyan-600',
    },
    {
      label: 'Braille Materials',
      icon: BookOpen,
      href: '/courses?filter=braille',
      color: 'from-emerald-600 to-cyan-600',
      description: 'Find course materials ready for Braille displays.',
    },
    {
      label: 'Contact a Lecturer',
      description: 'Send a message to any of your lecturers.',
      icon: MessageSquare,
      href: '/messages',
      color: 'from-emerald-600 to-cyan-600',
    },
  ];

  const upcomingDeadlines = [
    { title: 'CS101 Project Proposal', due: 'in 2 days', course: 'Intro to Computer Science' },
    { title: 'MATH203 Problem Set 5', due: 'in 4 days', course: 'Linear Algebra' },
    { title: 'LIT301 Essay Outline', due: 'in 1 week', course: 'Modernist Literature' },
  ];

  return (
    <>
      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 bg-indigo-600/90 backdrop-blur-sm text-white p-4 rounded-lg shadow-2xl z-50 w-full max-w-md"
            role="status"
            aria-live="assertive"
          >
            <div className="flex items-center gap-4">
              <Mic className="text-red-500 animate-pulse" size={24} />
              <div className="flex-grow">
                <p className="font-bold">Listening...</p>
                <p className="text-sm text-white/70 h-5">{transcript || 'Say a command like "Go to courses"'}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-12">
  <h2 className={`text-3xl font-bold mb-6 ${currentTheme === 'light' ? 'text-black' : 'text-white'}`}>Vision-Assist Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Link href={feature.href || '#'} key={feature.label} className="group">
              <div
                onClick={feature.action}
                className={`${currentTheme === 'light' ? 'bg-emerald-50 border-emerald-300' : 'bg-slate-800 border-emerald-600'} p-6 rounded-xl border hover:border-emerald-400 transition-all h-full flex flex-col cursor-pointer bg-gradient-to-br hover:from-emerald-600 ${feature.action ? `hover:to-cyan-600` : `hover:to-emerald-700`}`}
              >
                <div className="flex-shrink-0 mb-4">
                  <feature.icon size={28} className={`text-black dark:text-white ${isListening && feature.icon === Mic ? 'text-red-500 animate-pulse' : ''}`} />
                </div>
                <h4 className={`font-bold text-xl mb-2 ${currentTheme === 'light' ? 'text-black' : 'text-white'}`}>{feature.label}</h4>
                <p className={`${currentTheme === 'light' ? 'text-black/70' : 'text-white/70'} text-sm flex-grow`}>{feature.description}</p>
                <div className="mt-4 text-black dark:text-white font-medium group-hover:underline">
                  {feature.href ? 'Access Tool →' : 'Activate'}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
  <h3 className={`text-2xl font-bold mb-6 ${currentTheme === 'light' ? 'text-black' : 'text-white'}`}>Upcoming Deadlines</h3>
        <div className="space-y-4">
          {upcomingDeadlines.map((deadline, idx) => (
            <div key={idx} className={`p-4 ${currentTheme === 'light' ? 'bg-white border-l-black' : 'bg-black border-l-white'} rounded-lg border-l-4 flex justify-between items-center`}>
              <div>
                <p className={`font-semibold ${currentTheme === 'light' ? 'text-black' : 'text-white'}`}>{deadline.title}</p>
                <p className={`text-xs ${currentTheme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>{deadline.course}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-purple-400">{deadline.due}</p>
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