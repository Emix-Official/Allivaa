'use client';

import { useState } from 'react';
import Navigation from '@/components/Layout/Navigation';
import Footer from '@/components/Layout/Footer';
import Hero from '@/components/UI/Hero';
import Card from '@/components/UI/Card';
import Button from '@/components/UI/Button';
import { MessageSquare, Monitor, BookOpen, Eye, Ear } from 'lucide-react';

  const mainServices = [
    {
      icon: MessageSquare,
      title: 'Accommodation Planning',
      description: 'Personalized accommodation plans tailored to your specific disability and needs.',
      link: 'https://wa.me/1234567890?text=Hello%20Sense%20Aid%20Team,%20I%20need%20help%20with%20accommodation%20planning',
    },
    {
      icon: Monitor,
      title: 'Technology Support',
      description: 'Setup, training, and ongoing support for assistive technology and tools.',
      link: 'https://wa.me/1234567890?text=Hello%20Sense%20Aid%20Team,%20I%20need%20technology%20support',
    },
    {
      icon: BookOpen,
      title: 'Accessible Materials',
      description: 'Course materials in accessible formats including audio, braille, and large print.',
      link: 'https://wa.me/1234567890?text=Hello%20Sense%20Aid%20Team,%20I%20need%20accessible%20materials',
    },
  ];

const allServices = {
  blindness: [
    { icon: '🔊', title: 'Screen Reader Support', id: 'screen-reader-support', description: 'NVDA, JAWS, VoiceOver screen readers with full training and technical support.' },
    { icon: '⠿', title: 'Braille Materials', id: 'braille-materials', description: 'Course materials transcribed to braille or provided in digital braille format.' },
    { icon: '🔍', title: 'Magnification Software', id: 'magnification-software', description: 'ZoomText, MAGic, and browser magnification tools for low-vision students.' },
    { icon: '🎬', title: 'Audio Descriptions', id: 'audio-descriptions', description: 'Descriptive narration of visual content in lectures, videos, and presentations.' },
    { icon: '⌨️', title: 'Keyboard Navigation', id: 'keyboard-navigation', description: 'Full keyboard access to all campus technology and learning platforms.' },
    { icon: '📡', title: 'Accessible Digital Resources', id: 'accessible-digital-resources', description: 'All digital materials designed with accessibility standards and alt-text.' },
  ],
  deafness: [
    { icon: '🎧', title: 'Assistive Listening Devices', id: 'assistive-listening-devices', description: 'FM systems, hearing aids, and sound amplification tools for clearer hearing experiences.' },
    { icon: '📝', title: 'Captioned & Transcribed Materials', id: 'captioned-materials', description: 'All videos, lectures, and online content include captions and text transcripts.' },
    { icon: '🤟', title: 'Sign Language Interpretation', id: 'sign-language-interpretation', description: 'On-demand sign language interpreters during lectures and academic events.' },
    { icon: '💬', title: 'Voice-to-Text Translation', id: 'voice-to-text-translation', description: 'Real-time speech recognition software converts lectures into readable text.' },
    { icon: '🔔', title: 'Visual & Animated Notifications', id: 'visual-notifications', description: 'Flashing visual alerts for announcements, calls, and classroom notifications.' },
    { icon: '📚', title: 'Inclusive Learning Support', id: 'inclusive-learning-support', description: 'Training for lecturers and peers to use clear visuals, instructions, and accessible communication.' },
  ],
  mutism: [
    { icon: '💬', title: 'Alternative Communication', id: 'alternative-communication', description: 'Text-to-speech, AAC devices, sign language, and gesture recognition.' },
    { icon: '📝', title: 'Written Communication Support', id: 'written-communication-support', description: 'Accommodations for written exams, assignments, and group projects.' },
    { icon: '🎥', title: 'Video Submission Options', id: 'video-submission-options', description: 'Present projects via video instead of live presentations.' },
    { icon: '👥', title: 'Peer Communication', id: 'peer-communication', description: 'Facilitators for group work and collaborative learning.' },
    { icon: '🔧', title: 'Technology Support', id: 'technology-support', description: 'Setup and training for assistive communication technology.' },
    { icon: '📞', title: '24/7 Support Hotline', id: 'support-hotline', description: 'Emergency assistance for communication challenges.' },
  ]
};

const serviceCategories = [
  {
    id: 'blindness',
    title: 'Blindness & Low Vision Services',
    icon: Eye,
    services: allServices.blindness,
  },
  {
    id: 'deafness',
    title: 'Deafness & Hard of Hearing Services',
    icon: Ear,
    services: allServices.deafness,
  },
  {
    id: 'mutism',
    title: 'Mutism Services',
    icon: MessageSquare,
    services: allServices.mutism,
  },
];

