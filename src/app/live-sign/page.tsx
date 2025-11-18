'use client';

import Navigation from '@/components/Layout/Navigation';
import Footer from '@/components/Layout/Footer';
import MediaControlPanel from '@/components/UI/MediaControlPanel';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LiveSignPage() {
  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.loading);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  if (loading || !isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900">
        <Navigation />
        <main className="flex-grow flex items-center justify-center">
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900">
      <Navigation />
      <main className="flex-grow">
        <div className="max-w-6xl mx-auto p-6">
          <h1 className="text-4xl font-bold mb-2 text-gray-900 dark:text-white">Live Sign Demo</h1>
          <p className="mb-8 text-gray-600 dark:text-gray-400">
            Use your camera to try the sign-language landmark demo. Enable Auto-Translate to save heuristic translations of your gestures. Perfect for testing gesture-based shortcuts and sign language recognition.
          </p>

          <div className="grid grid-cols-1 gap-6">
            <MediaControlPanel name="Live Camera" />
          </div>

          <div className="mt-12 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-4">How It Works</h2>
            <ul className="space-y-3 text-blue-800 dark:text-blue-200">
              <li>• <strong>Start Sign Capture:</strong> Click to access your camera and begin capturing hand landmarks in real-time.</li>
              <li>• <strong>View Landmarks:</strong> The canvas shows your hand pose with colored markers (red for left hand, blue for right hand, green for body pose).</li>
              <li>• <strong>Heuristic Translation:</strong> The demo recognizes basic gestures like fist, pointing, thumbs up, and swipes.</li>
              <li>• <strong>Auto-Translate:</strong> Enable this option to automatically save recognized gestures to your account for later review.</li>
              <li>• <strong>Save & Copy:</strong> Manually save or copy the current translation to your clipboard.</li>
            </ul>
          </div>

          <div className="mt-8 p-6 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
            <h2 className="text-xl font-semibold text-amber-900 dark:text-amber-100 mb-4">Camera & Permissions</h2>
            <p className="text-amber-800 dark:text-amber-200 mb-3">
              To use the live sign demo, your browser needs access to your camera. When you click "Start Sign Capture", your browser will ask for permission.
            </p>
            <p className="text-amber-800 dark:text-amber-200">
              If you see an error like "Requested device not found", it means:
            </p>
            <ul className="space-y-2 text-amber-800 dark:text-amber-200 mt-3">
              <li>• <strong>No camera detected:</strong> Ensure your webcam is connected and not in use by another app.</li>
              <li>• <strong>Permission denied:</strong> Check your browser settings and allow camera access for this site.</li>
              <li>• <strong>Camera in use:</strong> Close other apps (like Zoom, Teams, or Discord) that may be using your camera.</li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
