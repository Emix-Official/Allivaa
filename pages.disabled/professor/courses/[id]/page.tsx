"use client";

export const dynamic = 'force-static';

import React, { useEffect, useRef, useState } from 'react';
import Navigation from '@/components/Layout/Navigation';
import Footer from '@/components/Layout/Footer';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { collection, doc, addDoc, setDoc, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function ProfessorCoursePage({ params }: { params: { id: string } }) {
  const { id } = params;
  const profile = useAuthStore((s) => s.profile);
  const router = useRouter();
  const [submissions, setSubmissions] = useState<any[]>([]);

  useEffect(() => {
    if (!profile) router.push('/professor/login');
  }, [profile, router]);

  useEffect(() => {
    if (!profile) return;
    const q = query(collection(db, 'courses', id, 'submissions'));
    const unsub = onSnapshot(q, (snap) => {
      const arr: any[] = [];
      snap.forEach((d) => arr.push({ id: d.id, ...d.data() }));
      setSubmissions(arr);
    });
    return () => unsub();
  }, [id, profile]);

  const gradeSubmission = async (submissionId: string, grade: number) => {
    await setDoc(doc(db, 'courses', id, 'submissions', submissionId), { grade }, { merge: true });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900">
      <Navigation />
      <main className="flex-grow max-w-6xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Course: {id}</h1>
        <div className="space-y-4">
          {submissions.map((s) => (
            <div key={s.id} className="p-4 border rounded">
              <div className="flex justify-between">
                <div>
                  <div className="font-semibold">{s.studentName || s.uid}</div>
                  <div className="text-sm text-slate-500">Submitted at: {s.createdAt?.toDate?.()?.toString?.() || s.createdAt}</div>
                </div>
                <div>
                  <input type="number" defaultValue={s.grade || 0} min={0} max={100} className="border rounded px-2 py-1" />
                  <button onClick={() => gradeSubmission(s.id, 100)} className="ml-2 px-3 py-1 bg-emerald-600 text-white rounded">Give 100</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
