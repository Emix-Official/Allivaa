'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { Accessibility, Menu, X, Moon, Sun, BookOpen, BarChart3, MessageSquare, Settings, Home, LogOut, GraduationCap, Eye, Ear } from 'lucide-react';
import { PARTNERS, getPartnerGradientClass } from '@/config/partners';
import { useThemeStore } from '@/store/themeStore';
import { useAuthStore } from '@/store/authStore';

interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  category?: 'learning' | 'social' | 'account';
}

// Logo component - moved outside Navigation to avoid recreation
const LogoComponent: React.FC<{ currentTheme: string; partnerId?: string | undefined; href?: string }> = ({ currentTheme, partnerId, href = '/' }) => {
  const partner = partnerId ? PARTNERS.find((p) => p.id === partnerId) : null;
  
  // Use explicit inline gradient when a partner provides hex values to avoid
  // Tailwind class purging for dynamically constructed class names.
  const badgeStyle: React.CSSProperties | undefined = partner && (partner.theme?.fromHex || partner.theme?.toHex)
    ? { background: `linear-gradient(135deg, ${partner.theme?.fromHex || '#4f46e5'}, ${partner.theme?.toHex || '#10B981'})` }
    : undefined;

  return (
    <Link
      href={href}
      className="flex items-center gap-2 group transition-all duration-300"
    >
      <div
        className={clsx('p-1.5 rounded-lg transition-all duration-300 group-hover:scale-110')}
        style={badgeStyle}
      >
        <Accessibility size={24} className="text-white" />
      </div>
      <div className="hidden sm:block">
        <h1 className={clsx(
          'text-xl font-black transition-all duration-300',
          currentTheme === 'light'
            ? 'bg-gradient-to-r from-emerald-600 to-cyan-500 bg-clip-text text-transparent'
            : 'bg-gradient-to-r from-emerald-400 to-cyan-300 bg-clip-text text-transparent'
        )}>
          SenseAid
        </h1>
        {partner && (
          <div className="text-xs text-slate-400">{partner.name}</div>
        )}
      </div>
    </Link>
  );
};

