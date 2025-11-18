"use client";

import React, { useEffect, useState } from 'react';

type Props = {
  url?: string;
  name?: string;
  type?: string;
};

export default function FileViewer({ url, name, type }: Props) {
  const [text, setText] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    if (!url) return;
    // If text-like file, fetch contents
    if (type && (type.startsWith('text/') || (name && name.endsWith('.md')))) {
      fetch(url).then((r) => r.text()).then((t) => { if (mounted) setText(t); }).catch(() => {});
    }
    return () => { mounted = false; };
  }, [url, type, name]);

  if (!url) return <div className="p-4">No file URL available.</div>;

  if (type?.startsWith('video/')) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <video controls src={url} className="w-full rounded" />
      </div>
    );
  }

  if (type?.startsWith('audio/')) {
    return (
      <div className="w-full p-4">
        <audio controls src={url} className="w-full" />
      </div>
    );
  }

  if (name?.toLowerCase().endsWith('.pdf') || (type && type.includes('pdf'))) {
    return (
      <div className="w-full h-full">
        <iframe src={url} className="w-full h-[80vh] rounded" />
      </div>
    );
  }

  if (type?.startsWith('image/')) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <img src={url} alt={name} className="max-w-full max-h-[80vh] rounded" />
      </div>
    );
  }

  if (text !== null) {
    return (
      <div className="p-4 overflow-auto max-h-[80vh] bg-white dark:bg-slate-900 rounded">
        <pre className="whitespace-pre-wrap text-sm">{text}</pre>
      </div>
    );
  }

  return (
    <div className="p-4">
      <p className="mb-2">Preview not available for this file type.</p>
      <a href={url} target="_blank" rel="noreferrer" className="px-3 py-1 bg-indigo-600 text-white rounded">Download / Open</a>
    </div>
  );
}
