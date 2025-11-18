"use client";

import Navigation from "@/components/Layout/Navigation";
import Footer from "@/components/Layout/Footer";

export default function ResourcesPage() {
  const resources = [
    {
      title: "Accessibility Checklist (WCAG 2.1 AA)",
      type: "Checklist",
      desc: "Practical list to evaluate pages for contrast, semantics, focus, and keyboard nav.",
      link: "#",
    },
    {
      title: "Screen Reader Shortcuts",
      type: "Guide",
      desc: "NVDA, JAWS, and VoiceOver quick keys to navigate ALLIVA efficiently.",
      link: "#",
    },
    {
      title: "Captioning & Transcripts",
      type: "How‑to",
      desc: "Steps to enable captions and access transcripts across the platform.",
      link: "#",
    },
    {
      title: "Assistive Tech Setup",
      type: "Tutorial",
      desc: "Configure magnifiers, braille displays, and voice‑to‑text with your device.",
      link: "#",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900">
      <Navigation />

      <main className="flex-grow py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Resources</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-10 max-w-2xl">
            Documentation, guides, and tools to help you get the most from ALLIVA.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {resources.map((r, i) => (
              <article
                key={i}
                className="p-6 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              >
                <span className="inline-block text-xs font-semibold px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 mb-3">
                  {r.type}
                </span>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{r.title}</h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2">{r.desc}</p>
                <a href={r.link} className="mt-4 inline-block text-black dark:text-white font-semibold">
                  View
                </a>
              </article>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
