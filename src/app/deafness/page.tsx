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

export default function DeafnessPage() {
  const user = useAuthStore((state) => state.user);
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<'partial' | 'profound' | 'progressive' | null>(null);

  const handleCategorySelect = (category: 'partial' | 'profound' | 'progressive') => {
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

  const deafnessTypes = [
    {
      id: 'partial',
      title: 'Partial Hearing Loss',
      description: 'Reduced ability to hear certain frequencies or sounds clearly, which may vary in severity.',
      characteristics: [
        'Difficulty hearing soft or distant sounds',
        'May struggle with background noise',
        'Can often use hearing aids or amplification devices',
        'Requires visual and captioned content for clarity',
      ],
      services: ['Captioned videos', 'Note-taking assistance', 'Real-time text transcription'],
    },
    {
      id: 'profound',
      title: 'Profound Deafness',
      description: 'Complete or near-complete inability to hear sounds even with amplification.',
      characteristics: [
        'No or very minimal auditory perception',
        'Communication often through sign language',
        'Requires visual cues for all communication',
        'Prefers written or visual alerts',
      ],
      services: ['Sign language interpreters', 'Visual alert systems', 'Accessible course materials'],
    },
    {
      id: 'progressive',
      title: 'Progressive Hearing Loss',
      description: 'Gradual decline in hearing ability over time that may fluctuate or worsen.',
      characteristics: [
        'Speech understanding decreases gradually',
        'May need frequent device adjustments',
        'Adapts between auditory and visual aids',
        'Requires ongoing reassessment of accommodations',
      ],
      services: ['Device maintenance support', 'Adaptive software updates', 'Regular hearing checks'],
    },
  ];

  const services = [
    {
      icon: '🎧',
      title: 'Assistive Listening Devices',
      id: 'assistive-listening-devices',
      description: 'FM systems, hearing aids, and sound amplification tools for clearer hearing experiences.',
    },
    {
      icon: '📝',
      title: 'Captioned & Transcribed Materials',
      id: 'captioned-materials',
      description: 'All videos, lectures, and online content include captions and text transcripts.',
    },
    {
      icon: '🤟',
      title: 'Sign Language Interpretation',
      id: 'sign-language-interpretation',
      description: 'On-demand sign language interpreters during lectures and academic events.',
    },
    {
      icon: '💬',
      title: 'Voice-to-Text Translation',
      id: 'voice-to-text-translation',
      description: 'Real-time speech recognition software converts lectures into readable text.',
    },
    {
      icon: '🔔',
      title: 'Visual & Animated Notifications',
      id: 'visual-notifications',
      description: 'Flashing visual alerts for announcements, calls, and classroom notifications.',
    },
    {
      icon: '📚',
      title: 'Inclusive Learning Support',
      id: 'inclusive-learning-support',
      description: 'Training for lecturers and peers to use clear visuals, instructions, and accessible communication.',
    },
  ];

  // Live captions toggle using SpeechRecognition (if available)
  const [captionsEnabled, setCaptionsEnabled] = useState<boolean>(() => {
    try {
      return localStorage.getItem('deaf-captions') === 'true';
    } catch {
      return false;
    }
  });
  const [transcript, setTranscript] = useState<string>('');
  const recognitionAvailable = typeof window !== 'undefined' && (('webkitSpeechRecognition' in window) || ('SpeechRecognition' in window));

  useEffect(() => {
    // If captions were enabled on load, try to start recognition
    if (captionsEnabled && recognitionAvailable) {
      startRecognition();
    }
    // cleanup on unmount
    return () => {
      stopRecognition();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const recogRef = { current: null as any };
  const startRecognition = () => {
    try {
      const R: any = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      if (!R) return;
      const r = new R();
      r.lang = 'en-US';
      r.interimResults = true;
      r.onresult = (ev: any) => {
        try {
          const results = Array.from(ev.results).map((ri: any) => ri[0].transcript).join(' ');
          setTranscript(results);
        } catch {
          // ignore
        }
      };
      r.onerror = () => setCaptionsEnabled(false);
      r.onend = () => {
        if (captionsEnabled) {
          // restart for continuous captions
          try { startRecognition(); } catch { /* ignore */ }
        }
      };
      recogRef.current = r;
      try { r.start(); } catch { /* ignore */ }
    } catch {
      // feature unavailable
    }
  };

  const stopRecognition = () => {
    try {
      if (recogRef.current) {
        recogRef.current.onend = null;
        recogRef.current.stop();
        recogRef.current = null;
      }
    } catch {
      // ignore
    }
    setTranscript('');
  };

  const toggleCaptions = () => {
    const next = !captionsEnabled;
    setCaptionsEnabled(next);
    try { localStorage.setItem('deaf-captions', String(next)); } catch { /* ignore */ }
    if (next) startRecognition(); else stopRecognition();
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900">
      <Navigation />

      {/* Hero Section */}
      <Hero
        title="Deafness Support Services"
        subtitle="Comprehensive accessibility support for students with partial, profound, or progressive hearing loss. We ensure inclusive communication through captions, interpreters, and visual alerts."
        primaryCTA={{ label: 'Explore Services', href: '#services' }}
        secondaryCTA={{ label: 'Request Accommodations', href: '/accommodation-request' }}
      />

      <main className="flex-grow">
        {/* Introduction */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-slate-800">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Understanding Deafness</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
              Deafness or hearing loss affects an individual’s ability to perceive sound, either partially or completely.
              It does not affect intelligence or ability to learn, but requires accessible and visual methods of communication.
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Our services aim to remove communication barriers through sign language, captions, visual alerts,
              and assistive technologies that ensure equal access to education.
            </p>
          </div>
        </section>

        {/* Types of Deafness */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-900">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">Types of Deafness</h2>

            <div className="grid md:grid-cols-3 gap-8">
              {deafnessTypes.map((type) => (
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
              We ensure clear communication through technology, interpreters, and structured classroom systems.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service, idx) => (
                <Card
                  key={idx}
                  title={service.title}
                  description={service.description}
                  icon={service.icon}
                  link={`/services#deafness-${service.id}`}
                  variant="minimal"
                />
              ))}
            </div>

            {/* Quick Captions Tool */}
            <div className="mt-8 max-w-3xl mx-auto p-4 rounded-lg bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Live Captions (Experimental)</h3>
              <div className="flex items-center gap-3 mb-3">
                <button
                  onClick={toggleCaptions}
                  className={`px-4 py-2 rounded-lg font-semibold transition ${captionsEnabled ? 'bg-indigo-600 text-white' : 'bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white'}`}
                >
                  {captionsEnabled ? 'Stop Captions' : 'Start Captions'}
                </button>
                <div className="text-sm text-gray-600 dark:text-gray-400">{recognitionAvailable ? 'Using browser speech recognition' : 'Speech recognition not available in this browser'}</div>
              </div>

              <div className="rounded-md border border-gray-200 dark:border-slate-700 p-3 bg-gray-50 dark:bg-slate-900 text-sm text-gray-700 dark:text-gray-200 max-h-40 overflow-auto">
                {transcript ? transcript : <span className="opacity-70">Live transcript will appear here when captions are active.</span>}
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
                  <li>• Difficulty following spoken lectures</li>
                  <li>• Lack of captioning in videos</li>
                  <li>• Limited participation in group discussions</li>
                  <li>• Missing verbal instructions or alerts</li>
                  <li>• Communication barriers with peers or lecturers</li>
                  <li>• Difficulty in oral exams or live presentations</li>
                </ul>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">How We Support You</h3>
                <ul className="space-y-3 text-gray-600 dark:text-gray-400">
                  <li>✓ Captions and transcripts for all media</li>
                  <li>✓ Real-time speech-to-text software</li>
                  <li>✓ Sign language interpreters during lectures</li>
                  <li>✓ Animated indicators for lecturer interactions</li>
                  <li>✓ Visual question prompts and alerts</li>
                  <li>✓ Clear, step-by-step written instructions</li>
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
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Select Your Hearing Category</h2>
              <p className="text-lg mb-8 text-white/90">
                Choose the category that best describes your hearing condition to access specialized features and support.
              </p>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {deafnessTypes.map((type) => (
                  <motion.button
                    key={type.id}
                    onClick={() => handleCategorySelect(type.id as 'partial' | 'profound' | 'progressive')}
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
                  href="https://instagram.com/senseaid_deaf"
                  className="text-2xl text-gray-400 hover:text-white transition"
                  aria-label="Instagram"
                >
                  📷
                </a>
                <a
                  href="https://youtube.com/@senseaid_deaf"
                  className="text-2xl text-gray-400 hover:text-white transition"
                  aria-label="YouTube"
                >
                  📺
                </a>
                <a
                  href="https://chat.whatsapp.com/deaf_community"
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
