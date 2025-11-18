'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Volume2, Send, BellRing } from 'lucide-react';
import Navigation from '../../components/Layout/Navigation';  
import { useAccessibilityStore } from '../../store/accessibilityStore';

const lecturers = [
  { id: 1, name: 'Dr. Nelson Mandela', subject: 'Quantum Physics', avatar: 'ER' },
  { id: 2, name: 'Prof. Ola Abiodun', subject: 'Ancient History', avatar: 'SS' },
  { id: 3, name: 'Dr. Anya Sharma', subject: 'Organic Chemistry', avatar: 'AS' },
  { id: 4, name: 'Prof. Ben Carter', subject: 'Literary Theory', avatar: 'BC' },
];

const mockConversations: { [key: number]: { id: number; sender: string; text: string }[] } = {
  1: [
    { id: 1, sender: 'Dr. Nelson Mandela', text: 'Hello! Do you have any questions about the upcoming lecture on quantum entanglement?' },
    { id: 2, sender: 'You', text: 'Yes, I was hoping you could clarify the observer effect.' },
  ],
  2: [
    { id: 1, sender: 'Prof. Ola Abiodun', text: 'Your latest essay on the Roman Empire was excellent. Great work.' },
  ],
  3: [],
  4: [],
};

function MessagesView() {
  const { triggerVisualAlert } = useAccessibilityStore();
  const searchParams = useSearchParams();
  const isTextToSpeechEnabled = searchParams.get('feature') === 'text-to-speech';
  const [selectedLecturer, setSelectedLecturer] = useState(lecturers[0]);
  const [messages, setMessages] = useState(mockConversations[selectedLecturer.id]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);


  const handleSelectLecturer = (lecturer: typeof lecturers[0]) => {
    setSelectedLecturer(lecturer);
    setMessages(mockConversations[lecturer.id]);
  };

  const handleReadAloud = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Sorry, your browser does not support text-to-speech.');
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;
    const newMsg = { id: messages.length + 1, sender: 'You', text: newMessage };
    setMessages([...messages, newMsg]);
    setNewMessage('');
    triggerVisualAlert(); // Simulate receiving a reply and trigger alert
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-black dark:text-white">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold">Messages</h1>
            <button onClick={triggerVisualAlert} className="p-2 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white rounded-lg hover:from-emerald-700 hover:to-cyan-700 flex items-center gap-2">
              <BellRing size={20} /> Test Visual Alert
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {/* Lecturer List */}
          <div className="md:col-span-1 lg:col-span-1 bg-white dark:bg-slate-800 rounded-2xl p-4 border border-gray-200 dark:border-slate-700">
            <h2 className="text-xl font-bold mb-4 px-2">Lecturers</h2>
            <div className="space-y-2">
              {lecturers.map((lecturer) => (
                <button
                  key={lecturer.id}
                  onClick={() => handleSelectLecturer(lecturer)}
                  className={`w-full text-left p-3 rounded-lg flex items-center gap-4 transition-colors ${
                    selectedLecturer.id === lecturer.id ? 'bg-gray-100 dark:bg-slate-700' : 'hover:bg-gray-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-600 to-cyan-600 text-white flex items-center justify-center font-bold">
                    {lecturer.avatar}
                  </div>
                  <div>
                    <p className="font-semibold">{lecturer.name}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{lecturer.subject}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Window */}
          <div className="md:col-span-2 lg:col-span-3 bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 flex flex-col">
            <div className="p-4 border-b border-gray-200 dark:border-slate-700">
              <h2 className="text-xl font-bold">{selectedLecturer.name}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">{selectedLecturer.subject}</p>
            </div>
            <div className="flex-grow p-6 space-y-6 overflow-y-auto h-96">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="inline-block">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-12 h-12 border-4 border-indigo-200 dark:border-slate-600 border-t-indigo-600 dark:border-t-teal-400 rounded-full"
                      />
                    </div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Loading messages...</p>
                  </div>
                </div>
              ) : (
                <>
                  {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                      <p>No messages yet. Start a conversation!</p>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, x: message.sender === 'You' ? 20 : -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`flex gap-4 ${message.sender === 'You' ? 'justify-end' : 'justify-start'}`}
                      >
                        {isTextToSpeechEnabled && message.sender !== 'You' && (
                          <button
                            onClick={() => handleReadAloud(message.text)}
                            className="self-center p-2 bg-gray-200 dark:bg-slate-700 rounded-full hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors"
                            aria-label="Read message aloud"
                          >
                            <Volume2 size={20} />
                          </button>
                        )}
                        <div className={`max-w-lg p-4 rounded-2xl ${message.sender === 'You' ? `bg-gradient-to-r from-emerald-600 to-cyan-600 text-white` : 'bg-gray-100 dark:bg-slate-700'}`}>
                          <p className="font-bold text-sm mb-1">{message.sender}</p>
                          <p>{message.text}</p>
                        </div>
                      </motion.div>
                    ))
                  )}
                </>
              )}
            </div>
            <div className="p-4 border-t border-gray-200 dark:border-slate-700">
              <div className="relative">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your message..."
                  className="w-full pl-4 pr-12 py-3 rounded-full bg-white dark:bg-slate-700 text-black dark:text-white border border-gray-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-400"
                />
                <button onClick={handleSendMessage} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-gradient-to-r from-emerald-600 to-cyan-600 text-white hover:from-emerald-700 hover:to-cyan-700">
                  <Send size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MessagesPage() {
  return (
    <Suspense fallback={<div>Loading messages...</div>}>
      <MessagesView />
    </Suspense>
  );
}