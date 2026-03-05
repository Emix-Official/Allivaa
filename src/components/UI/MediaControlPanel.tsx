"use client";

import React, { useRef, useState } from 'react';
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
// TranscriptModal removed — replaced with snapshot/export detections UI

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

  // Transcript-related functions removed. Replaced by snapshot + export features below.

  // MediaPipe Sign Language demo (Holistic) - fast parallel load
  const startSignCapture = async () => {
    if (signActive) {
      // If already active, try a safe restart to recover from partial state
      try {
        stopSignCapture();
      } catch {}
      // small pause to ensure resources are released
      await new Promise((r) => setTimeout(r, 200));
    }
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

      // helper: draw landmarks/connectors locally (fallback to MediaPipe drawing utils)
      const HAND_CONNECTIONS: [number, number][] = [
        [0,1],[1,2],[2,3],[3,4],[0,5],[5,6],[6,7],[7,8],[5,9],[9,10],[10,11],[11,12],[9,13],[13,14],[14,15],[15,16],[13,17],[17,18],[18,19],[19,20]
      ];
      const POSE_CONNECTIONS: [number, number][] = [
        [11,13],[13,15],[12,14],[14,16],[11,12],[23,24],[11,23],[12,24]
      ];

      const drawLandmarksLocal = (ctx: CanvasRenderingContext2D, landmarks: Array<any>, color = '#FF0000') => {
        if (!landmarks || !landmarks.length) return;
        // landmarks are normalized [0..1] relative to CSS pixels (w,h),
        // while canvas.width/height are in device pixels. Compute CSS size.
        const dpr = window.devicePixelRatio || 1;
        const w = ctx.canvas.width / dpr;
        const h = ctx.canvas.height / dpr;
        ctx.fillStyle = color;
        for (const p of landmarks) {
          const x = p.x * w;
          const y = p.y * h;
          ctx.beginPath();
          ctx.arc(x, y, 4, 0, Math.PI * 2);
          ctx.fill();
        }
      };

      const drawConnectionsLocal = (ctx: CanvasRenderingContext2D, landmarks: Array<any>, connections: Array<[number,number]>, color = '#00FF00') => {
        if (!landmarks || !landmarks.length) return;
        const dpr = window.devicePixelRatio || 1;
        const w = ctx.canvas.width / dpr;
        const h = ctx.canvas.height / dpr;
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        for (const [a,b] of connections) {
          const p1 = landmarks[a];
          const p2 = landmarks[b];
          if (!p1 || !p2) continue;
          const x1 = p1.x * w;
          const y1 = p1.y * h;
          const x2 = p2.x * w;
          const y2 = p2.y * h;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        }
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      holisticRef.current.onResults((results: any) => {
        isProcessing = true;
        // Log a lightweight summary for debugging so we can see whether
        // landmarks are being returned and why the skeleton may not appear.
        try {
          const poseCount = results.poseLandmarks ? results.poseLandmarks.length : 0;
          const leftCount = results.leftHandLandmarks ? results.leftHandLandmarks.length : 0;
          const rightCount = results.rightHandLandmarks ? results.rightHandLandmarks.length : 0;
          logEvent(`Results: pose=${poseCount} left=${leftCount} right=${rightCount}`);
          // Also expose a console.debug with a small sample of coords
          if (poseCount || leftCount || rightCount) {
            // show first landmark of each if present
            console.debug('mediapipe result sample', {
              pose0: results.poseLandmarks?.[0],
              left0: results.leftHandLandmarks?.[0],
              right0: results.rightHandLandmarks?.[0],
              hasDrawUtils: Boolean((window as any).drawConnectors && (window as any).drawLandmarks),
            });
          }
          // If any landmarks exist, clear waiting indicator
          if ((poseCount + leftCount + rightCount) > 0) {
            if (waitingForDetection) {
              setWaitingForDetection(false);
              if (firstDetectionTimeout.current) {
                window.clearTimeout(firstDetectionTimeout.current as number);
                firstDetectionTimeout.current = null;
              }
            }
          }
        } catch (e) {
          console.error('result logging failed', e);
        }
        
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
        // handle high-DPI displays
        const dpr = window.devicePixelRatio || 1;
        const w = video.videoWidth || 640;
        const h = video.videoHeight || 480;
        canvas.width = Math.floor(w * dpr);
        canvas.height = Math.floor(h * dpr);
        canvas.style.width = `${w}px`;
        canvas.style.height = `${h}px`;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, w, h);
        // draw current video frame first
        try {
          ctx.drawImage(video, 0, 0, w, h);
        } catch (e) {
          // ignore draw errors
        }

        // Prefer MediaPipe drawing utils if available, otherwise use local fallbacks
        const win = window as any;
        try {
          if (win.drawConnectors && win.drawLandmarks) {
            if (results.poseLandmarks && win.POSE_CONNECTIONS) {
              win.drawConnectors(ctx, results.poseLandmarks, win.POSE_CONNECTIONS, { color: '#00FF00', lineWidth: 2 });
            }
            if (results.leftHandLandmarks && win.HAND_CONNECTIONS) {
              win.drawConnectors(ctx, results.leftHandLandmarks, win.HAND_CONNECTIONS, { color: '#FF0000', lineWidth: 2 });
              win.drawLandmarks(ctx, results.leftHandLandmarks, { color: '#FF0000', lineWidth: 1 });
            }
            if (results.rightHandLandmarks && win.HAND_CONNECTIONS) {
              win.drawConnectors(ctx, results.rightHandLandmarks, win.HAND_CONNECTIONS, { color: '#0000FF', lineWidth: 2 });
              win.drawLandmarks(ctx, results.rightHandLandmarks, { color: '#0000FF', lineWidth: 1 });
            }
            if (results.faceLandmarks && win.FACEMESH_TESSELATION) {
              win.drawConnectors(ctx, results.faceLandmarks, win.FACEMESH_TESSELATION, { color: '#FFFFFF', lineWidth: 0.5 });
            }
          } else {
            // local draw fallback
            if (results.poseLandmarks) drawConnectionsLocal(ctx, results.poseLandmarks, POSE_CONNECTIONS, '#00FF00');
            if (results.leftHandLandmarks) {
              drawConnectionsLocal(ctx, results.leftHandLandmarks, HAND_CONNECTIONS, '#FF0000');
              drawLandmarksLocal(ctx, results.leftHandLandmarks, '#FF0000');
            }
            if (results.rightHandLandmarks) {
              drawConnectionsLocal(ctx, results.rightHandLandmarks, HAND_CONNECTIONS, '#0000FF');
              drawLandmarksLocal(ctx, results.rightHandLandmarks, '#0000FF');
            }
            if (results.faceLandmarks) drawLandmarksLocal(ctx, results.faceLandmarks, '#FFFFFF');
          }
        } catch (e) {
          // Drawing should not break the pipeline
          console.error('drawing failed', e);
        }

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
      
      let initAttempts = 0;
      const maxInitAttempts = 80; // ~8s (100ms per retry)
      const initCamera = () => {
        initAttempts += 1;
        if (initAttempts > maxInitAttempts) {
          setSignStatus('Video not ready. Please check camera or permissions.');
          logEvent('initCamera: giving up after retries');
          return;
        }

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
              // Start camera and guard against double-start. Some Camera
              // implementations return a Promise and some do not, so handle
              // both cases without using `await` inside this non-async
              // callback.
              try {
                const maybe = cameraRef.current.start && cameraRef.current.start();
                if (maybe && typeof (maybe as Promise<any>).then === 'function') {
                  (maybe as Promise<any>).then(() => {
                    setSignActive(true);
                    setSignStatus('✓ Sign capture active');
                    logEvent('Camera started and sign capture active');
                  }).catch((err: any) => {
                    console.error('camera start failed (async)', err);
                    setSignStatus('Failed to start camera feed');
                    logEvent('Camera start failed');
                  });
                } else {
                  setSignActive(true);
                  setSignStatus('✓ Sign capture active');
                  logEvent('Camera started and sign capture active');
                }
              } catch (e) {
                console.error('camera start failed', e);
                setSignStatus('Failed to start camera feed');
                logEvent('Camera start failed');
              }
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
    // Clear refs and timers
    try {
      if (cameraRef.current && cameraRef.current.stop) cameraRef.current = null;
    } catch {}
    if (firstDetectionTimeout.current) {
      window.clearTimeout(firstDetectionTimeout.current as number);
      firstDetectionTimeout.current = null;
    }
    if (saveTimer.current) {
      clearTimeout(saveTimer.current);
      saveTimer.current = null;
    }
    setWaitingForDetection(false);
    setSignActive(false);
    setSignStatus(null);
  };

  const snapshotCanvas = () => {
    try {
      const canvas = canvasRef.current;
      if (!canvas) return alert('No canvas available');
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `sign_snapshot_${Date.now()}.png`;
        a.click();
        URL.revokeObjectURL(url);
      });
    } catch (e) {
      console.error('snapshot failed', e);
      alert('Snapshot failed');
    }
  };

  const exportDetections = () => {
    try {
      const data = JSON.stringify({ detections, translation, timestamp: new Date().toISOString() }, null, 2);
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sign_detections_${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('export failed', e);
      alert('Export failed');
    }
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
          {/* Transcript functionality removed — replaced by Detections & Snapshot tools below */}
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
            <div className="mt-3">
              <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
                {/* Wrapper uses aspect-ratio trick (16:9) — canvas overlays video */}
                <video
                  ref={videoRef}
                  className={"absolute left-0 top-0 w-full h-full object-cover rounded bg-black"}
                  autoPlay
                  playsInline
                  muted
                  style={{ display: signActive ? 'block' : 'none' }}
                />
                <canvas
                  ref={canvasRef}
                  className={"absolute left-0 top-0 w-full h-full rounded pointer-events-none"}
                  style={{ display: signActive ? 'block' : 'none' }}
                />

                {/* Live translation overlay (visible over the canvas) */}
                <div className="absolute top-3 right-3 z-50 bg-black/70 text-white p-3 rounded max-w-[320px]">
                  <div className="text-sm font-semibold">Live Translation</div>
                  <div className="mt-1 text-lg leading-tight font-bold">{translation || (detections[0] ?? '—')}</div>
                  {autoTranslate && translation && (
                    <div className="mt-1 text-xs text-gray-200">Auto-saved: {new Date().toLocaleTimeString()}</div>
                  )}
                </div>
              </div>
            </div>
            {/* Detections panel + snapshot/export */}
            <div className="mt-3">
              <div className="flex items-center gap-2 mb-2">
                <label className="inline-flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={autoTranslate} onChange={(e) => setAutoTranslate(e.target.checked)} />
                  <span>Auto-Translate</span>
                </label>
                <button onClick={() => { if (!translation) return; navigator.clipboard?.writeText(translation); }} className="px-2 py-1 bg-slate-100 rounded text-sm">Copy</button>
                <button onClick={() => snapshotCanvas()} className="px-2 py-1 bg-slate-100 rounded text-sm">Snapshot</button>
                <button onClick={() => exportDetections()} className="px-2 py-1 bg-slate-100 rounded text-sm">Export Detections</button>
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
                      <div className="text-gray-600 dark:text-gray-400 text-sm">No detections yet</div>
                    ) : (
                      <div className="flex flex-col gap-1">
                        {detections.map((d, i) => (
                          <div key={i} className="text-sm flex items-center justify-between">
                            <span>{d}</span>
                            <span className="text-xs text-slate-500">{new Date().toLocaleTimeString()}</span>
                          </div>
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
      {/* Transcript modal removed — no longer used */}
    </div>
  );
}
