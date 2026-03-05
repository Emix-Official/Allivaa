"use client";

import React, { useState, useRef } from 'react';
import { ref as storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage, db } from '@/lib/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

export default function UploadPanel() {
  const [files, setFiles] = useState<Array<{ name: string; url?: string; type: string; id?: string }>>([]);
  const [readingRate, setReadingRate] = useState(1);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploads, setUploads] = useState<Array<{ id: string; name: string; type: string; progress: number; status: 'uploading' | 'done' | 'error'; url?: string; storagePath?: string; docId?: string }>>([]);
  const router = useRouter();

  const onSelectFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files;
    if (!selected) return;
    const successes: Array<{ name: string; url?: string; type: string; id?: string }> = [];
    const failures: string[] = [];

    // Kick off uploads and track progress per-file
    for (let i = 0; i < selected.length; i++) {
      const f = selected[i];
      const id = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      const path = `uploads/${Date.now()}_${Math.random().toString(36).slice(2, 8)}_${f.name}`;
      const sref = storageRef(storage, path);

      // add to uploads state
      setUploads((u) => [{ id, name: f.name, type: f.type, progress: 0, status: 'uploading' }, ...u]);

      // create task and listen
      const task = uploadBytesResumable(sref, f);

      task.on(
        'state_changed',
        (snapshot) => {
          const pct = snapshot.totalBytes ? Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100) : 0;
          setUploads((u) => u.map((x) => (x.id === id ? { ...x, progress: pct } : x)));
        },
        (err) => {
          console.error('Upload failed for', f.name, err);
          setUploads((u) => u.map((x) => (x.id === id ? { ...x, status: 'error' } : x)));
          failures.push(f.name);
        },
        async () => {
          try {
            const url = await getDownloadURL(sref);
            // persist metadata to Firestore for this file and capture doc id
            try {
              const docRef = await addDoc(collection(db, 'userUploads'), {
                name: f.name,
                url,
                type: f.type,
                storagePath: path,
                createdAt: serverTimestamp(),
              });
              // mark done and attach docId
              setUploads((u) => u.map((x) => (x.id === id ? { ...x, progress: 100, status: 'done', url, storagePath: path, docId: docRef.id } : x)));
              // add to visible files immediately
              setFiles((prev) => [{ name: f.name, url, type: f.type, id: docRef.id }, ...prev]);
              successes.push({ name: f.name, url, type: f.type, id: docRef.id });
            } catch (e) {
              console.error('Failed to write metadata for', f.name, e);
              setUploads((u) => u.map((x) => (x.id === id ? { ...x, progress: 100, status: 'done', url, storagePath: path } : x)));
              // even if metadata write failed, show file in UI
              setFiles((prev) => [{ name: f.name, url, type: f.type }, ...prev]);
              successes.push({ name: f.name, url, type: f.type });
            }
          } catch (err) {
            console.error('Error finalizing upload for', f.name, err);
            setUploads((u) => u.map((x) => (x.id === id ? { ...x, status: 'error' } : x)));
            failures.push(f.name);
          }
        }
      );
    }

    if (successes.length > 0) {
      setFiles((prev) => [...successes, ...prev]);
    }

    if (fileInputRef.current) fileInputRef.current.value = '';

    if (failures.length > 0) {
      alert(`Failed to upload: ${failures.join(', ')}. Check console for details.`);
    }
  };

  const readText = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('SpeechSynthesis not supported in this browser.');
      return;
    }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = readingRate;
    window.speechSynthesis.speak(u);
  };

  const handleReadFile = async (item: { name: string; url?: string; type: string }) => {
    if (!item.url) return alert('No URL for file');
    // For plain text files, fetch and read
    if (item.type.startsWith('text/') || item.name.endsWith('.md')) {
      const res = await fetch(item.url);
      const txt = await res.text();
      readText(txt);
      return;
    }

    // PDF reading: attempt to load PDF and extract text if pdfjs available
    if (item.name.endsWith('.pdf')) {
      // PDF extraction is not available in this free client-only mode.
      // To enable PDF reading, install `pdfjs-dist` and the app can extract text from PDFs.
      alert('PDF reading is not supported in this free client mode. Upload plain text or markdown to enable in-browser reading.');
      return;
    }

    alert('Document reading is supported for plain text and markdown. PDF reading is experimental.');
  };

  const enqueueCaptionJob = async (item: { name: string; url?: string; type: string }) => {
    // create a caption job document that functions can pick up
    try {
      await addDoc(collection(db, 'captionJobs'), {
        storagePath: item.url, // for functions we used storagePath; here we store URL for convenience
        url: item.url,
        type: item.type,
        status: 'queued',
        createdAt: serverTimestamp(),
      });
      alert('Caption job enqueued. If server-side transcription is configured it will be processed.');
    } catch (e) {
      console.error(e);
      alert('Failed to enqueue caption job');
    }
  };

  return (
    <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-gray-100 dark:border-slate-700">
      <h4 className="font-semibold mb-2">Upload documents & videos</h4>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Upload files here. Documents can be read aloud; videos can be enqueued for captioning.</p>

      <div className="flex items-center gap-2">
        <input ref={fileInputRef} type="file" multiple onChange={onSelectFiles} className="hidden" id="upload-input" />
        <label htmlFor="upload-input" onClick={() => fileInputRef.current?.click()} className="px-4 py-2 bg-indigo-600 text-white rounded cursor-pointer">Select files</label>
        <div className="ml-auto flex items-center gap-2">
          <label className="text-sm">Reading speed</label>
          <input type="range" min={0.5} max={2} step={0.1} value={readingRate} onChange={(e) => setReadingRate(Number(e.target.value))} />
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {/* Active uploads with per-file progress */}
        {uploads.length > 0 && (
          <div className="space-y-2 mb-3">
            {uploads.map((u) => (
              <div key={u.id} className="p-2 bg-gray-50 dark:bg-slate-900 rounded">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">{u.name}</div>
                  <div className="text-xs text-gray-500">{u.status === 'uploading' ? `${u.progress}%` : u.status}</div>
                </div>
                <div className="w-full bg-gray-200 dark:bg-slate-800 rounded h-2 mt-2 overflow-hidden">
                  <div className={`h-2 bg-indigo-600`} style={{ width: `${u.progress}%` }} />
                </div>
              </div>
            ))}
          </div>
        )}
        {files.map((f, idx) => (
          <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-slate-900 rounded">
            <div>
              <div className="font-medium">{f.name}</div>
              <div className="text-xs text-gray-500">{f.type}</div>
            </div>
              <div className="flex items-center gap-2">
              <button onClick={() => handleReadFile(f)} className="px-3 py-1 bg-green-600 text-white rounded text-sm">Read</button>
              {f.type.startsWith('video/') && (
                <>
                  <button onClick={() => enqueueCaptionJob(f)} className="px-3 py-1 bg-indigo-600 text-white rounded text-sm">Enqueue Captions</button>
                </>
              )}
              <a className="px-3 py-1 bg-gray-200 dark:bg-slate-700 rounded text-sm" href={f.url} target="_blank" rel="noreferrer">Open</a>
              {/* Open in our viewer if we have a doc id */}
              {f.id && (
                <button
                  onClick={() => router.push(`/uploads/viewer/${f.id}`)}
                  className="px-3 py-1 bg-indigo-700 text-white rounded text-sm"
                >
                  Open Viewer
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
