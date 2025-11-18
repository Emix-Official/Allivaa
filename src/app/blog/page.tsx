'use client';

import Navigation from '@/components/Layout/Navigation';
import { useThemeStore } from '@/store/themeStore';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight } from 'lucide-react';

const blogPosts = [
  {
    id: 1,
    title: 'Making Online Education Accessible for All Students',
    excerpt:
      'Learn about the latest techniques and technologies for creating truly accessible educational content.',
    content:
      'Full article content here...',
    author: 'Dr. Emily Chen',
    date: '2024-11-15',
    category: 'Accessibility',
    image: '📚',
  },
  {
    id: 2,
    title: 'Tips for Success: Managing Multiple Courses',
    excerpt:
      'Expert advice on balancing coursework, assignments, and personal time effectively.',
    content: 'Full article content here...',
    author: 'Prof. James Wilson',
    date: '2024-11-10',
    category: 'Study Tips',
    image: '⏱️',
  },
  {
    id: 3,
    title: 'Student Resources: Support Services Available to You',
    excerpt:
      'A comprehensive guide to all the support services and resources available on campus.',
    content: 'Full article content here...',
    author: 'Sarah Martinez',
    date: '2024-11-05',
    category: 'Resources',
    image: '🤝',
  },
  {
    id: 4,
    title: 'Technology Trends Shaping Higher Education',
    excerpt:
      'Exploring AI, machine learning, and other technologies transforming the classroom.',
    content: 'Full article content here...',
    author: 'Prof. Michael Zhang',
    date: '2024-10-28',
    category: 'Technology',
    image: '🤖',
  },
];

export default function BlogPage() {
  const colors = useThemeStore((state) => state.colors);
  return (
    <div className={`min-h-screen bg-gradient-to-br ${colors.bgDark} ${colors.text}`}>
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <h1 className="text-5xl font-bold mb-4">SenseAid Blog</h1>
          <p className="text-xl text-gray-300">
            Insights, tips, and stories from our educational community
          </p>
        </motion.div>

        {/* Featured Post */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-16 group rounded-2xl overflow-hidden border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 transition-all"
        >
          <div className="bg-gradient-to-r from-emerald-600 to-cyan-600 p-1">
            <div className="bg-white dark:bg-slate-900 p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 font-semibold uppercase mb-3">Featured</p>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    {blogPosts[0].title}
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300 mb-6">{blogPosts[0].excerpt}</p>
                  <div className="flex gap-4 mb-6 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <User size={16} /> {blogPosts[0].author}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} /> {blogPosts[0].date}
                    </div>
                  </div>
                  <button className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white rounded-lg hover:shadow-lg transition-all font-semibold group">
                    Read Article
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
                <div className="text-8xl text-center md:text-right">{blogPosts[0].image}</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Posts Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {blogPosts.slice(1).map((post) => (
            <motion.article
              key={post.id}
              whileHover={{ y: -5 }}
              className="group rounded-xl overflow-hidden border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 transition-all cursor-pointer"
            >
              <div className="bg-white dark:bg-slate-800 p-6 h-full flex flex-col">
                <div className="text-5xl mb-4">{post.image}</div>

                <div className="flex-1">
                  <p className="text-xs uppercase font-semibold text-gray-600 dark:text-gray-400 mb-2">
                    {post.category}
                  </p>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{post.excerpt}</p>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 mb-4">
                    <span className="flex items-center gap-1">
                      <User size={14} /> {post.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={14} /> {post.date}
                    </span>
                  </div>
                  <button className="w-full py-2 px-4 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white rounded-lg font-semibold transition-colors inline-flex items-center justify-center gap-2">
                    Read More
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>

        {/* Newsletter Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-20 p-12 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 text-center"
        >
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter for tips, resources, and stories from the SenseAid community
          </p>
          <div className="flex gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
            <button className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white rounded-lg hover:shadow-lg transition-all font-semibold">
              Subscribe
            </button>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
