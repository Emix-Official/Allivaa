'use client';

import React from 'react';
import Navigation from '@/components/Layout/Navigation';
import Footer from '@/components/Layout/Footer';
import Link from 'next/link';

export default function CoursesPageStatic() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-600 to-cyan-500 text-white">
      <Navigation />
      <main className="max-w-5xl mx-auto p-6">
        <h1 className="text-4xl font-bold mb-4">Available Courses</h1>
        <p className="mb-6 text-lg">Browse placeholder courses below. These are static demo entries.</p>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white/10 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold">MTH 201 — Quantitative Reasoning</h2>
            <p className="text-sm mt-2">Quantitative Reasoning — Core mathematical methods used across Nigerian university programmes.</p>
            <div className="mt-4 flex gap-2">
              <Link href="/courses/mts-201" className="px-4 py-2 bg-white text-emerald-700 rounded font-semibold">View</Link>
            </div>
          </div>

          <div className="bg-white/10 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold">SEN 201 — Inclusive Education</h2>
            <p className="text-sm mt-2">Inclusive Education — Approaches and accommodations for learners with diverse needs in Nigerian classrooms.</p>
            <div className="mt-4 flex gap-2">
              <Link href="/courses/sen-201" className="px-4 py-2 bg-white text-emerald-700 rounded font-semibold">View</Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
