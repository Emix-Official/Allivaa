'use client';

import Navigation from '@/components/Layout/Navigation';
import { useAuthStore } from '@/store/authStore';
import { useThemeStore } from '@/store/themeStore';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { BookOpen, Clock, Users, Star, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Course } from '@/types';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function CoursesPage() {
  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.loading);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const router = useRouter();
  const colors = useThemeStore((state) => state.colors);
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    // Only redirect if auth has finished loading AND user is not authenticated
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    const fetchCourses = async () => {
      if (!user) return;
      try {
        const coursesCollection = await getDocs(collection(db, 'courses'));
        const coursesData = coursesCollection.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Course[];
        setCourses(coursesData);
      } catch (error) {
        console.error("Error fetching courses: ", error);
      }
    };

    if (!loading && isAuthenticated && user) {
      fetchCourses();
    }
  }, [user, loading, isAuthenticated]);

  // Show loading while auth is initializing
  if (loading) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${colors.bgDark}`}>
        <Navigation />
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin text-purple-400" size={48} />
        </div>
      </div>
    );
  }

  // If user is not authenticated after loading, don't render anything (will redirect)
  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${colors.bgDark} text-white`}>
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold mb-2">Available Courses</h1>
          <p className={`text-lg ${colors.textMuted}`}>
            Explore our comprehensive course catalog and enroll in subjects that interest you.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-12 w-12 animate-spin text-purple-400" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course, idx) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`bg-gradient-to-br ${colors.bgLight} rounded-xl p-6 border border-slate-700/50 hover:border-slate-600 transition-all`}
              >
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-purple-400">{course.code}</span>
                    <div className="flex items-center gap-1">
                      <Star size={14} className="text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-300">4.7</span> {/* Placeholder rating */}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{course.name}</h3>
                  <p className="text-sm text-gray-400 mb-3">{course.instructor}</p>
                  <p className="text-sm text-gray-300 mb-4">{course.description}</p>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <Clock size={16} />
                    <span>{course.schedule}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <Users size={16} />
                    <span>{course.credits} credits</span>
                  </div>
                </div>

                <button
                  className={`w-full py-3 px-4 bg-gradient-to-r ${colors.primary} rounded-lg hover:shadow-lg transition-all font-semibold flex items-center justify-center gap-2`}
                >
                  <BookOpen size={18} />
                  Enroll Now
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
