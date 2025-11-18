'use client';

import Link from 'next/link';
import { Menu, X, Settings } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useThemeStore } from '@/store/themeStore';
import AccessibilityPanel from './AccessibilityPanel';
import { motion } from 'framer-motion';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [showAccessibility, setShowAccessibility] = useState(false);
  const user = useAuthStore((state) => state.user);
  const colors = useThemeStore((state) => state.colors);

  const menuItems = [
    { label: 'Home', href: '/' },
    { label: 'Courses', href: '/courses' },
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Messages', href: '/messages' },
    { label: 'Profile', href: '/profile' },
    { label: 'Blog', href: '/blog' },
  ];

  return (
    <>
      <nav className={`bg-gradient-to-r ${colors.gradient} text-white shadow-xl sticky top-0 z-50`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="font-bold text-2xl flex items-center gap-2">
              <span className="bg-white text-purple-600 rounded-lg px-3 py-1">ALLIVA</span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="hover:opacity-80 transition-opacity font-medium"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Desktop Controls */}
            <div className="hidden md:flex items-center gap-4">
              <button
                onClick={() => setShowAccessibility(!showAccessibility)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                aria-label="Accessibility settings"
              >
                <Settings size={20} />
              </button>
              {user && (
                <Link
                  href="/profile"
                  className="px-4 py-2 bg-white text-purple-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  {user.displayName}
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="md:hidden pb-4 border-t border-white/20"
            >
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block py-2 px-4 hover:bg-white/10 rounded transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <button
                onClick={() => setShowAccessibility(!showAccessibility)}
                className="w-full text-left py-2 px-4 hover:bg-white/10 rounded transition-colors flex items-center gap-2"
              >
                <Settings size={18} /> Accessibility
              </button>
            </motion.div>
          )}
        </div>
      </nav>

      {/* Accessibility Panel */}
      {showAccessibility && (
        <AccessibilityPanel onClose={() => setShowAccessibility(false)} />
      )}
    </>
  );
}