const Navigation: React.FC = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentTheme, setTheme } = useThemeStore();

  const user = useAuthStore((s) => s.user);
  const profile = useAuthStore((s) => s.profile);
  const logout = useAuthStore((s) => s.logout);

  // Try to read a persisted profile synchronously from localStorage so
  // returning users see the authenticated navigation immediately while
  // the zustand store rehydrates and `initializeAuth()` completes.
  const getPersistedProfile = (): typeof profile | null => {
    try {
      if (typeof window === 'undefined') return null;
      const raw = localStorage.getItem('profile-storage');
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return parsed?.state?.profile ?? null;
    } catch (err) {
      return null;
    }
  };

  const [persistedProfile] = React.useState(() => getPersistedProfile());

  const toggleTheme = () => setTheme(currentTheme === 'light' ? 'dark' : 'light');

  // PUBLIC NAV
  const publicNav: NavItem[] = [
    { label: 'Home', href: '/', icon: <Home size={18} /> },
    { label: 'Mutism', href: '/mutism', icon: <MessageSquare size={18} /> },
    { label: 'Blindness', href: '/blindness', icon: <Eye size={18} /> },
    { label: 'Deafness', href: '/deafness', icon: <Ear size={18} /> },
    { label: 'Services', href: '/services', icon: <Accessibility size={18} /> },
    { label: 'Blog', href: '/blog', icon: <BookOpen size={18} /> },
    { label: 'Professor', href: '/professor/login', icon: <GraduationCap size={18} /> },
  ];

  // AUTHENTICATED NAV
  const authNav: NavItem[] = [
    { label: 'Home', href: profile ? '/dashboard' : '/', icon: <Home size={18} />, category: 'learning' },
    { label: 'Courses', href: '/courses', icon: <GraduationCap size={18} />, category: 'learning' },
    { label: 'Dashboard', href: '/dashboard', icon: <BarChart3 size={18} />, category: 'learning' },
    { label: 'Messages', href: '/messages', icon: <MessageSquare size={18} />, category: 'social' },
    { label: 'Resources', href: '/resources', icon: <BookOpen size={18} />, category: 'learning' },
    // Only show Live Sign for deaf or mute users
    ...(profile && (profile.disabilityCategory === 'deaf' || profile.disabilityCategory === 'mute') 
      ? [{ label: 'Live Sign', href: '/live-sign', icon: <Accessibility size={18} />, category: 'learning' as const }]
      : []),
    { label: 'Profile', href: '/profile', icon: <Settings size={18} />, category: 'account' },
    // Professor quick access for users with the professor role
    ...(profile && profile.role === 'professor' ? [{ label: 'Professor', href: '/professor/dashboard', icon: <GraduationCap size={18} />, category: 'learning' as const }] : []),
  ];

  // Use the persisted profile as a fallback until the store finishes
  // initializing so the correct nav is shown without a flash.
  const effectiveProfile = profile || persistedProfile;
  const navItems = (user || effectiveProfile) ? authNav : publicNav;

  const handleLogout = async () => {
    try {
      logout();
      setMobileMenuOpen(false);
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const logoHref = effectiveProfile ? '/dashboard' : '/';

  return (
    <nav className={clsx(
      'sticky top-0 z-50 backdrop-blur-lg bg-opacity-90 transition-all duration-300 border-b',
      currentTheme === 'light'
        ? 'bg-white/75 border-slate-200/40 shadow-md shadow-slate-100/30'
        : 'bg-slate-900/80 border-slate-700/40 shadow-md shadow-black/20'
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <LogoComponent currentTheme={currentTheme} partnerId={profile?.partner} href={logoHref} />

          <div className="hidden md:flex items-center gap-1">
            {navItems.slice(0, -1).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 min-w-fit',
                  pathname === item.href
                    ? 'bg-gradient-to-r from-emerald-600 to-cyan-600 text-white shadow-lg'
                    : currentTheme === 'light'
                      ? 'text-slate-900 hover:bg-white/40'
                      : 'text-slate-100 hover:bg-white/10'
                )}
              >
                <span className="flex-shrink-0 inline-flex items-center justify-center">
                  {item.icon}
                </span>
                <span className="hidden lg:inline">{item.label}</span>
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className={clsx(
                'p-2 rounded-lg transition-all duration-200 hover:scale-110',
                currentTheme === 'light'
                  ? 'text-slate-700 hover:bg-slate-100/60'
                  : 'text-slate-200 hover:bg-slate-700/60'
              )}
            >
              {currentTheme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            <button
              className={clsx(
                'md:hidden p-2 rounded-lg transition-all duration-200',
                currentTheme === 'light'
                  ? 'text-slate-700 hover:bg-slate-100/60'
                  : 'text-slate-200 hover:bg-slate-700/60'
              )}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {effectiveProfile ? (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  href="/profile"
                  className={clsx(
                    'flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-white hover:shadow-lg transition-all',
                    effectiveProfile?.partner ? getPartnerGradientClass(effectiveProfile.partner) ?? 'bg-gradient-to-r from-emerald-600 to-cyan-600' : 'bg-gradient-to-r from-emerald-600 to-cyan-600'
                  )}
                >
                  <Settings size={16} />
                  <span className="hidden lg:inline">{effectiveProfile.displayName}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className={clsx(
                    'p-2 rounded-lg transition-all duration-200',
                    currentTheme === 'light'
                      ? 'text-red-600 hover:bg-red-50'
                      : 'text-red-400 hover:bg-red-900/20'
                  )}
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg font-semibold bg-gradient-to-r from-emerald-600 to-cyan-600 text-white hover:shadow-lg transition-all"
              >
                Login
              </Link>
            )}
          </div>
        </div>

        {mobileMenuOpen && (
          <div className={clsx(
            'md:hidden pb-4 space-y-2 animate-in fade-in slide-in-from-top-2',
            currentTheme === 'light' ? 'bg-white/30 border-t border-white/20' : 'bg-slate-900/30 border-t border-white/10'
          )}>
            {navItems.map((item, idx) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={clsx(
                  'flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200',
                  pathname === item.href
                    ? 'bg-gradient-to-r from-emerald-600 to-cyan-600 text-white'
                    : currentTheme === 'light'
                      ? 'text-slate-900 hover:bg-white/40'
                      : 'text-slate-100 hover:bg-white/10'
                )}
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <span className="flex-shrink-0 inline-flex items-center justify-center">
                  {item.icon}
                </span>
                {item.label}
              </Link>
            ))}

            <hr className={currentTheme === 'light' ? 'border-slate-200' : 'border-slate-700'} />

            {profile ? (
              <>
                <Link
                  href="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className={clsx(
                    'flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-white',
                    profile?.partner ? getPartnerGradientClass(profile.partner) ?? 'bg-gradient-to-r from-emerald-600 to-cyan-500' : 'bg-gradient-to-r from-emerald-600 to-cyan-500'
                  )}
                >
                  <Settings size={18} />
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className={clsx(
                    'w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200',
                    currentTheme === 'light'
                      ? 'text-red-600 hover:bg-red-50'
                      : 'text-red-400 hover:bg-red-900/20'
                  )}
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            ) : (
              <div className="space-y-2 px-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full px-4 py-3 rounded-lg font-semibold text-center bg-gradient-to-r from-emerald-600 to-cyan-600 text-white hover:shadow-lg transition-all"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className={clsx(
                    'block w-full px-4 py-3 rounded-lg font-semibold text-center transition-all border-2',
                    currentTheme === 'light'
                      ? 'border-indigo-600 text-indigo-600 hover:bg-indigo-50'
                      : 'border-indigo-400 text-indigo-400 hover:bg-indigo-900/20'
                  )}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
