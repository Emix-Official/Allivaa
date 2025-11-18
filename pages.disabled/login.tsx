import { useState } from "react";
import { useRouter } from "next/router";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const redirect = (router.query.redirect as string) || "/courses";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) router.push(redirect);
    else alert("Login failed");
  }

  return (
    <form onSubmit={submit} style={{display:'flex',flexDirection:'column',gap:8,maxWidth:360}}>
      <input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="email" />
      <input value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="password" type="password" />
      <button>Login</button>
    </form>
  );
}
