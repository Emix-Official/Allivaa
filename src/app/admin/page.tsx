'use client';

import Navigation from '@/components/Layout/Navigation';
import { useAuthStore } from '@/store/authStore';
import { useThemeStore } from '@/store/themeStore';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Trash2, RotateCcw, Search, Mail, Calendar, Shield, Loader, AlertCircle, Users as UsersIcon } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';


interface AdminUser {
  id: string;
  email: string;
  displayName: string;
  role: 'student' | 'professor' | 'admin';
  createdAt: string;
  disabilityCategory?: string;
}

export default function AdminPage() {
  const currentTheme = useThemeStore((state) => state.currentTheme);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);
  const [resetting, setResetting] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const usersList: AdminUser[] = usersSnapshot.docs.map((doc) => ({
        id: doc.id,
        email: doc.data().email || '',
        displayName: doc.data().displayName || 'Unknown',
        role: doc.data().role || 'student',
        createdAt: doc.data().createdAt ? new Date(doc.data().createdAt).toLocaleDateString() : 'Unknown',
        disabilityCategory: doc.data().disabilityCategory || 'general',
      }));
      setUsers(usersList);
    } catch (err: any) {
      setError('Failed to load users: ' + err.message);
      console.error('Error loading users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    setDeleting(userId);
    try {
      await deleteDoc(doc(db, 'users', userId));
      setUsers(users.filter((u) => u.id !== userId));
      alert('User deleted successfully');
    } catch (err: any) {
      setError('Failed to delete user: ' + err.message);
    } finally {
      setDeleting(null);
    }
  };

  const handleResetPassword = async (userId: string, email: string) => {
    if (!window.confirm(`Send password reset email to ${email}?`)) {
      return;
    }

    setResetting(userId);
    try {
      await updateDoc(doc(db, 'users', userId), {
        passwordResetRequested: true,
        passwordResetRequestedAt: new Date(),
      });
      alert(`Password reset link would be sent to ${email}`);
    } catch (err: any) {
      setError('Failed to process password reset: ' + err.message);
    } finally {
      setResetting(null);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) || user.displayName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${currentTheme === 'light' ? 'from-slate-50 to-slate-100' : 'from-slate-950 via-slate-900 to-slate-950'}`}>
        <Navigation />
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="text-center">
            <Loader size={40} className="animate-spin mx-auto mb-4" />
            <p className={currentTheme === 'light' ? 'text-slate-600' : 'text-slate-300'}>Loading users...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${currentTheme === 'light' ? 'from-slate-50 to-slate-100' : 'from-slate-950 via-slate-900 to-slate-950'}`}>
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">


        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield size={32} className="text-emerald-600" />
            <h1 className={`text-4xl font-black ${currentTheme === 'light' ? 'text-slate-900' : 'text-white'}`}>Admin Dashboard</h1>
          </div>
          <p className={currentTheme === 'light' ? 'text-slate-600' : 'text-slate-300'}>Manage all users and system access</p>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 rounded-xl flex items-start gap-3 border-l-4 border-red-500 ${
              currentTheme === 'light' ? 'bg-red-50' : 'bg-red-900/20'
            }`}
          >
            <AlertCircle size={20} className="text-red-500 mt-0.5 flex-shrink-0" />
            <p className={`text-sm ${currentTheme === 'light' ? 'text-red-700' : 'text-red-400'}`}>{error}</p>
          </motion.div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-6 rounded-2xl border backdrop-blur-xl ${
              currentTheme === 'light'
                ? 'bg-white/80 border-white/30'
                : 'bg-slate-900/50 border-slate-700/30'
            }`}
          >
            <h3 className={`text-sm font-semibold ${currentTheme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>Total Users</h3>
            <p className={`text-3xl font-bold mt-2 ${currentTheme === 'light' ? 'text-slate-900' : 'text-white'}`}>{users.length}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className={`p-6 rounded-2xl border backdrop-blur-xl ${
              currentTheme === 'light'
                ? 'bg-white/80 border-white/30'
                : 'bg-slate-900/50 border-slate-700/30'
            }`}
          >
            <h3 className={`text-sm font-semibold ${currentTheme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>Students</h3>
            <p className={`text-3xl font-bold mt-2 ${currentTheme === 'light' ? 'text-slate-900' : 'text-white'}`}>
              {users.filter((u) => u.role === 'student').length}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className={`p-6 rounded-2xl border backdrop-blur-xl ${
              currentTheme === 'light'
                ? 'bg-white/80 border-white/30'
                : 'bg-slate-900/50 border-slate-700/30'
            }`}
          >
            <h3 className={`text-sm font-semibold ${currentTheme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>Professors</h3>
            <p className={`text-3xl font-bold mt-2 ${currentTheme === 'light' ? 'text-slate-900' : 'text-white'}`}>
              {users.filter((u) => u.role === 'professor').length}
            </p>
          </motion.div>
        </div>

        {/* Search Bar */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="relative">
            <Search className={`absolute left-3 top-3 ${currentTheme === 'light' ? 'text-slate-400' : 'text-slate-400'}`} size={18} />
            <input
              type="text"
              placeholder="Search by email or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-xl border backdrop-blur-md transition-all ${
                currentTheme === 'light'
                  ? 'bg-white/70 border-white/40 text-slate-900 placeholder-slate-400'
                  : 'bg-white/10 border-white/20 text-white placeholder-slate-300'
              } focus:outline-none focus:ring-2 focus:ring-emerald-500`}
            />
          </div>
        </motion.div>

        {/* Users Table */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`rounded-2xl border backdrop-blur-xl overflow-hidden ${
          currentTheme === 'light'
            ? 'bg-white/80 border-white/30'
            : 'bg-slate-900/50 border-slate-700/30'
        }`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={currentTheme === 'light' ? 'bg-slate-100/50' : 'bg-slate-800/50'}>
                <tr>
                  <th className={`px-6 py-3 text-left text-sm font-semibold ${currentTheme === 'light' ? 'text-slate-900' : 'text-white'}`}>User</th>
                  <th className={`px-6 py-3 text-left text-sm font-semibold ${currentTheme === 'light' ? 'text-slate-900' : 'text-white'}`}>Email</th>
                  <th className={`px-6 py-3 text-left text-sm font-semibold ${currentTheme === 'light' ? 'text-slate-900' : 'text-white'}`}>Role</th>
                  <th className={`px-6 py-3 text-left text-sm font-semibold ${currentTheme === 'light' ? 'text-slate-900' : 'text-white'}`}>Category</th>
                  <th className={`px-6 py-3 text-left text-sm font-semibold ${currentTheme === 'light' ? 'text-slate-900' : 'text-white'}`}>Joined</th>
                  <th className={`px-6 py-3 text-left text-sm font-semibold ${currentTheme === 'light' ? 'text-slate-900' : 'text-white'}`}>Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: currentTheme === 'light' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)' }}>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className={currentTheme === 'light' ? 'hover:bg-slate-50/50' : 'hover:bg-slate-800/50'}>
                      <td className={`px-6 py-4 text-sm ${currentTheme === 'light' ? 'text-slate-900' : 'text-white'}`}>{user.displayName}</td>
                      <td className={`px-6 py-4 text-sm flex items-center gap-2 ${currentTheme === 'light' ? 'text-slate-600' : 'text-slate-300'}`}>
                        <Mail size={14} />
                        {user.email}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            user.role === 'admin'
                              ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                              : user.role === 'professor'
                                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className={`px-6 py-4 text-sm ${currentTheme === 'light' ? 'text-slate-600' : 'text-slate-300'}`}>{user.disabilityCategory}</td>
                      <td className={`px-6 py-4 text-sm flex items-center gap-2 ${currentTheme === 'light' ? 'text-slate-600' : 'text-slate-300'}`}>
                        <Calendar size={14} />
                        {user.createdAt}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleResetPassword(user.id, user.email)}
                            disabled={resetting === user.id}
                            className="p-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors disabled:opacity-50"
                            title="Reset password"
                          >
                            {resetting === user.id ? <Loader size={16} className="animate-spin" /> : <RotateCcw size={16} className="text-blue-600" />}
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleDeleteUser(user.id)}
                            disabled={deleting === user.id}
                            className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors disabled:opacity-50"
                            title="Delete user"
                          >
                            {deleting === user.id ? <Loader size={16} className="animate-spin" /> : <Trash2 size={16} className="text-red-600" />}
                          </motion.button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className={`px-6 py-4 text-center ${currentTheme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
