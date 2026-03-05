"use client";

import React from 'react';
import Navigation from '@/components/Layout/Navigation';
import Footer from '@/components/Layout/Footer';
import Link from 'next/link';

export default function Mts201Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-600 to-cyan-500 text-white">
      <Navigation />
      <main className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-3">MTH 201 — Quantitative Reasoning</h1>
        <p className="mb-4">Quantitative Reasoning — Foundational mathematical methods and applied problem solving relevant to Nigerian university curricula.</p>
        <div className="bg-white/10 p-4 rounded">
          <h2 className="font-semibold">Course Outline</h2>
          <ul className="list-disc ml-5 mt-2 text-sm">
              <li>Foundations of mathematical reasoning</li>
              <li>Introductory probability &amp; statistics with local examples</li>
              <li>Applied problem solving and case studies from Nigerian contexts</li>
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
