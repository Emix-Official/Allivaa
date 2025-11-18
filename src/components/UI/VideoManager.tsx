"use client";

import React, { useEffect, useState } from 'react';
import { collection, getDocs, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import TranscriptModal from '@/components/UI/TranscriptModal';

type UploadItem = {
  id: string;
  name: string;
  url?: string;
  type?: string;
  storagePath?: string;
};

type CaptionJob = {
  id: string;
  url?: string;
  storagePath?: string;
  status?: string;
  createdAt?: any;
};

type CaptionDoc = {
  jobId?: string;
  storagePath?: string;
  transcript?: string;
  language?: string;
  provider?: string;
  error?: string;
  createdAt?: any;
};

export default function VideoManager() {
  const [videos, setVideos] = useState<UploadItem[]>([]);
  const [jobsMap, setJobsMap] = useState<Record<string, CaptionJob>>({});
  const [captionsMap, setCaptionsMap] = useState<Record<string, CaptionDoc>>({});
  const [signMap, setSignMap] = useState<Record<string, { translation: string; createdAt?: any }>>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTranscript, setModalTranscript] = useState<string | null>(null);
  const [modalTitle, setModalTitle] = useState<string | undefined>(undefined);
  const [modalFilename, setModalFilename] = useState<string | undefined>(undefined);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const snap = await getDocs(collection(db, 'userUploads'));
        const items: UploadItem[] = [];
        snap.forEach((d) => {
          const data = d.data() as any;
          if (data?.type && typeof data.type === 'string' && data.type.startsWith('video/')) {
            items.push({ id: d.id, name: data.name, url: data.url, type: data.type, storagePath: data.storagePath });
          }
        });
        if (mounted) setVideos(items);
      } catch (err) {
        console.error('Failed to load videos', err);
      }
    })();

    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'captionJobs'), (snap) => {
      const map: Record<string, CaptionJob> = {};
      snap.forEach((d) => {
        const data = d.data() as any;
        const job: CaptionJob = { id: d.id, url: data.url, storagePath: data.storagePath, status: data.status, createdAt: data.createdAt };
        const key = data.url || data.storagePath || d.id;
        if (!map[key]) map[key] = job;
        else {
          const prev = map[key];
          if ((job.createdAt?.seconds || 0) > (prev.createdAt?.seconds || 0)) map[key] = job;
        }
      });
      setJobsMap(map);
    }, (err) => console.error('captionJobs snapshot error', err));

    return () => unsub();
  }, []);

  // Listen for produced captions documents. Functions persist transcripts to
  // `captions/{jobId}` (jobId === caption doc id), so keep a map for quick lookup.
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'captions'), (snap) => {
      const m: Record<string, CaptionDoc> = {};
      snap.forEach((d) => {
        const data = d.data() as any;
        m[d.id] = {
          jobId: data.jobId || d.id,
          storagePath: data.storagePath,
          transcript: data.transcript,
          language: data.language,
          provider: data.provider,
          error: data.error,
          createdAt: data.createdAt,
        };
      });
      setCaptionsMap(m);
    }, (err) => console.error('captions snapshot error', err));

    return () => unsub();
  }, []);

  // Listen for sign-language translations and map by storagePath or docId
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'signTranslations'), (snap) => {
      const m: Record<string, { translation: string; createdAt?: any }> = {};
      snap.forEach((d) => {
        const data = d.data() as any;
        const key = data.docId || data.storagePath || d.id;
        // keep the newest
        if (!m[key] || (data.createdAt?.seconds || 0) > (m[key].createdAt?.seconds || 0)) {
          m[key] = { translation: data.translation, createdAt: data.createdAt };
        }
      });
      setSignMap(m);
    }, (err) => console.error('signTranslations snapshot error', err));
    return () => unsub();
  }, []);

  const enqueueCaption = async (item: UploadItem) => {
    try {
      await addDoc(collection(db, 'captionJobs'), {
        storagePath: item.storagePath || null,
        url: item.url || null,
        type: item.type || 'video',
        status: 'queued',
        createdAt: serverTimestamp(),
      });
      const key = item.url || item.storagePath || item.id;
      setJobsMap((m) => ({ ...m, [key]: { id: 'pending', url: item.url, storagePath: item.storagePath, status: 'queued' } }));
    } catch (err) {
      console.error('Failed to enqueue caption', err);
      alert('Failed to enqueue caption job');
    }
  };

  const openTranscriptModal = (jobId: string | undefined, title?: string, filename?: string) => {
    if (!jobId) return alert('No transcript id');
    const doc = captionsMap[jobId];
    if (!doc || !doc.transcript) return alert('Transcript not available yet');
    setModalTranscript(doc.transcript || null);
    setModalTitle(title || 'Transcript');
    setModalFilename(filename || `${title || 'transcript'}.txt`);
    setModalOpen(true);
  };

  return (
    <section className="mt-8">
      <h3 className="text-2xl font-semibold mb-4">My Videos</h3>
      <div className="space-y-3">
        {videos.length === 0 && <div className="text-sm text-gray-500">No videos found. Upload using the Upload panel below.</div>}
        {videos.map((d) => {
          const key = d.url || d.storagePath || d.id;
          const job = jobsMap[key];
          const status = job?.status || 'none';
          return (
            <React.Fragment key={d.id}>
            <div className="p-3 border rounded bg-gray-50 dark:bg-slate-800 flex items-center justify-between">
              <div>
                <div className="font-medium">{d.name}</div>
                <div className="text-xs text-gray-500">{d.type}</div>
              </div>
              {signMap[key] && (
                <div className="text-sm text-gray-600 mr-4">Translation: <span className="font-medium">{signMap[key].translation}</span></div>
              )}
              <div className="flex items-center gap-3">
                {status !== 'none' && (
                  <div className={`px-2 py-1 rounded text-xs ${status === 'queued' ? 'bg-yellow-100 text-yellow-800' : status === 'processing' ? 'bg-sky-100 text-sky-800' : status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {status}
                  </div>
                )}
                <a href={d.url} target="_blank" rel="noreferrer" className="px-3 py-1 bg-indigo-600 text-white rounded">Open</a>
                <button
                  onClick={() => enqueueCaption(d)}
                  disabled={status === 'queued' || status === 'processing' || status === 'completed'}
                  className={`px-3 py-1 rounded text-sm ${status === 'queued' || status === 'processing' || status === 'completed' ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-indigo-600 text-white'}`}
                >
                  Enqueue Captions
                </button>
                {/* Transcript preview for completed jobs */}
                {status === 'completed' && (() => {
                  const jobId = job?.id;
                  const caption = jobId ? captionsMap[jobId] : undefined;
                  return (
                    <>
                      {caption && caption.transcript ? (
                        <>
                          <button
                            onClick={() => openTranscriptModal(jobId, d.name, `${d.name}-transcript.txt`)}
                            className="px-3 py-1 rounded text-sm bg-white border border-gray-200 text-gray-800"
                          >
                            View Transcript
                          </button>
                        </>
                      ) : (
                        <div className="text-sm text-gray-500 px-2">Transcript pending</div>
                      )}
                    </>
                  );
                })()}
              </div>
            </div>
            {/* modal handled separately */}
            </React.Fragment>
          );
        })}
      </div>
      <TranscriptModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalTitle}
        transcript={modalTranscript}
        filename={modalFilename}
      />
    </section>
  );
}
