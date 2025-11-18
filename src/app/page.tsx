'use client';

import Navigation from '@/components/Layout/Navigation';
import Footer from '@/components/Layout/Footer';
import Hero from '@/components/UI/Hero';
import Card from '@/components/UI/Card';
import Button from '@/components/UI/Button';
import { trackEvent } from '@/lib/analytics';
import { useAuthStore } from '@/store/authStore';
import { useProfileStore } from '@/store/profileStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useThemeStore } from '@/store/themeStore';
import { motion } from 'framer-motion';
import { LoaderCircle } from 'lucide-react';
import BlindDashboard from '@/app/dashboard/BlindDashboard';
import DeafDashboard from '@/app/dashboard/DeafDashboard';
import MuteDashboard from '@/app/dashboard/MuteDashboard';
import GeneralDashboard from '@/app/dashboard/GeneralDashboard';

// ✅ TabCard Component
const TabCard = ({
  icon,
  title,
  description,
  href,
  color,
  badge,
}: {
  icon: string;
  title: string;
  description: string;
  href: string;
  color: string;
  badge?: string;
}) => (
  <motion.div
    whileHover={{ y: -6, scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className="group cursor-pointer h-full"
  >
    <Link href={href} className="block h-full">
      <div
        className={`relative bg-gradient-to-br ${color} p-6 rounded-2xl text-white h-full overflow-hidden backdrop-blur-xl border border-white/10 shadow-xl hover:shadow-2xl transition-all duration-300`}
      >
        <div className="flex justify-between items-start mb-4">
          <div className="text-5xl group-hover:scale-110 transition-transform duration-300">
            {icon}
          </div>
          {badge && (
            <span className="text-xs font-bold bg-white/30 backdrop-blur px-2 py-1 rounded-full">
              {badge}
            </span>
          )}
        </div>
        <div className="flex-grow">
          <h3 className="text-2xl font-bold mb-2 group-hover:translate-x-1 transition-transform duration-300">
            {title}
          </h3>
          <p className="text-white/70 text-sm leading-relaxed">{description}</p>
        </div>
        <div className="mt-6 flex items-center gap-2 text-white/60 group-hover:text-white group-hover:translate-x-2 transition-all duration-300 text-sm font-semibold">
          <span>Explore</span>
          <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
        </div>
      </div>
    </Link>
  </motion.div>
);

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const profile = useProfileStore((state) => state.profile);
  const router = useRouter();

  const renderDashboard = () => {
    if (!profile) {
      return (
        <div className="flex justify-center items-center h-64">
          <LoaderCircle className="animate-spin text-indigo-600" size={48} />
        </div>
      );
    }

    switch (profile?.disabilityCategory) {
      case 'blind':
        return <BlindDashboard />;
      case 'deaf':
        return <DeafDashboard />;
      case 'mute':
        return <MuteDashboard />;
      default:
        return <GeneralDashboard />;
    }
  };

  const handleLogout = async () => {
    try {
      logout();
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // 🧭 If user not signed in
  if (!user || !profile) {
    const featured = [
      {
        id: 1,
        title: 'Making Online Education Accessible for All Students',
        excerpt:
          'Learn about techniques and technologies for creating truly accessible educational content.',
        link: '/blog',
        image: '📚',
      },
      {
        id: 2,
        title: 'Student Resources: Support Services Available to You',
        excerpt: 'A guide to support services and resources available on campus.',
        link: '/blog',
        image: '🤝',
      },
    ];

    const handleLogin = () => {
      trackEvent('cta_click', { cta: 'login_home' });
      router.push('/login');
    };

    const handleSignup = () => {
      trackEvent('cta_click', { cta: 'signup_home' });
      router.push('/signup');
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 text-slate-900 dark:text-white">
        <Navigation />
        <Hero
          title="SenseAid — Accessible education for every student"
          subtitle="Tools, accommodations, and community support for students with disabilities. Explore services, request accommodations, and join our community."
          primaryCTA={{ label: 'Get Started', href: '/signup' }}
          secondaryCTA={{ label: 'Learn More', href: '/about' }}
          alignment="center"
        />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <section className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Featured</h2>
              <div className="hidden sm:flex gap-3">
                <Button onClick={handleLogin} label="Login" variant="primary" />
                <Button onClick={handleSignup} label="Sign up" variant="secondary" />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {featured.map((f) => (
                <Card key={f.id} title={f.title} description={f.excerpt} icon={f.image} link={f.link} />
              ))}
            </div>
          </section>

          <section className="mt-16">
            <h3 className="text-xl font-semibold mb-4">Explore by need</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <Card title="Blindness" description="Screen readers, braille, and audio descriptions." link="/blindness" />
              <Card title="Deafness" description="Captions, interpreters, and visual alerts." link="/deafness" />
              <Card title="Mutism" description="Alt communication, video submissions and text support." link="/mutism" />
            </div>
          </section>
          
          <section className="mt-16">
            <h3 className="text-xl font-semibold mb-4">Support Our Work</h3>
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 dark:bg-slate-800 dark:border-slate-700">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex-1">
                  <h4 className="text-2xl font-bold mb-2">Donate to SenseAid</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">Help us maintain and expand accessibility tools for students. Your support funds development, hosting, and outreach.</p>
                  <div className="flex items-center gap-3">
                    <a href="/donate" className="px-5 py-3 bg-indigo-600 text-white rounded-lg font-semibold">Donate</a>
                    <a href="/about" className="px-4 py-2 border rounded-lg text-sm">Learn more</a>
                  </div>
                </div>
                <div className="w-48 text-center">
                  <div className="text-5xl">💖</div>
                  <div className="text-sm text-gray-500 mt-2">Every gift helps</div>
                </div>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  // ✅ Logged-in user view
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-2">
                Welcome back,{' '}
                <span className="bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
                  {profile?.displayName || 'Student'}
                </span>
                !
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-300">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all shadow-lg"
            >
              Logout
            </motion.button>
          </div>
        </motion.div>

        {/* Quick Access */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-12">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <span className="bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">Quick Access</span>
            <span className="text-xl">⚡</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <TabCard icon="🎓" title="Courses" description="View and manage your enrolled courses" href="/courses" color="from-blue-500 to-cyan-500" badge="Academic" />
            <TabCard icon="📊" title="Dashboard" description="View your personalized dashboard" href="/dashboard" color="from-purple-500 to-pink-500" badge="Personal" />
            <TabCard icon="💬" title="Messages" description="Connect with lecturers and peers" href="/messages" color="from-indigo-500 to-blue-500" badge="Social" />
            <TabCard icon="👤" title="Profile" description="Manage your account settings" href="/profile" color="from-teal-500 to-emerald-500" badge="Settings" />
          </div>
        </motion.div>

        {/* Dashboard Section */}
        {profile && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <span>Your Learning Hub</span>
              <span className="text-2xl">🎯</span>
            </h2>
            {renderDashboard()}
          </motion.div>
        )}

        {/* AI Support Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 bg-gradient-to-br from-emerald-600 to-cyan-600 rounded-3xl p-8 text-white shadow-2xl"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">🎤</span>
            <h3 className="text-3xl font-bold">Need Help?</h3>
          </div>
          <p className="mb-6 text-lg text-white/90">
            Use our AI assistant Ali to navigate and get instant support. Just say &quot;Ali&quot; to activate voice commands!
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <p className="font-semibold mb-3 text-lg">Try Voice Commands:</p>
              <ul className="space-y-2 text-sm text-white/90">
                <li>🎙️ &quot;Go to courses&quot;</li>
                <li>🎙️ &quot;Go to messages&quot;</li>
                <li>🎙️ &quot;Go to profile&quot;</li>
                <li>🎙️ &quot;Logout&quot;</li>
              </ul>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <p className="font-semibold mb-3 text-lg">Or Click These:</p>
              <div className="flex gap-2 flex-wrap">
                <Link href="/courses" className="text-sm bg-white/20 hover:bg-white/30 px-3 py-1 rounded-lg transition">
                  Courses
                </Link>
                <Link href="/messages" className="text-sm bg-white/20 hover:bg-white/30 px-3 py-1 rounded-lg transition">
                  Messages
                </Link>
                <Link href="/resources" className="text-sm bg-white/20 hover:bg-white/30 px-3 py-1 rounded-lg transition">
                  Resources
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
