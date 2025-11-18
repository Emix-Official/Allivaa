'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Send,
  Sparkles,
  Loader,
  Mic,
  MicOff,
  Settings,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

// ================== TYPES ==================
interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

interface AccessibilitySettings {
  screenReader: boolean;
  textToSpeech: boolean;
  highContrast: boolean;
  fontSize: 'normal' | 'large' | 'xlarge';
}

// ================== SPEECH RECOGNITION FALLBACK ==================
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult?: (event: any) => void;
  onerror?: (event: any) => void;
  onend?: () => void;
  onstart?: () => void;
}

type SpeechRecognitionConstructor = new () => SpeechRecognition;
type SpeechRecognitionEvent = any;

// ================== COMPONENT ==================
export default function VoiceAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [listeningText, setListeningText] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const [settings, setSettings] = useState<AccessibilitySettings>({
    // keep screen reader off by default to avoid auto-activation on page load
    screenReader: false,
    textToSpeech: true,
    highContrast: false,
    fontSize: 'normal',
  });

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const recognitionActiveRef = useRef<boolean>(false);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  // ================== PAGES + COMMAND HELPERS ==================
  const pages = useMemo(
    () => [
      { name: 'home', routes: ['home', '/'], label: 'Home', public: true },
      { name: 'mutism', routes: ['mutism', '/mutism'], label: 'Mutism', public: true },
      { name: 'blindness', routes: ['blindness', '/blindness'], label: 'Blindness', public: true },
      { name: 'deafness', routes: ['deafness', '/deafness'], label: 'Deafness', public: true },
      { name: 'blog', routes: ['blog', '/blog'], label: 'Blog', public: true },
      { name: 'services', routes: ['services', '/services'], label: 'Services', public: true },
      { name: 'resources', routes: ['resources', '/resources'], label: 'Resources', public: true },
      { name: 'dashboard', routes: ['dashboard', '/dashboard'], label: 'Dashboard', public: false },
      { name: 'courses', routes: ['courses', '/courses'], label: 'Courses', public: false },
      { name: 'profile', routes: ['profile', '/profile'], label: 'Profile', public: false },
      { name: 'messages', routes: ['messages', '/messages'], label: 'Messages', public: false },
    ],
    []
  );

  const findPageRoute = useCallback(
    (input: string): string | null => {
      const lower = input.toLowerCase();
      for (const page of pages) {
        if (page.routes.some((route: string) => lower.includes(route))) {
          if (!page.public && !isAuthenticated) return '/login';
          return page.routes[page.routes.length - 1];
        }
      }
      return null;
    },
    [pages, isAuthenticated]
  );

  // ================== TEXT TO SPEECH ==================
  const speakText = useCallback(
    (text: string) => {
      if (!settings.textToSpeech || !synthRef.current) return;
      try {
        synthRef.current.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1;
        utterance.pitch = 1;
        synthRef.current.speak(utterance);
      } catch (e) {
        console.warn('TTS error:', e);
      }
    },
    [settings.textToSpeech]
  );

  // ================== COMMAND HANDLER ==================
  const handleCommand = useCallback(
    async (input: string): Promise<boolean> => {
      const lower = input.toLowerCase();

      if (/\b(log ?out|sign ?out|sign ?off)\b/.test(lower)) {
        try {
          await logout();
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              sender: 'ai',
              text: 'You have been logged out.',
              timestamp: new Date(),
            },
          ]);
          speakText('You have been logged out.');
        } catch {
          console.warn('Logout failed.');
        }
        return true;
      }

      const route = findPageRoute(input);
      if (route) {
        try {
          router.push(route);
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              sender: 'ai',
              text: `Opening ${route}`,
              timestamp: new Date(),
            },
          ]);
        } catch {
          console.warn('Navigation failed');
        }
        return true;
      }

      return false;
    },
    [logout, router, speakText, findPageRoute]
  );

  // ================== SEND MESSAGE ==================
  const handleSendMessage = useCallback(async () => {
    const text = inputValue.trim();
    if (!text) return;

    try {
      const handled = await handleCommand(text);
      if (handled) {
        setInputValue('');
        return;
      }
    } catch (e) {
      console.warn('Command handling failed', e);
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });

      const data = await response.json();
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: data.reply || 'Sorry, I could not generate a response.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      speakText(aiMessage.text);
    } catch {
      const errorMsg: Message = {
        id: (Date.now() + 2).toString(),
        sender: 'ai',
        text: 'Error processing message. Try again later.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  }, [inputValue, handleCommand, speakText]);

  // ================== SPEECH RECOGNITION ==================
  const startListening = useCallback(() => {
    if (!recognitionRef.current) return;
    // avoid double-starting
    if (recognitionActiveRef.current || isListening) return;
    setListeningText('Listening...');
    recognitionActiveRef.current = true;

    try {
      recognitionRef.current.onstart = () => {
        // native recognition started
        setIsListening(true);
  setListeningText('Listening...');
      };

      recognitionRef.current.onresult = async (event: SpeechRecognitionEvent) => {
        if (!recognitionActiveRef.current) return;
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript.toLowerCase();
        }

        setListeningText(transcript || 'Listening...');

        if (silenceTimeoutRef.current) {
          clearTimeout(silenceTimeoutRef.current);
          silenceTimeoutRef.current = null;
        }

        // give the user a bit more time to finish speaking
        silenceTimeoutRef.current = setTimeout(async () => {
          if (!recognitionActiveRef.current) return;
          if (transcript.trim()) {
            const cleaned = transcript.trim();
            const handled = await handleCommand(cleaned);
            if (!handled) {
              setInputValue(cleaned);
              await handleSendMessage();
            }
          }
          stopListening();
        }, 3000);
      };

      recognitionRef.current.onerror = (ev: any) => {
        const err = ev?.error || ev;
        console.warn('Speech recognition error:', err);
        // show a friendly message to the user
        if (err === 'not-allowed' || err?.message?.includes('Permission')) {
          setListeningText('Microphone access denied. Please allow microphone and try again.');
        } else if (err === 'no-speech') {
          setListeningText('No speech detected. Try again.');
        } else {
          setListeningText('Speech recognition error. Please try again.');
        }
        // ensure we clean up the session
        recognitionActiveRef.current = false;
        setIsListening(false);
        if (silenceTimeoutRef.current) {
          clearTimeout(silenceTimeoutRef.current);
          silenceTimeoutRef.current = null;
        }
      };

      recognitionRef.current.onend = () => {
        // ended naturally or by stop/abort; ensure internal flags are cleared
        recognitionActiveRef.current = false;
        setIsListening(false);
        setListeningText('');
        if (silenceTimeoutRef.current) {
          clearTimeout(silenceTimeoutRef.current);
          silenceTimeoutRef.current = null;
        }
      };

      try {
        recognitionRef.current.start();
      } catch (startError) {
        console.warn('Recognition start failed:', startError);
        recognitionActiveRef.current = false;
        setIsListening(false);
        setListeningText('');
      }
    } catch (e) {
      console.error('Speech recognition error:', e);
      stopListening();
    }
  }, [handleCommand, handleSendMessage]);

  const stopListening = useCallback(() => {
    try {
      recognitionActiveRef.current = false;
      if (recognitionRef.current) {
        if (typeof recognitionRef.current.abort === 'function') recognitionRef.current.abort();
        else if (typeof recognitionRef.current.stop === 'function') recognitionRef.current.stop();
      }
    } catch (e) {
      console.warn('stopListening error:', e);
    }
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
      silenceTimeoutRef.current = null;
    }
    setIsListening(false);
    setListeningText('');
  }, []);

  // ================== INIT ==================
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition: SpeechRecognitionConstructor | undefined =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      // Allow continuous recognition so the user has time to speak without immediate end
      // We'll still auto-stop after silence via our timeout.
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';
    }

    if (!synthRef.current && window.speechSynthesis) {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fontSizeClass = {
    normal: 'text-base',
    large: 'text-lg',
    xlarge: 'text-xl',
  }[settings.fontSize];

  // ================== UI ==================
  return (
    <>
      {!isOpen && (
        <motion.button
          onClick={() => setIsOpen(true)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="fixed bottom-6 right-6 z-40 p-4 rounded-full bg-gradient-to-r from-emerald-600 to-cyan-500 text-white shadow-lg"
        >
          <Sparkles size={24} />
        </motion.button>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className={`fixed bottom-6 right-6 z-50 w-96 h-[600px] rounded-2xl shadow-2xl flex flex-col border ${
              settings.highContrast ? 'bg-black text-white' : 'bg-white text-slate-900'
            }`}
          >
            {/* HEADER */}
            <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-emerald-600 to-cyan-500 text-white rounded-t-2xl">
              <h3 className="font-bold flex items-center gap-2">
                <Sparkles size={18} /> AiAssistant
              </h3>
              <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/20 rounded transition">
                <X size={20} />
              </button>
            </div>

            {/* MESSAGES */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      msg.sender === 'user'
                        ? 'bg-indigo-600 text-white rounded-br-none'
                        : 'bg-slate-200 text-slate-900 rounded-bl-none'
                    } ${fontSizeClass}`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* LISTENING INDICATOR */}
            {isListening && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-4 p-3 rounded-lg text-sm text-center">
                <div className="flex items-center justify-center gap-2">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="w-2 h-2 bg-blue-600 rounded-full"
                  />
                  {listeningText}
                </div>
              </motion.div>
            )}

            {/* INPUT */}
            <div className="p-4 border-t space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type or speak..."
                  className={`flex-1 px-3 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 ${fontSizeClass}`}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={isLoading || !inputValue.trim()}
                  className="p-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  {isLoading ? <Loader size={18} className="animate-spin" /> : <Send size={18} />}
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={isListening ? stopListening : startListening}
                  className="flex-1 px-3 py-2 rounded-lg flex items-center justify-center gap-2 bg-slate-200 hover:bg-slate-300"
                >
                  {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                  {isListening ? 'Stop' : 'Listen'}
                </button>
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-2 rounded-lg bg-slate-200 hover:bg-slate-300"
                >
                  <Settings size={18} />
                </button>
                <button
                  onClick={() => setShowHelp((s) => !s)}
                  className="p-2 rounded-lg bg-slate-200 hover:bg-slate-300"
                  title="Assistant commands"
                >
                  <Sparkles size={18} />
                </button>
              </div>
            </div>

            {/* SETTINGS */}
            <AnimatePresence>
              {showSettings && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border-t p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold">Text-to-Speech</label>
                    <button
                      onClick={() =>
                        setSettings((p) => ({ ...p, textToSpeech: !p.textToSpeech }))
                      }
                      className="p-1 rounded"
                    >
                      {settings.textToSpeech ? <Volume2 size={16} /> : <VolumeX size={16} />}
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold">High Contrast</label>
                    <button
                      onClick={() =>
                        setSettings((p) => ({ ...p, highContrast: !p.highContrast }))
                      }
                      className="p-1 rounded bg-slate-200"
                    >
                      {settings.highContrast ? 'On' : 'Off'}
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold">Font Size</label>
                    <select
                      value={settings.fontSize}
                      onChange={(e) =>
                        setSettings((p) => ({
                          ...p,
                          fontSize: e.target.value as AccessibilitySettings['fontSize'],
                        }))
                      }
                      className="px-2 py-1 rounded border"
                    >
                      <option value="normal">Normal</option>
                      <option value="large">Large</option>
                      <option value="xlarge">X-Large</option>
                    </select>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {showHelp && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border-t p-4 space-y-2 bg-slate-50"
                >
                  <div className="text-sm font-semibold">Assistant Commands</div>
                  <ul className="text-sm list-disc pl-5 space-y-1">
                    <li><strong>Go to &lt;page&gt;</strong> — e.g., "go to messages", "open dashboard"</li>
                    <li><strong>Logout</strong> — say "logout", "sign out", or "sign off"</li>
                    <li><strong>Help</strong> — open this command list</li>
                    <li><strong>Wake word</strong> — say "Ali" before your command to activate by voice</li>
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
