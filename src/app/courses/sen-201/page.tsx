"use client";

import React from 'react';
import Navigation from '@/components/Layout/Navigation';
import Footer from '@/components/Layout/Footer';
import Link from 'next/link';

export default function Sen201Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-600 to-cyan-500 text-white">
      <Navigation />
      <main className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-3">SEN 201 — Inclusive Education</h1>
        <p className="mb-4">Inclusive Education — Practical strategies and accommodations for Nigerian classrooms to support learners with diverse needs.</p>
        <div className="bg-white/10 p-4 rounded">
          <h2 className="font-semibold">Course Topics</h2>
          <ul className="list-disc ml-5 mt-2 text-sm">
            <li>Understanding diverse learning needs in local settings</li>
            <li>Practical accommodations and assessment strategies used in Nigerian schools</li>
            <li>Collaboration with local support services and community resources</li>
          </ul>
        </div>

        <div className="mt-6 flex gap-2">
          <Link href="/courses" className="px-4 py-2 bg-white text-emerald-700 rounded">Back to Courses</Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
