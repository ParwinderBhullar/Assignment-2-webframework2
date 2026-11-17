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
import { useFavorites } from "@/components/FavoritesProvider";

export default function AccountNav() {
  const { user, loading, logout } = useAuth();
  const { count, loading: favoritesLoading } = useFavorites();
  const [error, setError] = useState("");
  const [signingOut, setSigningOut] = useState(false);
  const router = useRouter();

  async function signOut() {
    setSigningOut(true);
    setError("");
    try {
      await logout();
      router.replace("/");
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <header className="site-header">
      <nav className="nav" aria-label="Main navigation">
        <Link className="brand" href="/" aria-label="Art Explorer Home">
          <span className="brand-icon" aria-hidden="true">✦</span>
          My Art Explorer
        </Link>
        <div className="navlinks">
          <Link href="/artwork">Browse</Link>
          <Link href="/search">Advanced Search</Link>
          <Link href="/about">About</Link>
          {user && (
            <>
              <Link href="/favorites">My Favourites <span className="count-badge" aria-label={`${count} favourites`}>{favoritesLoading ? "…" : count}</span></Link>
              <Link href="/profile">Profile</Link>
              {/* A2-11: Show this link only for administrators; API also checks role. */}
              {user.role === "admin" && <Link href="/admin">Admin</Link>}
            </>
          )}
        </div>
        <div className="nav-account">
          {loading ? <span className="muted small">Checking session…</span> : user ? (
            <>
              <span className="hello">Hello, {user.displayName}</span>
              <button type="button" className="button secondary small-button" onClick={signOut} disabled={signingOut}>
                {signingOut ? "Logging out…" : "Logout"}
              </button>
            </>
          ) : <Link className="button small-button" href="/login">Log in</Link>}
        </div>
      </nav>
      {error && <p className="nav-error error" role="alert">{error}</p>}
    </header>
  );
}
