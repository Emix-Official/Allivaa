"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Layout/Navigation';
import Hero from '@/components/UI/Hero';
import Button from '@/components/UI/Button';
import { useAuthStore } from '@/store/authStore';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import Card from '@/components/UI/Card';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function BlindnessPage() {
  const user = useAuthStore((state) => state.user);
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<'legal-blind' | 'blind' | 'low-vision' | null>(null);

  const handleCategorySelect = (category: 'legal-blind' | 'blind' | 'low-vision') => {
    setSelectedCategory(category);
  };

  const handleContinue = () => {
    if (selectedCategory) {
      // Here you could save the category preference or navigate to a specialized dashboard
      if (user) {
        const { updateUserProfile } = useAuthStore.getState();
        updateUserProfile({ disabilitySubCategory: selectedCategory });
        router.push('/dashboard');
      } else {
        router.push('/signup');
      }
    }
  };

  const blindnessTypes = [
    {
      id: 'legal-blind',
      title: 'Legal Blindness',
      description: 'Visual acuity of 20/200 or less, or visual field of 20 degrees or less.',
      characteristics: [
        'Significant vision loss in both eyes',
        'May read large print or use magnification',
        'Can often navigate with assistance or tools',
        'Legal status for disability benefits',
      ],
      services: ['Large text formats', 'Magnification software', 'Accessible materials', 'Orientation support'],
    },
    {
      id: 'blind',
      title: 'Blindness',
      description: 'Complete or near-complete absence of vision across all or most of the visual field.',
      characteristics: [
        'Little to no usable vision',
        'Relies on other senses and assistive technology',
        'Can use screen readers and braille',
        'Requires comprehensive accessibility support',
      ],
      services: ['Screen readers', 'Braille materials', 'Audio descriptions', 'Tactile navigation aids'],
    },
    {
      id: 'low-vision',
      title: 'Low Vision',
      description: 'Vision loss that cannot be corrected fully by glasses, contacts, or surgery.',
      characteristics: [
        'Some functional vision remains',
        'May have peripheral or central vision loss',
        'Often uses magnification and lighting',
        'Requires tailored visual accommodations',
      ],
      services: ['Magnification tools', 'High-contrast materials', 'Lighting adjustments', 'Custom fonts'],
    },
  ];

  const services = [
    {
      icon: '🔊',
      title: 'Screen Reader Support',
      id: 'screen-reader-support',
      description: 'NVDA, JAWS, VoiceOver screen readers with full training and technical support.',
    },
    {
      icon: '⠿',
      title: 'Braille Materials',
      id: 'braille-materials',
      description: 'Course materials transcribed to braille or provided in digital braille format.',
    },
    {
      icon: '🔍',
      title: 'Magnification Software',
      id: 'magnification-software',
      description: 'ZoomText, MAGic, and browser magnification tools for low-vision students.',
    },
    {
      icon: '🎬',
      title: 'Audio Descriptions',
      id: 'audio-descriptions',
      description: 'Descriptive narration of visual content in lectures, videos, and presentations.',
    },
    {
      icon: '⌨️',
      title: 'Keyboard Navigation',
      id: 'keyboard-navigation',
      description: 'Full keyboard access to all campus technology and learning platforms.',
    },
    {
      icon: '📡',
      title: 'Accessible Digital Resources',
      id: 'accessible-digital-resources',
      description: 'All digital materials designed with accessibility standards and alt-text.',
    },
  ];

  // Simple client-side screen reader toggle using SpeechSynthesis
  const [screenReaderEnabled, setScreenReaderEnabled] = useState<boolean>(() => {
    try {
      return typeof window !== 'undefined' && localStorage.getItem('blind-screenreader') === 'true';
    } catch {
      return false;
    }
  });

  // Client-side transcription (Web Speech API)
  const [recognizing, setRecognizing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<unknown | null>(null);

  const toggleScreenReader = (enabled?: boolean) => {
    const next = typeof enabled === 'boolean' ? enabled : !screenReaderEnabled;
    setScreenReaderEnabled(next);
    try {
      localStorage.setItem('blind-screenreader', String(next));
    } catch {
      // ignore
    }

    if (next && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const utter = new SpeechSynthesisUtterance(
        'Screen reader enabled. You can press the Read Page Summary button to hear a short description.'
      );
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utter);
    } else if (!next && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  // Web Speech API helpers (browser-only)
  const startTranscription = () => {
    if (typeof window === 'undefined') return;
    // runtime-check for browser speech API
    const win = window as unknown as { SpeechRecognition?: new () => any; webkitSpeechRecognition?: new () => any };
    const SpeechRecognitionCtor = win.SpeechRecognition || win.webkitSpeechRecognition;
    if (!SpeechRecognitionCtor) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    if (!recognitionRef.current) {
  // vendor ctor - cannot type safely across browsers
  // create instance from vendor constructor
  const r = new SpeechRecognitionCtor();
      r.lang = 'en-US';
      r.interimResults = true;
      r.continuous = true;
      r.onresult = (ev: any) => {
        let text = '';
        for (let i = 0; i < ev.results.length; i++) {
          text += ev.results[i][0].transcript;
        }
        setTranscript(text);
      };
      r.onerror = () => {
        console.error('SpeechRecognition error');
        setRecognizing(false);
      };
      recognitionRef.current = r;
    }

    try {
      const obj = recognitionRef.current as any;
      obj.start?.();
      setRecognizing(true);
    } catch {
      console.warn('Recognition start failed');
    }
  };

  const stopTranscription = () => {
    if (recognitionRef.current) {
      try { (recognitionRef.current as any).stop?.(); } catch { /* ignore */ }
    }
    setRecognizing(false);
  };

  const saveTranscriptToFirestore = async () => {
    if (!transcript) return alert('No transcript to save');
    try {
      await addDoc(collection(db, 'captions'), {
        transcript,
        provider: 'web-speech',
        createdAt: serverTimestamp(),
      });
      alert('Transcript saved');
      setTranscript('');
    } catch (e) {
      console.error('Failed to save transcript', e);
      alert('Failed to save transcript');
    }
  };

  const readPageSummary = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const summary = `Sense Aid blindness support. We provide screen readers, braille resources, magnification, and audio descriptions. Use the services section to explore available accommodations.`;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(summary));
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900">
      <Navigation />

      {/* Hero Section */}
      <Hero
        title="Blindness & Low Vision Support"
        subtitle="Complete accessibility solutions for blind and low-vision students. We provide screen readers, braille, magnification tools, and comprehensive visual accommodations."
        primaryCTA={{ label: 'Explore Services', href: '#services' }}
        secondaryCTA={{ label: 'Request Accommodations', href: '/accommodation-request' }}
      />

      <main className="flex-grow">
        {/* Introduction */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-slate-800">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Understanding Vision Loss</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
              Vision loss ranges from blindness to low vision and affects individuals differently. Our support system
              provides comprehensive accessibility solutions tailored to your specific vision and needs.
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              From screen readers and braille to audio descriptions and magnification tools, we ensure you have full
              access to educational content and campus resources.
            </p>
          </div>
        </section>

        {/* Types of Vision Loss */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-900">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">
              Types of Vision Loss
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              {blindnessTypes.map((type) => (
                <div
                  key={type.id}
                  className="p-6 border border-gray-200 dark:border-slate-700 rounded-lg hover:shadow-lg transition-shadow"
                >
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{type.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{type.description}</p>

                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Characteristics:</h4>
                    <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                      {type.characteristics.map((char, idx) => (
                        <li key={idx}>• {char}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Services:</h4>
                    <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                      {type.services.map((service, idx) => (
                        <li key={idx}>✓ {service}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-slate-800">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 text-center">Our Services</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 text-center mb-12 max-w-3xl mx-auto">
              Comprehensive visual accessibility support tailored to your needs and preferences.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service, idx) => (
                <Card
                  key={idx}
                  title={service.title}
                  description={service.description}
                  icon={service.icon}
                  link={`/services#blindness-${service.id}`}
                  variant="minimal"
                />
              ))}
            </div>

            {/* Quick Tools Panel */}
            <div className="mt-8 max-w-3xl mx-auto p-4 rounded-lg bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Quick Accessibility Tools</h3>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <button
                  onClick={() => toggleScreenReader()}
                  className={`px-4 py-2 rounded-lg font-semibold transition ${screenReaderEnabled ? 'bg-indigo-600 text-white' : 'bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white'}`}
                >
                  {screenReaderEnabled ? 'Disable Screen Reader' : 'Enable Screen Reader'}
                </button>

                <button
                  onClick={readPageSummary}
                  disabled={!screenReaderEnabled}
                  className="px-4 py-2 rounded-lg bg-teal-500 text-white font-semibold disabled:opacity-50"
                >
                  Read Page Summary
                </button>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">Tip: Enable the screen reader to hear short descriptions and audio guidance.</p>
            </div>

            {/* Local Transcription Tool */}
            <div className="mt-6 max-w-3xl mx-auto p-4 rounded-lg bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Local Transcription (free)</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Use your browser&apos;s speech recognition to transcribe audio live. This runs locally in your browser and does not use paid services.</p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => (recognizing ? stopTranscription() : startTranscription())}
                  className={`px-4 py-2 rounded-lg font-semibold ${recognizing ? 'bg-red-600 text-white' : 'bg-green-600 text-white'}`}
                >
                  {recognizing ? 'Stop Live Transcription' : 'Start Live Transcription'}
                </button>
                <button
                  onClick={saveTranscriptToFirestore}
                  disabled={!transcript}
                  className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold disabled:opacity-50"
                >
                  Save Transcript
                </button>
              </div>
              <textarea
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                rows={4}
                className="mt-3 w-full p-2 border rounded bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white"
                placeholder="Live transcription will appear here..."
              />
            </div>
          </div>
        </section>

        {/* Technology & Tools */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-900">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              Assistive Technology
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Software Tools</h3>
                <ul className="space-y-3 text-gray-600 dark:text-gray-400">
                  <li>• NVDA (free open-source screen reader)</li>
                  <li>• JAWS (professional screen reader)</li>
                  <li>• ZoomText (magnification software)</li>
                  <li>• DAISY format for digital books</li>
                  <li>• VoiceOver (Mac/iOS integration)</li>
                  <li>• Accessible PDF readers</li>
                </ul>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Hardware & Devices</h3>
                <ul className="space-y-3 text-gray-600 dark:text-gray-400">
                  <li>• Braille displays</li>
                  <li>• Braille note-takers</li>
                  <li>• Optical character recognition (OCR)</li>
                  <li>• Mobile accessible devices</li>
                  <li>• Specialized keyboards</li>
                  <li>• Audio recording devices</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Category Selection */}
        {user && <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-emerald-600 to-cyan-600">
          <div className="max-w-4xl mx-auto text-center text-white">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Select Your Vision Category</h2>
              <p className="text-lg mb-8 text-white/90">
                Choose the category that best describes your vision condition to access specialized features and support.
              </p>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {blindnessTypes.map((type) => (
                  <motion.button
                    key={type.id}
                    onClick={() => handleCategorySelect(type.id as 'legal-blind' | 'blind' | 'low-vision')}
                    className={`p-6 rounded-xl border-2 transition-all ${
                      selectedCategory === type.id
                        ? 'bg-white text-indigo-600 border-white shadow-lg'
                        : 'bg-indigo-700/40 text-white border-indigo-400 hover:bg-indigo-700/60'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <h3 className="text-xl font-bold mb-2">{type.title}</h3>
                    <p className="text-sm opacity-90 mb-4">{type.description}</p>
                    {selectedCategory === type.id && (
                      <CheckCircle className="w-8 h-8 mx-auto text-teal-400" />
                    )}
                  </motion.button>
                ))}
              </div>

              <Button
                label="Continue to Dashboard"
                onClick={handleContinue}
                variant="secondary"
                size="large"
                disabled={!selectedCategory}
              />
            </motion.div>
          </div>
        </section>}
      </main>

      <footer className="bg-gray-900 dark:bg-black text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                © 2025 Sense Aid. All rights reserved.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a
                  href="https://instagram.com/senseaid_blind"
                  className="text-2xl text-gray-400 hover:text-white transition"
                  aria-label="Instagram"
                >
                  📷
                </a>
                <a
                  href="https://youtube.com/@senseaid_blind"
                  className="text-2xl text-gray-400 hover:text-white transition"
                  aria-label="YouTube"
                >
                  📺
                </a>
                <a
                  href="https://chat.whatsapp.com/blind_community"
                  className="text-2xl text-gray-400 hover:text-white transition"
                  aria-label="WhatsApp Group"
                >
                  💬
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
