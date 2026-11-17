/* ITE5425 — Mastery Assignment 2: My Art Explorer
 * I declare that this work is my own and conforms to Humber Academic Policy.
 * I have not copied or distributed another student's implementation.
 * I have disclosed all generative-AI assistance in ai-use.md.
 * Name: __________________ Student ID: ______________ Date: __________
 */
"use client";

import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // A2-10: The browser cannot read the HttpOnly JWT. It asks the server who is signed in.
  async function refreshUser() {
    try {
      const response = await fetch("/api/auth/me", { cache: "no-store" });
      if (response.status === 401) {
        setUser(null);
        return null;
      }
      if (!response.ok) throw new Error("Could not check your session");
      const data = await response.json();
      setUser(data.user);
      return data.user;
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refreshUser().catch(() => setUser(null));
  }, []);

  // Keep the entire site in sync with the theme stored in the user's Atlas record.
  useEffect(() => {
    document.documentElement.dataset.theme = user?.preferences?.theme || "light";
  }, [user?.preferences?.theme]);

  async function login(email, password) {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || "Login failed");

    // A2-10a: update shared state immediately, so the Navbar rerenders.
    setUser(data.user);
    // Fetch the full user record, including the persisted theme preference.
    return (await refreshUser().catch(() => null)) || data.user;
  }

  async function logout() {
    const response = await fetch("/api/auth/logout", { method: "POST" });
    if (!response.ok) throw new Error("Logout failed. Please try again.");
    // A2-10b: all components instantly return to the guest state.
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth requires AuthProvider");
  return context;
}
