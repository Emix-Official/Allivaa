'use client';

import React, { useState } from 'react';
import Navigation from '@/components/Layout/Navigation';
import Footer from '@/components/Layout/Footer';
import { useThemeStore } from '@/store/themeStore';
import { motion } from 'framer-motion';
import { Heart, Zap, Gift, Users, BookOpen } from 'lucide-react';

interface DonationTier {
  amount: number;
  label: string;
  description: string;
  benefits: string[];
  icon: React.ReactNode;
}

export default function DonatePage() {
  const currentTheme = useThemeStore((s) => s.currentTheme);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');

  const tiers: DonationTier[] = [
    {
      amount: 5000,
      label: 'Champion',
      description: 'Help cover hosting costs',
      benefits: [
        'Recognition on website',
        'Monthly impact updates',
        'Access to community forum'
      ],
      icon: <Heart size={32} />
    },
    {
      amount: 10000,
      label: 'Advocate',
      description: 'Support platform development',
      benefits: [
        'All Champion benefits',
        'Quarterly development reports',
        'Early access to new features'
      ],
      icon: <Zap size={32} />
    },
    {
      amount: 25000,
      label: 'Founder',
      description: 'Fund accessibility research',
      benefits: [
        'All Advocate benefits',
        'Custom name/logo on website',
        'Annual gratitude event invitation',
        'Impact report with your name'
      ],
      icon: <Gift size={32} />
    },
    {
      amount: 50000,
      label: 'Visionary',
      description: 'Transform accessibility education',
      benefits: [
        'All Founder benefits',
        'Board of Supporters listing',
        'Direct input on platform priorities',
        'Lifetime recognition',
        'Dedicated thank you video'
      ],
      icon: <Users size={32} />
    }
  ];

  const impactStories = [
    {
      title: 'Emma\'s Success Story',
      description: 'With our real-time captions, Emma was able to follow lectures in her nursing programme and participate in group discussions for the first time.',
      category: 'Deafness'
    },
    {
      title: 'Marcus Graduates with Honours',
      description: 'Using our screen reader optimisation and alternative text assessments, Marcus completed his degree in computer science with distinction.',
      category: 'Blindness'
    },
    {
      title: 'Jamie Finds Their Voice',
      description: 'Through our AAC tools and supportive community, Jamie built confidence to participate in university life and pursue their passion.',
      category: 'Mutism'
    }
  ];

  const faqs = [
    {
      question: 'Is my donation tax-deductible?',
      answer: 'Donations to SenseAid are tax-deductible. We will provide you with a donation receipt for your records. Please consult with your tax adviser for specific details.'
    },
    {
      question: 'How is my donation used?',
      answer: 'Your donation directly funds platform development, server costs, accessibility research, and community support. We maintain transparent reporting of all expenditures.'
    },
    {
      question: 'Can I make a recurring donation?',
      answer: 'Yes! You can set up monthly or annual donations. This helps us plan long-term initiatives and provide consistent support to our community.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major payment methods including bank transfers, card payments, and digital wallets. For Nigerian donors, we support direct bank transfers and mobile money.'
    },
    {
      question: 'Can I donate anonymously?',
      answer: 'Absolutely! You can choose to remain anonymous during checkout. Your privacy is important to us.'
    }
  ];

  return (
    <div className={`min-h-screen ${currentTheme === 'light' ? 'bg-white' : 'bg-slate-950'}`}>
      <Navigation />

      {/* Hero Section */}
      <section
        className="relative w-full overflow-hidden transition-all duration-300 min-h-80 flex items-center justify-center py-12"
        style={{
          background: currentTheme === 'light'
            ? 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)'
            : 'linear-gradient(135deg, #047857 0%, #0891b2 100%)'
        }}
        aria-label="Support SenseAid - Make education accessible for every student"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
              Support SenseAid
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Your donation powers accessible education tools for students with disabilities across Africa.
              Together, we're breaking barriers and creating equal opportunities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#donate"
                className="inline-flex items-center justify-center font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed bg-white text-emerald-600 hover:bg-slate-100 focus:ring-white px-6 py-3 text-lg font-semibold"
              >
                Donate Now
              </a>
              <a
                href="#impact"
                className="inline-flex items-center justify-center font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed bg-white/20 text-white hover:bg-white/30 focus:ring-white px-6 py-3 text-lg"
              >
                See Our Impact
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Donation Tiers */}
      <section id="donate" className={`py-16 px-4 sm:px-6 lg:px-8 ${currentTheme === 'light' ? 'bg-white' : 'bg-slate-900'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${currentTheme === 'light' ? 'text-slate-900' : 'text-white'}`}>
              Choose Your Level of Support
            </h2>
            <p className={`text-lg ${currentTheme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
              Every donation, no matter the amount, makes a difference. Select a tier or enter a custom amount.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {tiers.map((tier) => (
              <motion.button
                key={tier.amount}
                whileHover={{ scale: 1.05 }}
                onClick={() => {
                  setSelectedAmount(tier.amount);
                  setCustomAmount('');
                }}
                className={`rounded-2xl p-6 text-left transition-all duration-200 border-2 cursor-pointer ${
                  selectedAmount === tier.amount
                    ? `border-emerald-500 ${currentTheme === 'light' ? 'bg-emerald-50' : 'bg-emerald-900/20'} shadow-lg`
                    : `border-slate-200 dark:border-slate-700 ${currentTheme === 'light' ? 'bg-slate-50 hover:bg-slate-100' : 'bg-slate-800 hover:bg-slate-700'}`
                }`}
              >
                <div className={`mb-4 ${selectedAmount === tier.amount ? 'text-emerald-600' : 'text-slate-400'}`}>
                  {tier.icon}
                </div>
                <h3 className={`text-xl font-bold mb-2 ${currentTheme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                  {tier.label}
                </h3>
                <div className="text-3xl font-bold text-emerald-600 mb-2">
                  ₦{tier.amount.toLocaleString()}
                </div>
                <p className={`text-sm mb-4 ${currentTheme === 'light' ? 'text-slate-600' : 'text-slate-300'}`}>
                  {tier.description}
                </p>
                <ul className={`space-y-2 text-sm ${currentTheme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
                  {tier.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-600 mt-1">✓</span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </motion.button>
            ))}
          </div>

          {/* Custom Amount */}
          <div className={`max-w-md mx-auto p-6 rounded-2xl border-2 border-slate-200 dark:border-slate-700 ${currentTheme === 'light' ? 'bg-slate-50' : 'bg-slate-800'}`}>
            <label className={`block text-sm font-semibold mb-3 ${currentTheme === 'light' ? 'text-slate-900' : 'text-white'}`}>
              Custom Amount (₦)
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value);
                  if (e.target.value) {
                    setSelectedAmount(null);
                  }
                }}
                placeholder="Enter amount in Naira"
                className={`flex-1 px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-emerald-600 ${
                  currentTheme === 'light'
                    ? 'bg-white border-slate-300 text-slate-900'
                    : 'bg-slate-700 border-slate-600 text-white'
                }`}
              />
            </div>
          </div>

          {/* Donate Button */}
          <div className="text-center mt-12">
            <button
              disabled={!selectedAmount && !customAmount}
              className={`px-8 py-3 rounded-lg font-semibold transition-all duration-200 ${
                (selectedAmount || customAmount)
                  ? 'bg-gradient-to-r from-emerald-600 to-cyan-500 text-white hover:shadow-lg cursor-pointer'
                  : 'bg-slate-300 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed'
              }`}
            >
              Proceed to Payment
            </button>
            <p className={`text-sm mt-4 ${currentTheme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
              🔒 Secure payment processing. Note: This is a demo. Connect Stripe/PayPal for production donations.
            </p>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section id="impact" className={`py-16 px-4 sm:px-6 lg:px-8 ${currentTheme === 'light' ? 'bg-slate-50' : 'bg-slate-800'}`}>
        <div className="max-w-7xl mx-auto">
          <h2 className={`text-3xl md:text-4xl font-bold mb-12 text-center ${currentTheme === 'light' ? 'text-slate-900' : 'text-white'}`}>
            Stories of Impact
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {impactStories.map((story, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -5 }}
                className={`rounded-2xl p-6 border ${
                  currentTheme === 'light'
                    ? 'bg-white border-slate-200 shadow-md hover:shadow-lg'
                    : 'bg-slate-900 border-slate-700 shadow-lg'
                } transition-all duration-200`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen className="text-emerald-600" size={20} />
                  <span className="text-sm font-semibold text-emerald-600">
                    {story.category}
                  </span>
                </div>
                <h3 className={`text-lg font-bold mb-3 ${currentTheme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                  {story.title}
                </h3>
                <p className={currentTheme === 'light' ? 'text-slate-600' : 'text-slate-400'}>
                  {story.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className={`py-16 px-4 sm:px-6 lg:px-8 ${currentTheme === 'light' ? 'bg-white' : 'bg-slate-900'}`}>
        <div className="max-w-3xl mx-auto">
          <h2 className={`text-3xl md:text-4xl font-bold mb-12 text-center ${currentTheme === 'light' ? 'text-slate-900' : 'text-white'}`}>
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            {faqs.map((faq, idx) => (
              <details
                key={idx}
                className={`rounded-lg border p-4 cursor-pointer transition-all duration-200 ${
                  currentTheme === 'light'
                    ? 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    : 'bg-slate-800 border-slate-700 hover:bg-slate-700'
                }`}
              >
                <summary className={`font-semibold flex items-center justify-between ${currentTheme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                  {faq.question}
                  <span>▼</span>
                </summary>
                <p className={`mt-3 ${currentTheme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="relative w-full overflow-hidden transition-all duration-300 py-16 px-4 sm:px-6 lg:px-8"
        style={{
          background: currentTheme === 'light'
            ? 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)'
            : 'linear-gradient(135deg, #047857 0%, #0891b2 100%)'
        }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Make a Difference?
            </h2>
            <p className="text-lg text-white/90 mb-8">
              Every contribution, regardless of size, helps us continue building accessible tools for students across Africa.
            </p>
            <a
              href="#donate"
              className="inline-flex items-center justify-center font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed bg-white text-emerald-600 hover:bg-slate-100 focus:ring-white px-8 py-3 text-lg font-semibold"
            >
              Donate Now
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
