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
import { useFavorites } from "@/components/FavoritesProvider";
import { getArtwork } from "@/lib/metApi";

// A2-17: Each editor owns only its input state. Persistent notes belong to Atlas.
function FavoriteEntry({ favorite }) {
  const { toggle, refresh } = useFavorites();
  const [artwork, setArtwork] = useState(null);
  const [note, setNote] = useState(favorite.note ?? "");
  const [saving, setSaving] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => setNote(favorite.note ?? ""), [favorite.note]);
  useEffect(() => {
    let active = true;
    getArtwork(favorite.artworkId)
      .then(result => { if (active) setArtwork(result); })
      .catch(() => { if (active) setArtwork(null); });
    return () => { active = false; };
  }, [favorite.artworkId]);

  async function saveNote(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const response = await fetch(`/api/favorites/${favorite.artworkId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || "Could not save note");
      await refresh();
      setSuccess("Note saved to your collection.");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    setRemoving(true);
    setError("");
    try {
      await toggle(favorite.artworkId);
    } catch (err) {
      setError(err.message);
      setRemoving(false);
    }
  }

  return (
    <li className="saved-card">
      <div className="saved-cover">
        {artwork?.primaryImageSmall ? (
          <img src={artwork.primaryImageSmall} alt={artwork.title || "Saved artwork"} />
        ) : <div className="noImage">Artwork #{favorite.artworkId}</div>}
      </div>
      <div className="saved-content">
        <span className="eyebrow">Saved artwork · #{favorite.artworkId}</span>
        <h2><Link href={`/artwork/${favorite.artworkId}`}>{artwork?.title || `Artwork #${favorite.artworkId}`}</Link></h2>
        <p className="muted">{artwork?.artistDisplayName || "The Metropolitan Museum of Art"}</p>
        <form onSubmit={saveNote} className="note-form">
          <label htmlFor={`note-${favorite.artworkId}`}>Your personal note</label>
          <textarea
            id={`note-${favorite.artworkId}`}
            className="field note-input"
            rows="3"
            maxLength={250}
            value={note}
            placeholder="What makes this artwork special to you?"
            onChange={e => { setNote(e.target.value); setSuccess(""); }}
          />
          <div className="row note-actions">
            <span className="small muted">{note.length}/250 characters</span>
            <button className="button" type="submit" disabled={saving || note === (favorite.note ?? "")}>
              {saving ? "Saving…" : "Save note"}
            </button>
            <button className="button secondary" type="button" disabled={removing} onClick={remove}>
              {removing ? "Removing…" : "Remove"}
            </button>
          </div>
          {success && <p className="success small" role="status">{success}</p>}
          {error && <p className="error small" role="alert">{error}</p>}
        </form>
      </div>
    </li>
  );
}

export default function FavoritesPage() {
  const { user, loading: authLoading } = useAuth();
  const { favorites, count, loading, error } = useFavorites();

  if (authLoading) return <p className="muted">Checking your session…</p>;
  if (!user) return (
    <section className="panel empty-state">
      <h1>Your gallery starts here</h1>
      <p>Log in to see the artwork you have saved.</p>
      <Link className="button" href="/login">Log in to My Favourites</Link>
    </section>
  );

  return (
    <section>
      <div className="page-heading">
        <div><p className="eyebrow">Collected by you</p><h1>My Favourites</h1><p className="muted">{count} saved artwork{count === 1 ? "" : "s"} in your personal collection.</p></div>
        <Link className="button secondary" href="/artwork">Explore more art</Link>
      </div>
      {loading && <p className="panel muted">Loading your saved artworks…</p>}
      {error && <p className="panel error" role="alert">{error}</p>}
      {!loading && !error && favorites.length === 0 && (
        <div className="panel empty-state"><span className="empty-symbol" aria-hidden="true">♡</span><h2>No artworks saved yet</h2><p>Browse the museum collection and choose something you love.</p><Link className="button" href="/artwork">Browse artworks</Link></div>
      )}
      {!loading && !error && favorites.length > 0 && (
        <ul className="saved-list">{favorites.map(favorite => <FavoriteEntry key={favorite.artworkId} favorite={favorite} />)}</ul>
      )}
    </section>
  );
}
