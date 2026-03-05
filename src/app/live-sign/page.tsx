"use client";

import React, { useRef, useState, useEffect } from 'react';

// Modern, very functional Live Sign Studio component
export function LiveSignStudio() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const holisticRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);

  const [status, setStatus] = useState('Idle');
  const [loadingPct, setLoadingPct] = useState(0);
  const [running, setRunning] = useState(false);
  const [translation, setTranslation] = useState('');
  const [history, setHistory] = useState<Array<{ text: string; at: number }>>([]);

  // controls
  const [modelComplexity, setModelComplexity] = useState<0 | 1>(0);
  const [refineFace, setRefineFace] = useState(false);
  const [mirror, setMirror] = useState(true);
  const [sensitivity, setSensitivity] = useState(0.08); // detection sensitivity
  const [tts, setTts] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  // classifier state
  const [tfLoaded, setTfLoaded] = useState(false);
  const modelRef = useRef<any>(null);
  const [modelUrl, setModelUrl] = useState('');
  const [modelLabels, setModelLabels] = useState('yes,no,stop,hello');
  const [modelLoading, setModelLoading] = useState(false);
  const [prediction, setPrediction] = useState<{ label: string; confidence: number } | null>(null);
  const [detectionConf, setDetectionConf] = useState<number>(0);

  // small helper for logs
  const [log, setLog] = useState<string[]>([]);
  const logEvent = (s: string) => setLog((p) => [`${new Date().toLocaleTimeString()} ${s}`, ...p].slice(0, 200));

  useEffect(() => {
    // restore history
    try {
      const raw = localStorage.getItem('live_sign_history');
      if (raw) setHistory(JSON.parse(raw));
    } catch {}
    // If on a small screen, default to fastest modelComplexity for performance
    try {
      if (typeof window !== 'undefined' && window.innerWidth && window.innerWidth < 600) {
        setModelComplexity(0);
      }
    } catch {}
    return () => {
      // cleanup
      try {
        if (cameraRef.current && cameraRef.current.stop) cameraRef.current.stop();
        if (holisticRef.current && holisticRef.current.close) holisticRef.current.close();
        if (videoRef.current && videoRef.current.srcObject) {
          const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
          tracks.forEach((t) => t.stop());
          videoRef.current.srcObject = null;
        }
      } catch (e) {
        console.error(e);
      }
    };
  }, []);

  const saveHistoryItem = (text: string) => {
    try {
      const entry = { text, at: Date.now() };
      const next = [entry, ...history].slice(0, 200);
      setHistory(next);
      localStorage.setItem('live_sign_history', JSON.stringify(next));
    } catch {}
  };

  const ensureMediaPipe = async () => {
    const w = window as any;
    if (w.Holistic) return;
    setStatus('Loading MediaPipe');
    const urls = [
      'https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js',
      'https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js',
      'https://cdn.jsdelivr.net/npm/@mediapipe/holistic/holistic.js',
    ];
    let loaded = 0;
    for (const src of urls) {
      await new Promise<void>((resolve, reject) => {
        const s = document.createElement('script');
        s.src = src;
        s.async = true;
        s.onload = () => { loaded += 1; setLoadingPct(Math.round((loaded / urls.length) * 100)); logEvent(`Loaded ${src}`); resolve(); };
        s.onerror = (e) => { logEvent(`Failed to load ${src}`); reject(e); };
        document.head.appendChild(s);
      });
    }
    setStatus('MediaPipe ready');
  };

  const drawFrame = (ctx: CanvasRenderingContext2D, results: any) => {
    const dpr = window.devicePixelRatio || 1;
    const video = videoRef.current;
    if (!video) return;
    const w = video.videoWidth || 640;
    const h = video.videoHeight || 480;
    canvasRef.current!.width = Math.floor(w * dpr);
    canvasRef.current!.height = Math.floor(h * dpr);
    canvasRef.current!.style.width = `${w}px`;
    canvasRef.current!.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    try { ctx.drawImage(video, 0, 0, w, h); } catch {}

    const fx = (p: any) => (mirror ? (1 - (p.x ?? 0)) * w : (p.x ?? 0) * w);
    const fy = (p: any) => (p.y ?? 0) * h;

    const drawPoint = (p: any, color = '#ff6b6b') => {
      ctx.fillStyle = color; ctx.beginPath(); ctx.arc(fx(p), fy(p), 4, 0, Math.PI * 2); ctx.fill();
    };
    const drawLine = (a: any, b: any, color = '#38bdf8') => {
      ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(fx(a), fy(a)); ctx.lineTo(fx(b), fy(b)); ctx.stroke();
    };

    // sample connections
    const HAND_CONN: [number, number][] = [[0,1],[1,2],[2,3],[3,4],[0,5],[5,6],[6,7],[7,8],[9,10],[10,11],[11,12],[13,14],[14,15],[15,16]];
    const POSE_CONN: [number, number][] = [[11,13],[13,15],[12,14],[14,16],[11,12]];

    try {
      const r = results;
      const win = window as any;
      // Use MediaPipe drawing utils when available for richer visuals
      if (win.drawConnectors && win.drawLandmarks) {
        try {
          if (r.poseLandmarks && win.POSE_CONNECTIONS) win.drawConnectors(ctx, r.poseLandmarks, win.POSE_CONNECTIONS, { color: '#22c55e', lineWidth: 2 });
          if (r.leftHandLandmarks && win.HAND_CONNECTIONS) { win.drawConnectors(ctx, r.leftHandLandmarks, win.HAND_CONNECTIONS, { color: '#fb7185', lineWidth: 2 }); win.drawLandmarks(ctx, r.leftHandLandmarks, { color: '#fb7185', lineWidth: 1 }); }
          if (r.rightHandLandmarks && win.HAND_CONNECTIONS) { win.drawConnectors(ctx, r.rightHandLandmarks, win.HAND_CONNECTIONS, { color: '#60a5fa', lineWidth: 2 }); win.drawLandmarks(ctx, r.rightHandLandmarks, { color: '#60a5fa', lineWidth: 1 }); }
          if (r.faceLandmarks && win.FACEMESH_TESSELATION) win.drawConnectors(ctx, r.faceLandmarks, win.FACEMESH_TESSELATION, { color: '#ffffff', lineWidth: 0.5 });
        } catch (e) {
          // fallback to local draw on any drawing util error
          for (const [a,b] of POSE_CONN) { const A = r.poseLandmarks?.[a]; const B = r.poseLandmarks?.[b]; if (A && B) drawLine(A, B, '#22c55e'); }
          if (r.leftHandLandmarks) { for (const [a,b] of HAND_CONN) { const A = r.leftHandLandmarks[a]; const B = r.leftHandLandmarks[b]; if (A && B) drawLine(A, B, '#fb7185'); } r.leftHandLandmarks.forEach((p: any) => drawPoint(p, '#fb7185')); }
          if (r.rightHandLandmarks) { for (const [a,b] of HAND_CONN) { const A = r.rightHandLandmarks[a]; const B = r.rightHandLandmarks[b]; if (A && B) drawLine(A, B, '#60a5fa'); } r.rightHandLandmarks.forEach((p: any) => drawPoint(p, '#60a5fa')); }
          if (r.faceLandmarks) r.faceLandmarks.slice(0, 10).forEach((p: any) => drawPoint(p, '#f8fafc'));
        }
      } else {
        // Local drawing fallback
        for (const [a,b] of POSE_CONN) { const A = r.poseLandmarks?.[a]; const B = r.poseLandmarks?.[b]; if (A && B) drawLine(A, B, '#22c55e'); }
        if (r.leftHandLandmarks) { for (const [a,b] of HAND_CONN) { const A = r.leftHandLandmarks[a]; const B = r.leftHandLandmarks[b]; if (A && B) drawLine(A, B, '#fb7185'); } r.leftHandLandmarks.forEach((p: any) => drawPoint(p, '#fb7185')); }
        if (r.rightHandLandmarks) { for (const [a,b] of HAND_CONN) { const A = r.rightHandLandmarks[a]; const B = r.rightHandLandmarks[b]; if (A && B) drawLine(A, B, '#60a5fa'); } r.rightHandLandmarks.forEach((p: any) => drawPoint(p, '#60a5fa')); }
        if (r.faceLandmarks) r.faceLandmarks.slice(0, 10).forEach((p: any) => drawPoint(p, '#f8fafc'));
      }
    } catch (e) { console.error('draw error', e); }
  };

  const onResults = (results: any) => {
    try {
      const canvas = canvasRef.current; const video = videoRef.current;
      if (!canvas || !video) return;
      const ctx = canvas.getContext('2d'); if (!ctx) return;
      drawFrame(ctx, results);

      // detection heuristics
      const hand = results.rightHandLandmarks || results.leftHandLandmarks;
      if (!hand || !hand.length) return;
      const wrist = hand[0];
      let avg = 0; let c = 0;
      for (const i of [4,8,12,16,20]) { const p = hand[i]; if (p) { avg += Math.hypot((p.x - wrist.x), (p.y - wrist.y)); c++; } }
      if (c) avg = avg / c;
      // compute a normalized confidence (0..1) from avg distance
      const conf = Math.max(0, Math.min(1, (avg - 0.02) / 0.3));
      if (avg < sensitivity) {
        // closed/fist
        const t = 'stop';
        setTranslation(t); saveHistoryItem(t); logEvent(`Detected ${t} (conf=${conf.toFixed(2)})`);
        if (tts) speakText(t);
      } else if (avg > sensitivity * 1.6) {
        const t = 'open hand';
        setTranslation(t); saveHistoryItem(t); logEvent(`Detected ${t} (conf=${conf.toFixed(2)})`);
        if (tts) speakText(t);
      }
      // update detection confidence state for UI
      setDetectionConf(conf);

      // classifier prediction if model loaded
      (async () => {
        try {
          if (modelRef.current && modelRef.current.predict) {
            const arr: number[] = [];
            const source = results.rightHandLandmarks || results.leftHandLandmarks || results.poseLandmarks || [];
            for (let i = 0; i < Math.max(21, source.length); i++) {
              const p = source[i] || { x: 0, y: 0, z: 0 };
              arr.push(p.x || 0, p.y || 0, p.z || 0);
            }
            const tf = (window as any).tf;
            if (tf && modelRef.current) {
              const input = tf.tensor([arr]);
              const out = modelRef.current.predict(input) as any;
              const data = out.data ? await out.data() : await out.array();
              input.dispose(); if (out.dispose) out.dispose();
              const labels = modelLabels.split(',').map(s => s.trim()).filter(Boolean);
              if (data && labels.length && data.length === labels.length) {
                let maxI = 0; let maxV = data[0];
                for (let i = 1; i < data.length; i++) { if (data[i] > maxV) { maxV = data[i]; maxI = i; } }
                setPrediction({ label: labels[maxI] || 'unknown', confidence: Number(maxV) });
              }
            }
          }
        } catch (e) { console.error('model predict failed', e); }
      })();
    } catch (e) { console.error(e); }
  };

  const speakText = (t: string) => {
    try {
      if (!('speechSynthesis' in window)) return;
      const u = new SpeechSynthesisUtterance(t);
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
    } catch {}
  };

  const start = async () => {
    try {
      await ensureMediaPipe();
      setStatus('Starting camera');
      // Use facingMode for mobile (user/front or environment/back).
      const constraints: MediaStreamConstraints = { video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: facingMode }, audio: false };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (videoRef.current) videoRef.current.srcObject = stream;

      const w = window as any;
      const Holistic = w.Holistic;
      const Camera = w.Camera;
      if (!Holistic) { setStatus('Holistic missing'); logEvent('Holistic missing'); return; }

      holisticRef.current = new Holistic({ locateFile: (f: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${f}` });
      holisticRef.current.setOptions({ modelComplexity, smoothLandmarks: true, refineFaceLandmarks: refineFace, minDetectionConfidence: 0.5, minTrackingConfidence: 0.5 });
      holisticRef.current.onResults(onResults);

      if (Camera) {
        cameraRef.current = new Camera(videoRef.current!, { onFrame: async () => { await holisticRef.current.send({ image: videoRef.current }); }, width: 640, height: 480 });
        cameraRef.current.start();
      } else {
        const loop = async () => { if (!running) return; try { await holisticRef.current.send({ image: videoRef.current }); } catch {} ; requestAnimationFrame(loop); };
        cameraRef.current = { stop: () => {} };
        requestAnimationFrame(loop);
      }

      setRunning(true); setStatus('Active'); logEvent('Started');
    } catch (e: any) { console.error(e); setStatus('Failed'); logEvent('Start failed'); }
  };

  const stop = () => {
    try {
      if (cameraRef.current && cameraRef.current.stop) cameraRef.current.stop();
      if (holisticRef.current && holisticRef.current.close) holisticRef.current.close();
      if (videoRef.current && videoRef.current.srcObject) { const tracks = (videoRef.current.srcObject as MediaStream).getTracks(); tracks.forEach(t => t.stop()); videoRef.current.srcObject = null; }
    } catch (e) { console.error(e); }
    setRunning(false); setStatus('Stopped'); logEvent('Stopped');
  };

  const clearHistory = () => { setHistory([]); localStorage.removeItem('live_sign_history'); };
  const exportHistory = () => { const data = JSON.stringify(history, null, 2); const blob = new Blob([data], { type: 'application/json' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'live_sign_history.json'; a.click(); URL.revokeObjectURL(url); };

  // load TF and model (optional). Model must be a tfjs layers model and labels
  // should be provided as comma-separated values matching model output.
  const loadModel = async () => {
    try {
      setModelLoading(true);
      const win = window as any;
      if (!win.tf) {
        await new Promise<void>((resolve, reject) => {
          const s = document.createElement('script');
          s.src = 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.8.0/dist/tf.min.js';
          s.async = true;
          s.onload = () => { setTfLoaded(true); logEvent('Loaded tfjs'); resolve(); };
          s.onerror = (e) => { logEvent('Failed to load tfjs'); reject(e); };
          document.head.appendChild(s);
        });
      } else {
        setTfLoaded(true);
      }

      if (modelUrl) {
        const tf = (window as any).tf;
        modelRef.current = await tf.loadLayersModel(modelUrl);
        logEvent('Model loaded');
      }
    } catch (e) {
      console.error('model load failed', e); logEvent('model load failed');
    } finally {
      setModelLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 bg-white dark:bg-slate-900 rounded-lg shadow-lg p-4">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold">Live Sign Studio</h1>
              <p className="text-sm text-slate-500">Modern, fast sign-capture with translation, TTS, and history.</p>
            </div>
            <div className="flex gap-2">
              <button onClick={start} disabled={running} className="px-3 py-2 bg-emerald-600 text-white rounded shadow hover:scale-105">Start</button>
              <button onClick={stop} disabled={!running} className="px-3 py-2 bg-red-600 text-white rounded shadow hover:scale-105">Stop</button>
            </div>
          </div>

          <div className="mt-4 grid md:grid-cols-2 gap-4">
            <div className="relative bg-black/5 rounded overflow-hidden">
              <div className={"absolute inset-0 flex items-center justify-center " + (running ? 'pointer-events-none' : '')}>
                {!running && <div className="text-white/80 bg-black/60 px-4 py-2 rounded">Not active</div>}
              </div>
              <video ref={videoRef} autoPlay playsInline muted className={mirror ? 'transform scale-x-[-1] w-full' : 'w-full'} style={{ display: running ? 'block' : 'none' }} />
              <canvas ref={canvasRef} className={mirror ? 'absolute left-0 top-0 w-full transform scale-x-[-1]' : 'absolute left-0 top-0 w-full'} style={{ display: running ? 'block' : 'none' }} />
              <div className="absolute bottom-3 left-3 bg-black/70 text-white px-3 py-2 rounded max-w-[320px]">
                <div className="text-sm font-semibold">{translation || '—'}</div>
                <div className="mt-2 text-xs text-gray-200">Detection Confidence</div>
                <div className="mt-1 h-2 bg-gray-200 rounded overflow-hidden">
                  <div className="h-2 bg-red-500" style={{ width: `${Math.round(detectionConf * 100)}%` }} />
                </div>
                {prediction && (
                  <div className="mt-2 text-xs text-emerald-200">Model: {prediction.label} ({Math.round(prediction.confidence * 100)}%)</div>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <label className="flex items-center gap-2 p-2 bg-slate-50 rounded">
                  <input type="checkbox" checked={mirror} onChange={(e) => setMirror(e.target.checked)} /> Mirror
                </label>
                <label className="flex items-center gap-2 p-2 bg-slate-50 rounded">
                  <input type="checkbox" checked={tts} onChange={(e) => setTts(e.target.checked)} /> Speak
                </label>
                <label className="flex items-center gap-2 p-2 bg-slate-50 rounded">
                  <input type="checkbox" checked={refineFace} onChange={(e) => setRefineFace(e.target.checked)} /> Refine Face
                </label>
                <label className="flex items-center gap-2 p-2 bg-slate-50 rounded">
                  <select value={modelComplexity} onChange={(e) => setModelComplexity(Number(e.target.value) as 0 | 1)} className="bg-transparent">
                    <option value={0}>Fast</option>
                    <option value={1}>Accurate</option>
                  </select>
                </label>
              </div>

              <div>
                <div className="text-xs text-slate-500">Sensitivity</div>
                <input type="range" min={0.03} max={0.18} step={0.01} value={sensitivity} onChange={(e) => setSensitivity(Number(e.target.value))} className="w-full" />
              </div>

              <div className="flex gap-2">
                <button onClick={() => { setTranslation(''); logEvent('Cleared translation'); }} className="px-3 py-2 bg-slate-200 rounded">Clear</button>
                <button onClick={() => { navigator.clipboard?.writeText(translation); logEvent('Copied translation'); }} className="px-3 py-2 bg-blue-600 text-white rounded">Copy</button>
                <button onClick={() => { saveHistoryItem(translation); logEvent('Saved to history'); }} className="px-3 py-2 bg-amber-500 rounded">Save</button>
              </div>

              <div className="pt-2 border-t">
                <div className="text-xs text-slate-500">Status: {status} {loadingPct > 0 && loadingPct < 100 ? `(${loadingPct}%)` : ''}</div>
                <div className="text-xs text-slate-500">Events: {log.length}</div>
              </div>
              <div className="mt-3 border-t pt-3">
                <div className="text-sm font-medium">Classifier (optional)</div>
                <div className="text-xs text-slate-500">Model URL (tfjs layers model)</div>
                <input value={modelUrl} onChange={(e) => setModelUrl(e.target.value)} placeholder="https://.../model.json" className="w-full p-2 mt-1 rounded border" />
                <div className="text-xs text-slate-500 mt-2">Labels (comma-separated)</div>
                <input value={modelLabels} onChange={(e) => setModelLabels(e.target.value)} placeholder="yes,no,stop" className="w-full p-2 mt-1 rounded border" />
                <div className="flex gap-2 mt-2">
                  <button onClick={loadModel} disabled={modelLoading} className="px-3 py-2 bg-indigo-600 text-white rounded">{modelLoading ? 'Loading...' : 'Load Model'}</button>
                  <div className="flex-1 text-xs text-slate-500 self-center">{prediction ? `${prediction.label} (${(prediction.confidence*100).toFixed(0)}%)` : 'No prediction'}</div>
                </div>
                {prediction && (
                  <div className="mt-2 h-2 bg-gray-200 rounded overflow-hidden">
                    <div className="h-2 bg-emerald-500" style={{ width: `${Math.round(prediction.confidence * 100)}%` }} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <aside className="w-full md:w-96">
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Translation History</h3>
              <div className="flex gap-2">
                <button onClick={exportHistory} className="text-sm px-2 py-1 bg-slate-200 rounded">Export</button>
                <button onClick={clearHistory} className="text-sm px-2 py-1 bg-red-500 text-white rounded">Clear</button>
              </div>
            </div>
            <div className="max-h-[420px] overflow-auto">
              {history.length === 0 ? <div className="text-sm text-slate-400">No history yet</div> : history.map((h, i) => (
                <div key={i} className="flex items-center justify-between gap-2 py-2 border-b last:border-b-0">
                  <div>
                    <div className="font-medium">{h.text}</div>
                    <div className="text-xs text-slate-500">{new Date(h.at).toLocaleString()}</div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { navigator.clipboard?.writeText(h.text); logEvent('Copied history item'); }} className="text-sm px-2 py-1 bg-slate-100 rounded">Copy</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-2">
              <div className="text-sm font-medium">Capture Log</div>
              <div className="text-xs max-h-36 overflow-auto mt-2 bg-gray-50 p-2 rounded">{log.length === 0 ? <div className="text-slate-400">No events</div> : log.map((l, i) => <div key={i} className="text-xs">{l}</div>)}</div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

import Navigation from '@/components/Layout/Navigation';
import Footer from '@/components/Layout/Footer';
import MediaControlPanel from '@/components/UI/MediaControlPanel';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';

export default function LiveSignPage() {
  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.loading);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  if (loading || !isAuthenticated || !user) {
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
          <h1 className="text-4xl font-bold mb-2 text-gray-900 dark:text-white">Live Sign Demo</h1>
          <p className="mb-8 text-gray-600 dark:text-gray-400">
            Use your camera to try the sign-language landmark demo. Enable Auto-Translate to save heuristic translations of your gestures. Perfect for testing gesture-based shortcuts and sign language recognition.
          </p>

          <div className="grid grid-cols-1 gap-6">
            <MediaControlPanel name="Live Camera" />
          </div>

          <div className="mt-12 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-4">How It Works</h2>
            <ul className="space-y-3 text-blue-800 dark:text-blue-200">
              <li>• <strong>Start Sign Capture:</strong> Click to access your camera and begin capturing hand landmarks in real-time.</li>
              <li>• <strong>View Landmarks:</strong> The canvas shows your hand pose with colored markers (red for left hand, blue for right hand, green for body pose).</li>
              <li>• <strong>Heuristic Translation:</strong> The demo recognizes basic gestures like fist, pointing, thumbs up, and swipes.</li>
              <li>• <strong>Auto-Translate:</strong> Enable this option to automatically save recognized gestures to your account for later review.</li>
              <li>• <strong>Save & Copy:</strong> Manually save or copy the current translation to your clipboard.</li>
            </ul>
          </div>

          <div className="mt-8 p-6 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
            <h2 className="text-xl font-semibold text-amber-900 dark:text-amber-100 mb-4">Camera & Permissions</h2>
            <p className="text-amber-800 dark:text-amber-200 mb-3">
              To use the live sign demo, your browser needs access to your camera. When you click "Start Sign Capture", your browser will ask for permission.
            </p>
            <p className="text-amber-800 dark:text-amber-200">
              If you see an error like "Requested device not found", it means:
            </p>
            <ul className="space-y-2 text-amber-800 dark:text-amber-200 mt-3">
              <li>• <strong>No camera detected:</strong> Ensure your webcam is connected and not in use by another app.</li>
              <li>• <strong>Permission denied:</strong> Check your browser settings and allow camera access for this site.</li>
              <li>• <strong>Camera in use:</strong> Close other apps (like Zoom, Teams, or Discord) that may be using your camera.</li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
