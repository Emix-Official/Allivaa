'use client';

import Link from 'next/link';

const Footer: React.FC = () => {
  return (
  <footer className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-2">
            <h3 className="text-lg font-bold flex items-center space-x-2">
              <span>♿</span>
              <span>Sense Aid</span>
            </h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm">
              Empowering students with disabilities through inclusive education.
            </p>
          </div>

          {/* Join Us */}
          <div>
            <h4 className="font-semibold mb-4">Join Us</h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <li>
                <Link href="/signup" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                  Student Sign Up
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <li>
                <Link href="/services" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                  Support Services
                </Link>
              </li>
              <li>
                <Link href="/resources" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                  Resources
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <li>
                <Link href="/privacy" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-300 dark:border-slate-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-600 dark:text-slate-300 text-sm">
              © 2025 Sense Aid. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a
                href="https://www.instagram.com/allivasenseaid.official?igsh=MTlnN212czNlZWZkMQ%3D%3D&utm_source=qr"
                className="text-2xl text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                aria-label="Instagram"
              >
                📷
              </a>
              <a
                href="https://youtube.com/@senseaid"
                className="text-2xl text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                aria-label="YouTube"
              >
                📺
              </a>
              <a
                href="https://x.com/senseaid"
                className="text-2xl text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                aria-label="X (Twitter)"
              >
                𝕏
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
