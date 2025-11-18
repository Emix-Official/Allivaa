'use client';

import { useState, useEffect } from 'react';
import Navigation from '@/components/Layout/Navigation';
import Footer from '@/components/Layout/Footer';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { Plus, BookOpen, Users, Trash2 } from 'lucide-react';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function ProfessorDashboard() {
  const user = useAuthStore((s) => s.user);
  const profile = useAuthStore((s) => s.profile);
  const router = useRouter();
  const [courses, setCourses] = useState<any[]>([]);
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [courseTitle, setCourseTitle] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile || profile.role !== 'professor') {
      router.push('/professor/login');
      return;
    }
    loadCourses();
  }, [profile, router]);

  const loadCourses = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'courses'));
      const coursesList: any[] = [];
      snapshot.forEach((doc) => {
        if (doc.data().professorId === profile?.uid) {
          coursesList.push({ id: doc.id, ...doc.data() });
        }
      });
      setCourses(coursesList);
    } catch (error) {
      console.error('Failed to load courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseTitle.trim()) return;

    try {
      await addDoc(collection(db, 'courses'), {
        title: courseTitle,
        description: courseDescription,
        professorId: profile?.uid,
        professorName: profile?.displayName,
        studentCount: 0,
        createdAt: new Date(),
      });
      setCourseTitle('');
      setCourseDescription('');
      setShowCourseForm(false);
      loadCourses();
    } catch (error) {
      console.error('Failed to add course:', error);
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (confirm('Are you sure you want to delete this course?')) {
      try {
        await deleteDoc(doc(db, 'courses', courseId));
        loadCourses();
      } catch (error) {
        console.error('Failed to delete course:', error);
      }
    }
  };

  if (loading) {
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
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Professor Dashboard</h1>
            <button
              onClick={() => setShowCourseForm(!showCourseForm)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white rounded-lg font-semibold hover:from-emerald-700 hover:to-cyan-700"
            >
              <Plus size={20} /> Add Course
            </button>
          </div>

          {showCourseForm && (
            <div className="mb-8 p-6 bg-gray-50 dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Create New Course</h2>
              <form onSubmit={handleAddCourse} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Course Title</label>
                  <input
                    type="text"
                    value={courseTitle}
                    onChange={(e) => setCourseTitle(e.target.value)}
                    placeholder="e.g., Advanced Physics"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Description</label>
                  <textarea
                    value={courseDescription}
                    onChange={(e) => setCourseDescription(e.target.value)}
                    placeholder="Course description..."
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700"
                  >
                    Create Course
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCourseForm(false)}
                    className="px-6 py-3 bg-gray-200 dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg font-semibold hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <BookOpen size={48} className="w-full h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 text-lg">No courses yet. Create your first course above!</p>
              </div>
            ) : (
              courses.map((course) => (
                <div
                  key={course.id}
                  className="p-6 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 hover:shadow-lg transition"
                >
                  <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{course.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">{course.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <Users size={16} /> {course.studentCount || 0} students
                    </div>
                    <button
                      onClick={() => handleDeleteCourse(course.id)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                      aria-label="Delete course"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
