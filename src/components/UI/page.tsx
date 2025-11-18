'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const redirect = searchParams.get('redirect') || '/admin';

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch('/api/auth/admin-login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) {
      router.push(redirect);
    } else {
      alert('Admin login failed');
    }
  }

  return (
    <form
      onSubmit={submit}
      style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 360 }}
    >
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin email" />
      <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password" type="password" />
      <button>Admin Login</button>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}