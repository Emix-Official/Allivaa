"use client";

export const dynamic = 'force-static';

import React, { useEffect, useRef, useState } from 'react';
import Navigation from '@/components/Layout/Navigation';
import Footer from '@/components/Layout/Footer';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { doc, collection, setDoc, getDoc, onSnapshot, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Basic WebRTC room using Firestore for signaling (simple demo implementation).

export default function VideoRoomPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const profile = useAuthStore((s) => s.profile);
  const localRef = useRef<HTMLVideoElement | null>(null);
  const remoteRef = useRef<HTMLVideoElement | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const [started, setStarted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!profile) router.push('/professor/login');
  }, [profile, router]);

  const start = async () => {
    if (started) return;
    setStarted(true);
    const pc = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });
    pcRef.current = pc;

    pc.ontrack = (e) => {
      if (remoteRef.current) remoteRef.current.srcObject = e.streams[0];
    };

    // get local media
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    if (localRef.current) localRef.current.srcObject = stream;
    stream.getTracks().forEach((t) => pc.addTrack(t, stream));

    if (!profile) {
      console.warn('No profile available for video room start');
      return;
    }
    const roomDoc = doc(collection(db, 'videoRooms'), id);
    await setDoc(roomDoc, { owner: profile.uid, createdAt: new Date() }, { merge: true });

    // create offer
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    await setDoc(doc(db, 'videoRooms', id, 'signaling', 'offer'), { sdp: offer.sdp, type: offer.type });

    // listen for answer
    const answerUnsub = onSnapshot(doc(db, 'videoRooms', id, 'signaling', 'answer'), async (snap) => {
      if (!snap.exists()) return;
      const data = snap.data() as any;
      if (!pc.currentRemoteDescription && data.sdp) {
        const desc = { type: data.type, sdp: data.sdp } as any;
        await pc.setRemoteDescription(desc);
      }
    });

    // ICE candidates
    pc.onicecandidate = async (event) => {
      if (!event.candidate) return;
      await addDoc(collection(db, 'videoRooms', id, 'candidates'), { candidate: event.candidate.toJSON(), from: profile?.uid });
    };

    // listen for remote candidates
    const candidatesUnsub = onSnapshot(collection(db, 'videoRooms', id, 'candidates'), (snap) => {
      snap.docChanges().forEach((change) => {
        const data = change.doc.data() as any;
        if (data.from && data.from !== profile.uid && data.candidate) {
          pc.addIceCandidate(new RTCIceCandidate(data.candidate)).catch(console.error);
        }
      });
    });

    // cleanup on unload
    window.addEventListener('beforeunload', () => {
      pc.close();
      answerUnsub();
      candidatesUnsub();
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900">
      <Navigation />
      <main className="flex-grow max-w-6xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Video Room: {id}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <video ref={localRef} autoPlay playsInline muted className="w-full bg-black rounded" />
          <video ref={remoteRef} autoPlay playsInline className="w-full bg-black rounded" />
        </div>

        <div className="mt-4 flex gap-3">
          <button onClick={start} className="px-4 py-2 bg-emerald-600 text-white rounded">Start Room</button>
          <button onClick={() => navigator.clipboard.writeText(window.location.href)} className="px-4 py-2 border rounded">Copy Room Link</button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