export default function ServicesPage() {
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  const faqs = [
    {
      id: 'accommodation-process',
      question: 'How do I request accommodations?',
      answer:
        'Visit our accommodation request page and fill out the form with your specific needs. Our team will review your request and schedule a meeting to discuss your accommodations plan. Processing typically takes 5-7 business days.',
    },
    {
      id: 'technology',
      question: 'What assistive technology is available?',
      answer:
        'We provide screen readers, text-to-speech software, braille displays, AAC devices, video captions, sign language interpreters, and many other accessibility tools. Contact our technology support team to schedule a consultation.',
    },
    {
      id: 'documentation',
      question: 'What documentation do I need?',
      answer:
        'You\'ll need documentation of your disability. This can be medical certificates, disability verification letters, or other official documentation. Our team can guide you through the verification process if needed.',
    },
    {
      id: 'exam-accommodations',
      question: 'What exam accommodations are available?',
      answer:
        'Depending on your disability, we offer extended time, alternative formats, separate testing rooms, assistive technology, human readers, scribes, sign language interpreters, and many other exam accommodations.',
    },
    {
      id: 'costs',
      question: 'Are accommodation services free?',
      answer:
        'Yes! All accommodation services and support provided through Sense Aid are free to eligible students. There are no hidden fees or costs.',
    },
    {
      id: 'confidentiality',
      question: 'Is my information kept confidential?',
      answer:
        'Absolutely. Your disability information and accommodation needs are kept strictly confidential. We only share information with instructors who need to know specific accommodations for your courses.',
    },
  ];

  const resources = [
    {
      title: 'Getting Started Guide',
      type: 'PDF Guide',
      description: 'A comprehensive guide to getting started with Sense Aid accommodations.',
    },
    {
      title: 'Assistive Technology Tutorial',
      type: 'Video Course',
      description: 'Learn how to use assistive technology tools effectively.',
    },
    {
      title: 'Student Success Stories',
      type: 'Articles',
      description: 'Read inspiring stories from students who have succeeded with our support.',
    },
    {
      title: 'Accommodation Glossary',
      type: 'Reference',
      description: 'Understand common accommodation terms and abbreviations.',
    },
  ];

  const contacts = [
    {
      title: 'Main Support Line',
      phone: '+1 (555) 123-4567',
      hours: 'Mon-Fri, 9 AM - 5 PM',
      type: 'Phone',
    },
    {
      title: 'Emergency Support',
      phone: '+1 (555) 987-6543',
      hours: '24/7 Available',
      type: 'Phone',
    },
    {
      title: 'Email Support',
      phone: 'support@senseaid.edu',
      hours: 'Response within 24 hours',
      type: 'Email',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900">
      <Navigation />

      {/* Hero Section */}
      <Hero
        title="Our Services & Support"
        subtitle="Comprehensive support services designed to help you succeed in your academic journey. From accommodation planning to technology support, we've got you covered."
        primaryCTA={{ label: 'Request Accommodation', href: '/accommodation-request' }}
      />

      <main className="flex-grow">
        {/* Main Services */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-slate-800">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">Our Services</h2>

            <div className="grid md:grid-cols-3 gap-8">
              {mainServices.map((service, idx) => (
                <Card
                  key={idx}
                  title={service.title}
                  description={service.description}
                  icon={service.icon}
                  link={service.link}
                  variant="default"
                />
              ))}
            </div>
          </div>
        </section>

        {/* Detailed Services */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-900">
          <div className="max-w-7xl mx-auto">
            {serviceCategories.map(category => (
              <div key={category.id} className="mb-16">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-4">
                  <category.icon className="w-8 h-8 text-black dark:text-white" />
                  {category.title}
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.services.map(service => (
                    <div key={service.id} id={`${category.id}-${service.id}`} className="p-6 border border-gray-200 dark:border-slate-700 rounded-lg flex flex-col">
                      <div className="text-3xl mb-4">{service.icon}</div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{service.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400 flex-grow mb-4">{service.description}</p>
                      <Button
                        label="Request Service"
                        href={`/accommodation-request?service=${encodeURIComponent(service.title)}`}
                        variant="secondary"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Resources Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-900">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">Resources</h2>

            <div className="grid md:grid-cols-2 gap-8">
              {resources.map((resource, idx) => (
                <div
                  key={idx}
                  className="p-6 border border-gray-200 dark:border-slate-700 rounded-lg hover:shadow-lg transition-shadow"
                >
                  <span className="inline-block px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm font-semibold rounded-full mb-3">
                    {resource.type}
                  </span>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{resource.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{resource.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-slate-800">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">
              Frequently Asked Questions
            </h2>

            <div className="space-y-4">
              {faqs.map((faq) => (
                <div
                  key={faq.id}
                  className="border border-gray-200 dark:border-slate-700 rounded-lg overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                    className="w-full p-6 text-left hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors flex items-center justify-between"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{faq.question}</h3>
                    <span className="text-2xl text-black dark:text-white">
                      {expandedFaq === faq.id ? '−' : '+'}
                    </span>
                  </button>

                  {expandedFaq === faq.id && (
                    <div className="px-6 pb-6 border-t border-gray-200 dark:border-slate-700">
                      <p className="text-gray-600 dark:text-gray-400">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-900">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">Get in Touch</h2>

            <div className="grid md:grid-cols-3 gap-8">
              {contacts.map((contact, idx) => (
                <div key={idx} className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{contact.type}</p>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{contact.title}</h3>
                  <p className="text-black dark:text-white font-semibold mb-2">{contact.phone}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{contact.hours}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-green-600 to-green-800">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Support?</h2>
            <p className="text-lg mb-8 text-green-100">
              Our team is ready to help you succeed. Start by requesting accommodations today.
            </p>
            <Button label="Request Accommodations" href="/accommodation-request" variant="primary" size="large" />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
