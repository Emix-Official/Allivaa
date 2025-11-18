"use client";

import React, { useEffect, useRef } from 'react';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  transcript?: string | null;
  filename?: string;
};

export default function TranscriptModal({ isOpen, onClose, title = 'Transcript', transcript, filename }: Props) {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const prevActive = document.activeElement as HTMLElement | null;
    const dialog = dialogRef.current;
    dialog?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'c' && (e.ctrlKey || e.metaKey)) {
        // copy
        if (transcript) navigator.clipboard?.writeText(transcript).catch(() => {});
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      try { prevActive?.focus(); } catch {};
    };
  }, [isOpen, onClose, transcript]);

  if (!isOpen) return null;

  const download = (asVtt = false) => {
    const text = transcript || '';
    const blob = new Blob([asVtt ? `WEBVTT\n\n${text}` : text], { type: asVtt ? 'text/vtt' : 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || `transcript${asVtt ? '.vtt' : '.txt'}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const copy = async () => {
    if (!transcript) return;
    try { await navigator.clipboard.writeText(transcript); alert('Copied to clipboard'); } catch { alert('Copy failed'); }
  };

  return (
    <div ref={overlayRef} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" role="dialog" aria-modal="true" aria-label={title} onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}>
      <div ref={dialogRef} tabIndex={-1} className="w-full max-w-3xl mx-4 bg-white dark:bg-slate-900 rounded shadow-lg overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="p-4 border-b dark:border-slate-700 flex items-center justify-between">
          <h3 className="text-lg font-semibold">{title}</h3>
          <div className="flex items-center gap-2">
            <button onClick={() => download(false)} className="px-3 py-1 rounded bg-gray-100">Download TXT</button>
            <button onClick={() => download(true)} className="px-3 py-1 rounded bg-gray-100">Download VTT</button>
            <button onClick={copy} className="px-3 py-1 rounded bg-gray-100">Copy</button>
            <button onClick={onClose} aria-label="Close transcript" className="px-3 py-1 rounded bg-red-600 text-white">Close</button>
          </div>
        </div>
        <div className="p-4 max-h-[60vh] overflow-auto text-sm whitespace-pre-wrap">
          {transcript ? transcript : <div className="opacity-70">No transcript available.</div>}
        </div>
      </div>
    </div>
  );
}
