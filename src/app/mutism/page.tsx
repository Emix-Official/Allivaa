'use client';

import Navigation from '@/components/Layout/Navigation';
import Footer from '@/components/Layout/Footer';
import Hero from '@/components/UI/Hero';
import Card from '@/components/UI/Card';
import Button from '@/components/UI/Button';
import { useAuthStore } from '@/store/authStore'; // Assuming this is your auth store
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

export default function MutismPage() {
  const user = useAuthStore((state) => state.user);
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<'selective' | 'total' | 'progressive' | null>(null);

  const handleCategorySelect = (category: 'selective' | 'total' | 'progressive') => {
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

  const mutismTypes = [
    {
      id: 'selective',
      title: 'Selective Mutism',
      description: 'Inability to speak in specific situations despite speaking fluently in others.',
      characteristics: [
        'Difficulty speaking in social situations',
        'Can speak fluently in comfortable environments',
        'Often starts in childhood',
        'Not a choice or defiance',
      ],
      services: ['Alternative communication tools', 'Gradual exposure therapy support', 'Written exam accommodations'],
    },
    {
      id: 'total',
      title: 'Total Mutism',
      description: 'Complete inability to produce speech sounds across all situations.',
      characteristics: [
        'No verbal communication in any setting',
        'May communicate through other methods',
        'Can result from various causes',
        'Requires specialized communication support',
      ],
      services: ['AAC devices', 'Sign language support', 'Visual communication systems'],
    },
    {
      id: 'progressive',
      title: 'Progressive Mutism',
      description: 'Gradual loss of speech ability that may develop over time.',
      characteristics: [
        'Speech deteriorates gradually',
        'May fluctuate or progress',
        'Requires ongoing adaptation',
        'Regular accommodations reassessment',
      ],
      services: ['Adaptive communication strategies', 'Technology upgrades', 'Regular support adjustments'],
    },
  ];

  const services = [
    {
      icon: '💬',
      title: 'Alternative Communication',
      id: 'alternative-communication',
      description: 'Text-to-speech, AAC devices, sign language, and gesture recognition.',
    },
    {
      icon: '📝',
      title: 'Written Communication Support',
      id: 'written-communication-support',
      description: 'Accommodations for written exams, assignments, and group projects.',
    },
    {
      icon: '🎥',
      title: 'Video Submission Options',
      id: 'video-submission-options',
      description: 'Present projects via video instead of live presentations.',
    },
    {
      icon: '👥',
      title: 'Peer Communication',
      id: 'peer-communication',
      description: 'Facilitators for group work and collaborative learning.',
    },
    {
      icon: '🔧',
      title: 'Technology Support',
      id: 'technology-support',
      description: 'Setup and training for assistive communication technology.',
    },
    {
      icon: '📞',
      title: '24/7 Support Hotline',
      id: 'support-hotline',
      description: 'Emergency assistance for communication challenges.',
    },
  ];

  // Simple AAC (text-to-speech) tool for mutism support
  const [aacText, setAacText] = useState('');
  const [savedPhrases, setSavedPhrases] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem('mutism-phrases');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('mutism-phrases', JSON.stringify(savedPhrases));
    } catch {
      // ignore
    }
  }, [savedPhrases]);

  const speakText = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(u);
    } catch {
      // ignore
    }
  };

  const savePhrase = (phrase: string) => {
    if (!phrase) return;
    setSavedPhrases((s) => {
      const next = [phrase, ...s].slice(0, 10);
      return next;
    });
    setAacText('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900">
      <Navigation />

      {/* Hero Section */}
      <Hero
        title="Mutism Support Services"
        subtitle="Comprehensive support for students with selective, total, or progressive mutism. We provide alternative communication methods and accessibility accommodations."
        primaryCTA={{ label: 'Explore Services', href: '#services' }}
        secondaryCTA={{ label: 'Request Accommodations', href: '/accommodation-request' }}
      />

      <main className="flex-grow">
        {/* Introduction */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-slate-800">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Understanding Mutism</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
              Mutism is a communication disorder where individuals have difficulty speaking in certain situations or
              circumstances, despite having normal language skills. It affects communication but not intelligence or
              understanding.
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Our support system is designed to provide alternative communication methods, accommodations for academic
              work, and a supportive environment where you can thrive.
            </p>
          </div>
        </section>

        {/* Types of Mutism */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-900">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">Types of Mutism</h2>

            <div className="grid md:grid-cols-3 gap-8">
              {mutismTypes.map((type) => (
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
              We offer comprehensive support tailored to your specific needs and communication style.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service, idx) => (
                <Card
                  key={idx}
                  title={service.title}
                  description={service.description}
                  icon={service.icon}
                  link={`/services#mutism-${service.id}`}
                  variant="minimal"
                />
              ))}
            </div>

            {/* AAC Tool */}
            <div className="mt-8 max-w-3xl mx-auto p-4 rounded-lg bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Communication Assistant (AAC)</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Type a message and press Speak to have the device speak for you. Save frequently used phrases for quick access.</p>

              <div className="flex flex-col sm:flex-row gap-3 mb-3">
                <input
                  value={aacText}
                  onChange={(e) => setAacText(e.target.value)}
                  placeholder="Type a phrase to speak"
                  className="flex-1 rounded-lg p-3 border bg-gray-50 dark:bg-slate-900 border-gray-200 dark:border-slate-700 text-sm"
                />
                <div className="flex gap-2">
                  <button onClick={() => speakText(aacText)} className="px-4 py-2 rounded-lg bg-teal-500 text-white font-semibold">Speak</button>
                  <button onClick={() => savePhrase(aacText)} className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold">Save</button>
                </div>
              </div>

              <div className="mt-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Saved Phrases</h4>
                {savedPhrases.length === 0 ? (
                  <p className="text-sm text-gray-600 dark:text-gray-400">No saved phrases yet.</p>
                ) : (
                  <ul className="space-y-2">
                    {savedPhrases.map((p, i) => (
                      <li key={i} className="flex items-center justify-between bg-gray-50 dark:bg-slate-900 p-2 rounded">
                        <div className="truncate pr-4">{p}</div>
                        <div className="flex gap-2">
                          <button onClick={() => speakText(p)} className="px-3 py-1 rounded bg-teal-500 text-white text-sm">Speak</button>
                          <button onClick={() => { navigator.clipboard?.writeText(p); }} className="px-3 py-1 rounded bg-gray-200 dark:bg-slate-700 text-sm">Copy</button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Challenges & Support */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-900">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              Challenges & Our Support
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Common Challenges</h3>
                <ul className="space-y-3 text-gray-600 dark:text-gray-400">
                  <li>• Classroom participation and presentations</li>
                  <li>• Verbal exams and oral assessments</li>
                  <li>• Group discussions and teamwork</li>
                  <li>• Social interactions with peers</li>
                  <li>• Communication with instructors</li>
                  <li>• Emergency situations requiring verbal response</li>
                </ul>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">How We Support You</h3>
                <ul className="space-y-3 text-gray-600 dark:text-gray-400">
                  <li>✓ Alternative assessment methods</li>
                  <li>✓ Written exam options</li>
                  <li>✓ Video presentation alternatives</li>
                  <li>✓ Communication facilitators</li>
                  <li>✓ AAC device setup and training</li>
                  <li>✓ Private meeting spaces</li>
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
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Select Your Mutism Category</h2>
              <p className="text-lg mb-8 text-white/90">
                Choose the category that best describes your experience to access specialized features and support.
              </p>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {mutismTypes.map((type) => (
                  <motion.button
                    key={type.id}
                    onClick={() => handleCategorySelect(type.id as 'selective' | 'total' | 'progressive')}
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
                  href="https://instagram.com/senseaid_mute"
                  className="text-2xl text-gray-400 hover:text-white transition"
                  aria-label="Instagram"
                >
                  📷
                </a>
                <a
                  href="https://youtube.com/@senseaid_mute"
                  className="text-2xl text-gray-400 hover:text-white transition"
                  aria-label="YouTube"
                >
                  📺
                </a>
                <a
                  href="https://chat.whatsapp.com/mute_community"
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
