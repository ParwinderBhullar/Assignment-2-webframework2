/* ITE5425 — Mastery Assignment 2: My Art Explorer
 * I declare that this work is my own and conforms to Humber Academic Policy.
 * I have not copied or distributed another student's implementation.
 * I have disclosed all generative-AI assistance in ai-use.md.
 * Name: __________________ Student ID: ______________ Date: __________
 */
"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const { user, loading: authLoading } = useAuth();
  const [list, setList] = useState({ ownerId: null, items: [], loading: false, error: "" });

  const refresh = useCallback(async () => {
    if (!user) {
      setList({ ownerId: null, items: [], loading: false, error: "" });
      return [];
    }
    const response = await fetch("/api/favorites", { cache: "no-store" });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || "Could not load favourites");
    const items = Array.isArray(data.favorites) ? data.favorites : [];
    setList({ ownerId: user.id, items, loading: false, error: "" });
    return items;
  }, [user?.id]);

  useEffect(() => {
    if (authLoading) return;
    let active = true;
    if (!user) {
      setList({ ownerId: null, items: [], loading: false, error: "" });
      return;
    }
    // Clear the previous account's data BEFORE displaying the next account's items.
    setList({ ownerId: user.id, items: [], loading: true, error: "" });
    fetch("/api/favorites", { cache: "no-store" })
      .then(async response => {
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.message || "Could not load favourites");
        return data.favorites;
      })
      .then(items => {
        if (active) setList({ ownerId: user.id, items: Array.isArray(items) ? items : [], loading: false, error: "" });
      })
      .catch(error => {
        if (active) setList({ ownerId: user.id, items: [], loading: false, error: error.message });
      });
    return () => { active = false; };
  }, [user?.id, authLoading]);

  const favorites = user && list.ownerId === user.id ? list.items : [];

  async function toggle(artworkId) {
    if (!user) throw new Error("Please log in to save artwork");
    if (!Number.isInteger(artworkId) || artworkId <= 0) throw new Error("Invalid artwork ID");
    const exists = favorites.some(item => item.artworkId === artworkId);
    const response = await fetch(exists ? `/api/favorites/${artworkId}` : "/api/favorites", {
      method: exists ? "DELETE" : "POST",
      headers: { "Content-Type": "application/json" },
      ...(exists ? {} : { body: JSON.stringify({ artworkId }) }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || "Could not update favourite");
    // A2-15: Atlas is the source of truth. Re-fetch after the mutation.
    await refresh();
  }

  return (
    <FavoritesContext.Provider value={{
      favorites,
      count: favorites.length,
      loading: authLoading || (Boolean(user) && list.loading),
      error: list.ownerId === user?.id ? list.error : "",
      toggle,
      refresh,
    }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error("useFavorites requires FavoritesProvider");
  return context;
}
