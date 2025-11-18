"use client";

import React, { useRef, useState } from 'react';
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import TranscriptModal from '@/components/UI/TranscriptModal';

type Props = {
  name?: string;
  url?: string;
  type?: string;
  storagePath?: string;
  docId?: string;
};

export default function MediaControlPanel({ name, url, type, storagePath, docId }: Props) {
  const [loading, setLoading] = useState(false);
  const [signActive, setSignActive] = useState(false);
  const [signStatus, setSignStatus] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cameraRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const holisticRef = useRef<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTranscript, setModalTranscript] = useState<string | null>(null);
  const [modalTitle, setModalTitle] = useState<string | undefined>(undefined);
  const [autoTranslate, setAutoTranslate] = useState(false);
  const [translation, setTranslation] = useState<string>('');
  const [detections, setDetections] = useState<string[]>([]);
  const [waitingForDetection, setWaitingForDetection] = useState(false);
  const firstDetectionTimeout = useRef<number | null>(null);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [captureLog, setCaptureLog] = useState<string[]>([]);
  const [showLog, setShowLog] = useState(false);
  const lastWristX = useRef<number | null>(null);
  const lastSaveAt = useRef<number | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const saveTimer = useRef<any>(null);

  const enqueueCaption = async () => {
    if (!url && !storagePath) return alert('No file to caption');
    setLoading(true);
    try {
      await addDoc(collection(db, 'captionJobs'), {
        storagePath: storagePath || url || null,
        url: url || null,
        type: type || 'video',
        status: 'queued',
        createdAt: new Date(),
      });
      alert('Caption job enqueued');
    } catch (e) {
      console.error(e);
      alert('Failed to enqueue caption job');
    } finally {
      setLoading(false);
    }
  };

  const openTranscriptModalForCurrent = async () => {
    try {
      const q = query(collection(db, 'captions'), where('storagePath', '==', storagePath || ''));
      const snap = await getDocs(q);
      if (snap.empty) return alert('No transcript available yet.');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const doc = snap.docs[0].data() as any;
      const transcript = doc.transcript || '';
      if (!transcript) return alert('Transcript found but empty.');
      setModalTranscript(transcript);
      setModalTitle(name || 'Transcript');
      setModalOpen(true);
    } catch (e) {
      console.error(e);
      alert('Failed to load transcript');
    }
  };

  const readTranscriptIfAvailable = async () => {
    try {
      // try to find captions doc matching this file
      const q = query(collection(db, 'captions'), where('storagePath', '==', storagePath || ''));
      const snap = await getDocs(q);
      if (snap.empty) return alert('No transcript available yet.');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const doc = snap.docs[0].data() as any;
      const transcript = doc.transcript || '';
      if (!transcript) return alert('Transcript found but empty.');
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        const u = new SpeechSynthesisUtterance(transcript);
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(u);
      } else {
        alert('SpeechSynthesis not available in this browser');
      }
    } catch (e) {
      console.error(e);
      alert('Failed to read transcript');
    }
  };

  // MediaPipe Sign Language demo (Holistic) - fast parallel load
  const startSignCapture = async () => {
    if (signActive) return;
    setSignStatus('Initializing...');
    
    // Get user media first for faster visual feedback
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      console.error('camera failed', err);
      const e = err as { name?: string } & Record<string, unknown>;
      const errName = e?.name || 'unknown';
      let msg = 'Unable to access camera';
      if (errName === 'NotFoundError' || errName === 'DeviceNotFoundError') {
        msg = 'No camera device found. Please connect a camera or USB device.';
      } else if (errName === 'NotAllowedError' || errName === 'PermissionDenied') {
        msg = 'Camera access denied. Please allow camera permission in your browser settings.';
      } else if (errName === 'NotReadableError') {
        msg = 'Camera is in use by another app. Please close other apps using the camera.';
      }
      setSignStatus(msg);
      return;
    }

    try {
      setSignStatus('Loading MediaPipe...');
      setLoadingProgress(0);
      // Load scripts and update progress as each one loads
      if (!((window as unknown) as Record<string, unknown>).Holistic) {
        const urls = [
          'https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js',
          'https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js',
          'https://cdn.jsdelivr.net/npm/@mediapipe/holistic/holistic.js',
        ];
        let loaded = 0;
        const total = urls.length;
        // create script tags and attach onload handlers to increment progress
        await Promise.all(urls.map((src) => new Promise<void>((resolve, reject) => {
          const s = document.createElement('script');
          s.src = src;
          s.async = true;
          s.onload = () => {
            loaded += 1;
            const pct = Math.round((loaded / total) * 100);
            setLoadingProgress(pct);
            logEvent(`Loaded script: ${src} (${pct}%)`);
            resolve();
          };
          s.onerror = (err) => {
            logEvent(`Failed to load script: ${src}`);
            reject(err);
          };
          document.head.appendChild(s);
        })));
        setLoadingProgress(100);
      }

      // Access Holistic and Camera from window with fallbacks
      const windowRecord = (window as unknown) as Record<string, unknown>;
      const Holistic = windowRecord.Holistic;
      const Camera = windowRecord.Camera;

      if (!Holistic) {
        setSignStatus('MediaPipe Holistic not loaded');
        return;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      holisticRef.current = new (Holistic as any)({
        locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`,
      });
      logEvent('Initialized Holistic model');

      holisticRef.current.setOptions({
        modelComplexity: 0, // Faster (was 1)
        smoothLandmarks: true,
        enableSegmentation: false,
        refineFaceLandmarks: false, // Faster
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });

      let isProcessing = false;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      holisticRef.current.onResults((results: any) => {
        isProcessing = true;
        
        // Draw skeleton
        const canvas = canvasRef.current;
        const video = videoRef.current;
        if (!canvas || !video) {
          isProcessing = false;
          return;
        }
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          isProcessing = false;
          return;
        }
        
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.save();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Draw landmarks
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((window as any).drawConnectors) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const d = window as any;
          try {
            if (results.poseLandmarks && d.POSE_CONNECTIONS) {
              d.drawConnectors(ctx, results.poseLandmarks, d.POSE_CONNECTIONS, { color: '#00FF00', lineWidth: 2 });
            }
            if (results.leftHandLandmarks && d.HAND_CONNECTIONS) {
              d.drawConnectors(ctx, results.leftHandLandmarks, d.HAND_CONNECTIONS, { color: '#FF0000', lineWidth: 2 });
              d.drawLandmarks(ctx, results.leftHandLandmarks, { color: '#FF0000', lineWidth: 1 });
            }
            if (results.rightHandLandmarks && d.HAND_CONNECTIONS) {
              d.drawConnectors(ctx, results.rightHandLandmarks, d.HAND_CONNECTIONS, { color: '#0000FF', lineWidth: 2 });
              d.drawLandmarks(ctx, results.rightHandLandmarks, { color: '#0000FF', lineWidth: 1 });
            }
            if (results.faceLandmarks && d.FACEMESH_TESSELATION) {
              d.drawConnectors(ctx, results.faceLandmarks, d.FACEMESH_TESSELATION, { color: '#FFFFFF', lineWidth: 0.5 });
            }
          } catch {
            // Ignore drawing errors
          }
        }
        ctx.restore();

        // Process hand gestures for translation
        try {
          const right = results.rightHandLandmarks;
          const left = results.leftHandLandmarks;
          const hand = right || left;
          
          if (hand && hand[0]) {
            const wrist = hand[0];
            const indexTip = hand[8];
            const indexPip = hand[6];
            const thumbTip = hand[4];

            // Calculate avg distance of fingertips from wrist
            let avgDist = 0;
            let count = 0;
            for (const i of [4, 8, 12, 16, 20]) {
              const p = hand[i];
              if (p) {
                const dx = p.x - wrist.x;
                const dy = p.y - wrist.y;
                avgDist += Math.hypot(dx, dy);
                count++;
              }
            }
            if (count > 0) avgDist = avgDist / count;

            let guessed = '';
            if (avgDist < 0.06) guessed = 'fist';
            else if (indexTip && indexPip && indexTip.y < indexPip.y && avgDist > 0.10) guessed = 'point';
            else if (thumbTip && indexTip && thumbTip.y < indexTip.y && avgDist > 0.10) guessed = 'thumbs up';

            if (lastWristX.current != null) {
              const dx = wrist.x - lastWristX.current;
              if (dx > 0.12) guessed = 'swipe right';
              else if (dx < -0.12) guessed = 'swipe left';
            }
            lastWristX.current = wrist.x;

            if (guessed) {
              let text = '';
              if (guessed === 'fist') text = 'stop';
              else if (guessed === 'point') text = 'pointing';
              else if (guessed === 'thumbs up') text = 'yes';
              else if (guessed === 'swipe right') text = 'next';
              else if (guessed === 'swipe left') text = 'previous';

              // update UI translation and history
              const handleNewTranslation = (t: string) => {
                setTranslation(t);
                setDetections((s) => {
                  const next = [t, ...s].slice(0, 10);
                  return next;
                });
                // clear waiting flag and timeout on first detection
                if (waitingForDetection) {
                  setWaitingForDetection(false);
                  if (firstDetectionTimeout.current) {
                    window.clearTimeout(firstDetectionTimeout.current as number);
                    firstDetectionTimeout.current = null;
                  }
                }
              };

              handleNewTranslation(text);

              if (autoTranslate) {
                const now = Date.now();
                const last = lastSaveAt.current || 0;
                if (!last || now - last > 1500) {
                  lastSaveAt.current = now;
                  if (saveTimer.current) clearTimeout(saveTimer.current);
                  saveTimer.current = setTimeout(async () => {
                    try {
                      await addDoc(collection(db, 'signTranslations'), {
                        storagePath: storagePath || null,
                        docId: docId || null,
                        translation: text,
                        createdAt: new Date(),
                      });
                    } catch (e) {
                      console.error('failed to save sign translation', e);
                    }
                  }, 250);
                }
              }
            }
          }
        } catch {
          // Ignore processing errors
        }

        isProcessing = false;
      });

      // Initialize camera - wait for video to be ready
      setSignStatus('Starting camera feed...');
      logEvent('Starting camera feed');
      // show waiting indicator until first landmark/translation appears
      setWaitingForDetection(true);
      if (firstDetectionTimeout.current) clearTimeout(firstDetectionTimeout.current);
      // if no detection within 8s, notify user to check lighting/position
      firstDetectionTimeout.current = window.setTimeout(() => {
        if (waitingForDetection) {
          setSignStatus('No landmarks detected yet. Ensure good lighting, camera angle, and allow a few seconds.');
        }
      }, 8000);
      
      const initCamera = () => {
        if (videoRef.current && videoRef.current.readyState >= 2) {
          // Video is ready
          if (Camera) {
            try {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              cameraRef.current = new (Camera as any)(videoRef.current, {
                onFrame: async () => {
                  if (!isProcessing && holisticRef.current && videoRef.current) {
                    await holisticRef.current.send({ image: videoRef.current });
                  }
                },
                width: 640,
                height: 480,
              });
              cameraRef.current.start();
              setSignActive(true);
              setSignStatus('✓ Sign capture active');
              logEvent('Camera started and sign capture active');
            } catch (e) {
              console.error('camera start failed', e);
              setSignStatus('Failed to start camera feed');
              logEvent('Camera start failed');
            }
          } else {
            setSignStatus('Camera utility not found');
            logEvent('Camera utility not found');
          }
        } else {
          // Wait for video to be ready
          setTimeout(initCamera, 100);
        }
      };
      
      initCamera();
    } catch (err) {
      console.error('MediaPipe load failed', err);
      setSignStatus('Failed to load MediaPipe. Check CDN access.');
      logEvent('MediaPipe load failed');
    }
  };

  const logEvent = (msg: string) => {
    const t = new Date().toLocaleTimeString();
    setCaptureLog((s) => {
      const next = [`[${t}] ${msg}`, ...s].slice(0, 100);
      return next;
    });
  };

  const restartCapture = async () => {
    logEvent('Restart requested');
    try {
      stopSignCapture();
    } catch {
      // ignore
    }
    setDetections([]);
    setTranslation('');
    setLoadingProgress(0);
    setWaitingForDetection(false);
    // small delay to ensure media tracks stop
    setTimeout(() => startSignCapture(), 300);
  };

  const stopSignCapture = () => {
    try {
      if (cameraRef.current && cameraRef.current.stop) cameraRef.current.stop();
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((t) => t.stop());
        videoRef.current.srcObject = null;
      }
      if (holisticRef.current && holisticRef.current.close) holisticRef.current.close();
    } catch (e) {
      console.error('stop failed', e);
    }
    setSignActive(false);
    setSignStatus(null);
  };


  return (
    <div className="p-4 bg-white dark:bg-slate-800 rounded border border-gray-100 dark:border-slate-700">
      <h4 className="font-semibold mb-2">Controls</h4>
      <div className="space-y-3">
        <div>
          <div className="text-sm font-medium">{name}</div>
          <div className="text-xs text-gray-500">{type}</div>
        </div>

        <div className="flex flex-col gap-2">
          <button onClick={enqueueCaption} disabled={loading} className="px-3 py-2 bg-indigo-600 text-white rounded">Auto Caption</button>
          <div className="flex items-center gap-2">
            <button onClick={readTranscriptIfAvailable} className="px-3 py-2 bg-green-600 text-white rounded">Read Transcript</button>
            <button onClick={openTranscriptModalForCurrent} className="px-3 py-2 bg-gray-100 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white rounded hover:bg-gray-200 dark:hover:bg-slate-600">View Transcript</button>
          </div>
          <a href={url} target="_blank" rel="noreferrer" className="inline-block px-3 py-2 bg-gray-200 dark:bg-slate-700 rounded">Download</a>
          {/* Sign-language demo: start/stop webcam and show landmarks using MediaPipe Holistic (CDN or installed) */}
          <div className="border-t pt-3">
            <div className="text-sm font-medium mb-2">Sign Language Demo</div>
            <div className="flex items-center gap-2">
              {!signActive ? (
                <button onClick={startSignCapture} className="px-3 py-2 bg-amber-600 text-white rounded">Start Sign Capture</button>
              ) : (
                <button onClick={stopSignCapture} className="px-3 py-2 bg-red-600 text-white rounded">Stop Capture</button>
              )}
              <button onClick={restartCapture} className="px-3 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded">Retry</button>
              <button onClick={() => setShowLog((s) => !s)} className="px-2 py-1 bg-gray-200 dark:bg-slate-700 text-gray-900 dark:text-white rounded text-sm hover:bg-gray-300 dark:hover:bg-slate-600">{showLog ? 'Hide Log' : 'Show Log'}</button>
              <div className="text-xs text-gray-500">{signStatus || 'Use camera to capture hand/pose landmarks'}</div>
            </div>
            {/* Loading progress for MediaPipe scripts */}
            {loadingProgress > 0 && loadingProgress < 100 && (
              <div className="mt-2">
                <div className="h-2 bg-gray-300 dark:bg-slate-600 rounded overflow-hidden">
                  <div className="h-2 bg-amber-500" style={{ width: `${loadingProgress}%` }} />
                </div>
                <div className="text-xs text-gray-500 mt-1">Loading skeleton assets... {loadingProgress}%</div>
              </div>
            )}
            <div className="mt-3 grid grid-cols-1 gap-2">
              <video ref={videoRef} className="w-full rounded bg-black" autoPlay playsInline muted style={{ display: signActive ? 'block' : 'none' }} />
              <canvas ref={canvasRef} className="w-full rounded border" style={{ display: signActive ? 'block' : 'none' }} />
            </div>
            {/* Live transcript / detection area */}
            <div className="mt-3">
              <div className="flex items-center gap-2 mb-2">
                <label className="inline-flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={autoTranslate} onChange={(e) => setAutoTranslate(e.target.checked)} />
                  <span>Auto-Translate</span>
                </label>
                <button onClick={async () => { if (!translation) return; try { await addDoc(collection(db, 'signTranslations'), { storagePath: storagePath || null, docId: docId || null, translation, createdAt: new Date() }); alert('Saved translation'); } catch (e) { console.error(e); alert('Save failed'); } }} className="px-2 py-1 bg-slate-100 rounded text-sm">Save</button>
                <button onClick={() => { if (!translation) return; navigator.clipboard?.writeText(translation); }} className="px-2 py-1 bg-slate-100 rounded text-sm">Copy</button>
              </div>
              <div className="p-2 bg-gray-100 dark:bg-slate-800 rounded border border-gray-300 dark:border-slate-700 min-h-[44px]">
                {waitingForDetection ? (
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-t-transparent border-indigo-600 dark:border-indigo-400" />
                    <div className="text-sm text-gray-700 dark:text-gray-300">Looking for hands and pose — this can take 1–5s</div>
                  </div>
                ) : (
                  <div>
                    {detections.length === 0 && !translation ? (
                      <div className="text-gray-600 dark:text-gray-400 text-sm">No translation yet</div>
                    ) : (
                      <div className="flex flex-col gap-1">
                        {detections.map((d, i) => (
                          <div key={i} className="text-sm">{d}</div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            {/* Capture log panel */}
            {showLog && (
              <div className="mt-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium">Capture Log</div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => { navigator.clipboard?.writeText(captureLog.join('\n')); }} className="px-2 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">Copy</button>
                    <button onClick={() => setCaptureLog([])} className="px-2 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700">Clear</button>
                  </div>
                </div>
                <div className="p-2 bg-black/5 dark:bg-white/5 rounded border border-gray-300 dark:border-slate-700 max-h-40 overflow-auto text-xs">
                  {captureLog.length === 0 ? <div className="text-gray-400">No events yet</div> : captureLog.map((l, i) => <div key={i} className="whitespace-pre-wrap">{l}</div>)}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <TranscriptModal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={modalTitle} transcript={modalTranscript} filename={`${modalTitle || 'transcript'}.txt`} />
    </div>
  );
}
