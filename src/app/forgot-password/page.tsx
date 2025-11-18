"use client";

import { useState } from "react";
import Navigation from "@/components/Layout/Navigation";
import Footer from "@/components/Layout/Footer";
import Hero from "@/components/UI/Hero";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900">
      <Navigation />

      <Hero
        title="Reset your password"
        subtitle="Enter your email and we’ll send a secure link to reset your password."
        primaryCTA={{ label: "Back to Login", href: "/login" }}
      />

      <main className="flex-grow">
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto bg-white dark:bg-slate-800 rounded-2xl shadow border border-slate-200 dark:border-slate-700 p-8">
            {!submitted ? (
              <form onSubmit={onSubmit} className="space-y-6" aria-labelledby="reset-title">
                <h1 id="reset-title" className="text-2xl font-bold text-gray-900 dark:text-white">
                  Forgot password
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  We’ll email you a reset link if an account exists for this address.
                </p>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-2 w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-700 text-gray-900 dark:text-white border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="you@example.com"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:shadow-lg transition-all"
                >
                  Send reset link
                </button>
              </form>
            ) : (
              <div role="status" aria-live="polite" className="space-y-4 text-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Check your email</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  If an account exists for <span className="font-semibold">{email}</span>, a password reset link has
                  been sent. The link expires in 30 minutes.
                </p>
                <div className="flex gap-3 justify-center">
                  <a
                    href="/login"
                    className="px-5 py-2 rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
                  >
                    Back to login
                  </a>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-5 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                  >
                    Use a different email
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
