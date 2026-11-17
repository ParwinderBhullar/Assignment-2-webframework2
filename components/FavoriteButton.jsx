/* ITE5425 — Mastery Assignment 2: My Art Explorer
 * I declare that this work is my own and conforms to Humber Academic Policy.
 * I have not copied or distributed another student's implementation.
 * I have disclosed all generative-AI assistance in ai-use.md.
 * Name: __________________ Student ID: ______________ Date: __________
 */
"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useFavorites } from "@/components/FavoritesProvider";

export default function FavoriteButton({ artworkId }) {
  const { user } = useAuth();
  const { favorites, toggle } = useFavorites();
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const saved = favorites.some(f => f.artworkId === artworkId);

  async function click() {
    setError("");
    setSaving(true);
    try {
      await toggle(artworkId);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <span className="favorite-control">
      <button
        className={`favorite-button ${saved ? "is-saved" : ""}`}
        type="button"
        onClick={click}
        disabled={!user || saving}
        aria-pressed={saved}
        aria-label={saved ? "Remove artwork from favourites" : "Add artwork to favourites"}
      >
        <span aria-hidden="true">{saved ? "♥" : "♡"}</span> {saving ? "Saving…" : saved ? "Saved" : "Save artwork"}
      </button>
      {!user && <span className="small muted"> <Link href="/login">Log in</Link> to save</span>}
      {error && <span className="small error" role="alert">{error}</span>}
    </span>
  );
}
