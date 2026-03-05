'use client';

import Navigation from '@/components/Layout/Navigation';
import Footer from '@/components/Layout/Footer';
import MediaControlPanel from '@/components/UI/MediaControlPanel';

export default function MutismLiveSignPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900">
      <Navigation />
      <main className="flex-grow">
        <div className="max-w-4xl mx-auto p-6">
          <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Live Sign Demo</h1>
          <p className="mb-6 text-gray-600 dark:text-gray-400">Open your camera and try the sign demo. This is useful for gesture-based shortcuts and quick translations.</p>

          <div className="grid grid-cols-1 gap-6">
            <MediaControlPanel name="Live Camera" />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
