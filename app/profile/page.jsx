/* ITE5425 — Mastery Assignment 2: My Art Explorer
 * I declare that this work is my own and conforms to Humber Academic Policy.
 * I have not copied or distributed another student's implementation.
 * I have disclosed all generative-AI assistance in ai-use.md.
 * Name: __________________ Student ID: ______________ Date: __________
 */
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";

export default function ProfilePage() {
  const { user, loading, refreshUser } = useAuth();
  const [theme, setTheme] = useState("light");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => setTheme(user?.preferences?.theme || "light"), [user?.preferences?.theme]);

  async function save(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const response = await fetch("/api/preferences", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || "Could not save preference");
      // A2-19: Refresh AuthContext from Atlas; its theme effect updates the full site.
      await refreshUser();
      setSuccess("Theme saved. This preference will be restored after refresh and login.");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="muted">Checking your session…</p>;
  if (!user) return <section className="panel narrow"><h1>Profile</h1><p>Log in to manage your preferences.</p><Link className="button" href="/login">Log in</Link></section>;

  const savedTheme = user.preferences?.theme || "light";
  return (
    <section className="profile-grid">
      <div className="panel">
        <p className="eyebrow">Your account</p>
        <h1>Profile & preferences</h1>
        <div className="profile-avatar" aria-hidden="true">{user.displayName?.charAt(0).toUpperCase() || "A"}</div>
        <h2>{user.displayName}</h2>
        <p className="muted">{user.email}</p>
        <p><span className="status-chip">{user.role === "admin" ? "Administrator" : "Art collector"}</span></p>
        <p className="muted small">Your account and theme are stored in MongoDB Atlas. Your login session is held in a secure HttpOnly cookie.</p>
      </div>
      <div className="panel">
        <p className="eyebrow">Make it yours</p>
        <h2>Display preference</h2>
        <p>Choose a theme to use across the website.</p>
        <form onSubmit={save}>
          <fieldset className="theme-choices">
            <legend>Choose a theme</legend>
            <label className={`theme-choice ${theme === "light" ? "chosen" : ""}`}>
              <input type="radio" name="theme" value="light" checked={theme === "light"} onChange={() => { setTheme("light"); setSuccess(""); }} />
              <span className="theme-swatch theme-light" aria-hidden="true">☀</span> Light
            </label>
            <label className={`theme-choice ${theme === "dark" ? "chosen" : ""}`}>
              <input type="radio" name="theme" value="dark" checked={theme === "dark"} onChange={() => { setTheme("dark"); setSuccess(""); }} />
              <span className="theme-swatch theme-dark" aria-hidden="true">☾</span> Dark
            </label>
          </fieldset>
          <p className="muted small">Current saved preference: <strong>{savedTheme}</strong></p>
          <button type="submit" className="button" disabled={saving || theme === savedTheme}>
            {saving ? "Saving…" : "Save preference"}
          </button>
          {success && <p className="success" role="status">{success}</p>}
          {error && <p className="error" role="alert">{error}</p>}
        </form>
      </div>
    </section>
  );
}
