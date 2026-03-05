"use client";

export const dynamic = 'force-static';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Layout/Navigation';
import Footer from '@/components/Layout/Footer';
import { useAuthStore } from '@/store/authStore';
import { ref as storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage, db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

type Props = { params: { id: string; assignmentId: string } };

export default function SubmitAssignmentPage({ params }: Props) {
  const { id, assignmentId } = params;
  const profile = useAuthStore((s) => s.profile);
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  if (!profile) {
    if (typeof window !== 'undefined') router.push('/login');
    return null;
  }

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !profile) return;
    setUploading(true);
    setError('');

    try {
      const sid = `${Date.now()}-${file.name}`;
      const path = `submissions/${id}/${assignmentId}/${sid}`;
      const sRef = storageRef(storage, path);
      const uploadTask = uploadBytesResumable(sRef, file);

      uploadTask.on('state_changed', (snapshot) => {
        const pct = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setProgress(pct);
      });

      await uploadTask;
      const url = await getDownloadURL(sRef);

      // create submission doc
      await addDoc(collection(db, 'courses', id, 'assignments', assignmentId, 'submissions'), {
        studentId: profile.uid,
        studentEmail: profile.email,
        fileName: file.name,
        fileUrl: url,
        createdAt: serverTimestamp(),
        graded: false,
      });

      // optional: create a notification for the professor (naive)
      await addDoc(collection(db, 'notifications'), {
        toCourseId: id,
        toAssignmentId: assignmentId,
        type: 'submission',
        fromStudent: profile.uid,
        createdAt: serverTimestamp(),
      });

      router.push(`/courses/${id}`);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900">
      <Navigation />
      <main className="flex-grow max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Submit Assignment</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">File</label>
            <input type="file" onChange={handleFile} className="w-full" />
          </div>

          {uploading && <div>Uploading: {progress}%</div>}
          {error && <div className="text-red-600">{error}</div>}

          <div className="flex gap-2">
            <button disabled={uploading || !file} className="px-4 py-2 bg-emerald-600 text-white rounded">Upload</button>
            <button type="button" onClick={() => router.back()} className="px-4 py-2 border rounded">Cancel</button>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
}
