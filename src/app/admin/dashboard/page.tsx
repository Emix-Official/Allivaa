'use client';

import { useState, useEffect } from 'react';
import Navigation from '@/components/Layout/Navigation';
import Footer from '@/components/Layout/Footer';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { Trash2, RotateCcw, Shield, Loader2, Search } from 'lucide-react';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface UserAccount {
  uid: string;
  email?: string;
  displayName?: string;
  role?: 'student' | 'admin' | 'professor';
  disabilityCategory?: string;
  createdAt?: any;
  lastLogin?: any;
}

export default function AdminDashboard() {
  const profile = useAuthStore((s) => s.profile);
  const router = useRouter();
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'student' | 'admin' | 'professor'>('all');
  const [resetLoadingId, setResetLoadingId] = useState<string | null>(null);
  const [deleteLoadingId, setDeleteLoadingId] = useState<string | null>(null);

  useEffect(() => {
    if (!profile || profile.role !== 'admin') {
      router.push('/admin/login');
      return;
    }
    loadUsers();
  }, [profile, router]);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, filterRole]);

  const loadUsers = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'users'));
      const usersList: UserAccount[] = [];
      snapshot.forEach((doc) => {
        usersList.push({ uid: doc.id, ...doc.data() } as UserAccount);
      });
      setUsers(usersList.sort((a, b) => {
        const aDate = a.createdAt?.toDate?.() || new Date(0);
        const bDate = b.createdAt?.toDate?.() || new Date(0);
        return bDate.getTime() - aDate.getTime();
      }));
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((user) =>
        user.email?.toLowerCase().includes(term) ||
        user.displayName?.toLowerCase().includes(term) ||
        user.uid?.toLowerCase().includes(term)
      );
    }

    if (filterRole !== 'all') {
      filtered = filtered.filter((user) => user.role === filterRole);
    }

    setFilteredUsers(filtered);
  };

  const handleResetPassword = async (userId: string, email?: string) => {
    if (!email) {
      alert('No email address on file');
      return;
    }

    setResetLoadingId(userId);
    try {
      // In production, integrate with Firebase Admin SDK to send password reset
      // For now, copy reset link instructions to clipboard
      const resetLink = `https://console.firebase.google.com/project/senseaid-site/authentication/users`;
      alert(`Password reset for ${email}\n\nInstructions:\n1. Go to Firebase Console\n2. Authentication > Users\n3. Find ${email}\n4. Click "..." > Reset Password\n5. Send reset email to user`);
    } catch (error) {
      console.error('Failed to reset password:', error);
      alert('Failed to reset password');
    } finally {
      setResetLoadingId(null);
    }
  };

  const handleDeleteAccount = async (userId: string, email?: string) => {
    if (!confirm(`Are you sure you want to delete account: ${email || userId}?\n\nThis action cannot be undone.`)) {
      return;
    }

    setDeleteLoadingId(userId);
    try {
      await deleteDoc(doc(db, 'users', userId));
      setUsers(users.filter((u) => u.uid !== userId));
    } catch (error) {
      console.error('Failed to delete account:', error);
      alert('Failed to delete account');
    } finally {
      setDeleteLoadingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900">
        <Navigation />
        <main className="flex-grow flex items-center justify-center">
          <p className="text-gray-600 dark:text-gray-400">Loading accounts...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900">
      <Navigation />
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Shield size={32} className="text-indigo-600 dark:text-teal-400" />
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400">{filteredUsers.length} accounts</p>
          </div>

          {/* Filters */}
          <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search size={20} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search by email, name, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value as any)}
              className="px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Roles</option>
              <option value="student">Students</option>
              <option value="professor">Professors</option>
              <option value="admin">Admins</option>
            </select>
          </div>

          {/* Accounts Table */}
          <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-slate-700">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Role</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Disability</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Created</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-600 dark:text-gray-400">
                      No accounts found
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.uid} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition">
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{user.email || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{user.displayName || '-'}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          user.role === 'admin'
                            ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                            : user.role === 'professor'
                              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                              : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                        }`}>
                          {user.role || 'student'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{user.disabilityCategory || '-'}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {user.createdAt?.toDate
                          ? new Date(user.createdAt.toDate()).toLocaleDateString()
                          : '-'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleResetPassword(user.uid, user.email)}
                            disabled={resetLoadingId === user.uid}
                            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition disabled:opacity-50"
                            title="Reset password"
                          >
                            {resetLoadingId === user.uid ? <Loader2 size={18} className="animate-spin" /> : <RotateCcw size={18} />}
                          </button>
                          <button
                            onClick={() => handleDeleteAccount(user.uid, user.email)}
                            disabled={deleteLoadingId === user.uid}
                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition disabled:opacity-50"
                            title="Delete account"
                          >
                            {deleteLoadingId === user.uid ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
