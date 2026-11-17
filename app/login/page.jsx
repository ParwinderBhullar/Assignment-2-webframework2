/* ITE5425 — Mastery Assignment 2: My Art Explorer
 * I declare that this work is my own and conforms to Humber Academic Policy.
 * I have not copied or distributed another student's implementation.
 * I have disclosed all generative-AI assistance in ai-use.md.
 * Name: __________________ Student ID: ______________ Date: __________
 */
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";

export default function LoginPage() {
  const { user, loading, login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await login(email.trim(), password);
      setPassword("");
      router.replace("/favorites");
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <p className="muted">Checking session…</p>;
  if (user) return <section className="panel narrow"><h1>You are signed in</h1><p>Welcome back, {user.displayName}.</p><Link className="button" href="/favorites">Open My Favourites</Link></section>;

  return (
    <section className="auth-layout">
      <div className="panel login-panel narrow">
        <p className="eyebrow">Your personal collection</p>
        <h1>Welcome back</h1>
        <p className="muted">Log in to save favourite artworks and add your own notes.</p>
        <form onSubmit={submit} className="stack-form">
          <label htmlFor="login-email">Email address</label>
          <input id="login-email" className="field" type="email" autoComplete="username" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com" />
          <label htmlFor="login-password">Password</label>
          <input id="login-password" className="field" type="password" autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} required />
          <button className="button full-width" type="submit" disabled={submitting}>
            {submitting ? "Signing in…" : "Log in"}
          </button>
          {error && <p className="error" role="alert">{error}</p>}
        </form>
        <p className="small muted">Demo accounts are created by the provided seed script. Registration is not part of this assignment.</p>
      </div>
      <aside className="auth-aside" aria-label="About personal art collections">
        <span className="eyebrow">Explore · Save · Remember</span>
        <h2>A little gallery of your own</h2>
        <p>Collect works that catch your attention, write down why you love them, and return anytime.</p>
        <Link className="text-link" href="/artwork">Browse public artwork instead</Link>
      </aside>
    </section>
  );
}
