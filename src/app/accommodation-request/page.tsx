"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Navigation from "../../components/Layout/Navigation";
import Footer from "../../components/Layout/Footer";
import { useAuthStore } from "../../store/authStore";
import { useSearchParams } from "next/navigation";
import Hero from "../../components/UI/Hero";

function AccommodationRequestForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const profile = useAuthStore((state) => state.profile);
  const searchParams = useSearchParams();

  // Lazily initialize state from profile and searchParams
  const [data, setData] = useState(() => {
    const service = searchParams.get('service') || '';
    return {
      name: profile?.displayName || "",
      email: profile?.email || "",
      studentId: profile?.studentId || "",
      category: "general",
      accommodations: service ? `I would like to request the following service: ${service}.` : "",
    };
  });

  useEffect(() => {
    // This effect can be removed as state is now initialized lazily.
  }, []);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setData((d) => ({ ...d, [name]: value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Mock submission
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
    }, 700);
  };

  return (
    <main className="flex-grow py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white dark:bg-slate-800 rounded-2xl shadow border border-slate-200 dark:border-slate-700 p-8">
        {!submitted ? (
          <form onSubmit={onSubmit} className="space-y-6" aria-labelledby="acc-title">
            <h1 id="acc-title" className="text-3xl font-bold text-gray-900 dark:text-white">
              Request Accommodations
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Tell us about your needs. We&apos;ll review and respond within 5–7 business days.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Full name
                </label>
                <input
                  id="name"
                  name="name"
                  value={data.name}
                  onChange={onChange}
                  required
                  className="mt-2 w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-700 text-gray-900 dark:text-white border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Alex Johnson"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  University email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={data.email}
                  onChange={onChange}
                  required
                  className="mt-2 w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-700 text-gray-900 dark:text-white border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="name@university.edu"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Student ID
                </label>
                <input
                  id="studentId"
                  name="studentId"
                  value={data.studentId}
                  onChange={onChange}
                  required
                  className="mt-2 w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-700 text-gray-900 dark:text-white border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="STU000123"
                />
              </div>
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={data.category}
                  onChange={onChange}
                  className="mt-2 w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-700 text-gray-900 dark:text-white border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="general">General</option>
                  <option value="blind">Blindness / Low Vision</option>
                  <option value="deaf">Deaf / Hard of Hearing</option>
                  <option value="mute">Mutism</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="accommodations" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Requested accommodations
              </label>
              <textarea
                id="accommodations"
                name="accommodations"
                rows={6}
                value={data.accommodations}
                onChange={onChange}
                required
                className="mt-2 w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-700 text-gray-900 dark:text-white border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Describe the accommodations you need and any relevant context."
              />
            </div>

            <div className="flex items-start gap-3">
              <input id="consent" type="checkbox" required className="mt-1" />
              <label htmlFor="consent" className="text-sm text-gray-600 dark:text-gray-400">
                I consent to the processing of my information for the purpose of accommodation planning.
              </label>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:shadow-lg transition-all disabled:opacity-60"
              >
                {loading ? 'Submitting…' : 'Submit request'}
              </button>
              <Link
                href="/services"
                className="flex-1 py-3 rounded-lg border border-slate-300 dark:border-slate-600 text-center hover:bg-slate-50 dark:hover:bg-slate-700"
              >
                Browse services
              </Link>
            </div>
          </form>
        ) : (
          <div role="status" aria-live="polite" className="space-y-4 text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Request submitted</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Thank you. Our team will contact you at <span className="font-semibold">{data.email}</span> within
              5–7 business days.
            </p>
            <div className="flex gap-3 justify-center">
              <Link href="/dashboard" className="px-5 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                Go to dashboard
              </Link>
              <Link href="/" className="px-5 py-2 rounded-lg border border-slate-300 dark:border-slate-600">
                Back to home
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default function AccommodationRequestPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900">
      <Navigation />
      <Hero title="Request an Accommodation" subtitle="Fill out the form below to request academic or campus accommodations." />
      <Suspense fallback={<div className="text-center p-8">Loading form...</div>}>
        <AccommodationRequestForm />
      </Suspense>
      <Footer />
    </div>
  );
}
