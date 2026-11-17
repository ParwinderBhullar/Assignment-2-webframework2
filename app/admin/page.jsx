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

export default function AdminPage() {
  const { user, loading } = useAuth();
  const [users, setUsers] = useState([]);
  const [busy, setBusy] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user?.role !== "admin") {
      setUsers([]);
      setBusy(false);
      return;
    }
    let active = true;
    setBusy(true);
    setMessage("");
    fetch("/api/admin/users", { cache: "no-store" })
      .then(async response => {
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.message || `HTTP ${response.status}`);
        return data;
      })
      .then(data => { if (active) setUsers(data.users); })
      .catch(err => { if (active) setMessage(err.message); })
      .finally(() => { if (active) setBusy(false); });
    return () => { active = false; };
  }, [user?.id, user?.role]);

  if (loading) return <p className="muted">Checking your session…</p>;
  if (!user) return <section className="panel narrow"><h1>Admin directory</h1><p>Log in as an administrator to view this page.</p><Link className="button" href="/login">Log in</Link></section>;
  if (user.role !== "admin") return <section className="panel narrow"><h1>403 · Admin only</h1><p>You do not have permission to view the user directory.</p><Link href="/">Return home</Link></section>;

  return (
    <section className="panel">
      <p className="eyebrow">Administrator tools</p>
      <h1>User directory</h1>
      <p className="muted">Read-only view of active and inactive demo accounts. The server verifies the admin role and returns only safe directory fields.</p>
      {busy && <p>Loading users…</p>}
      {message && <p className="error" role="alert">{message}</p>}
      {!busy && !message && <div className="table-scroll"><table>
        <thead><tr><th>Display name</th><th>Email</th><th>Role</th><th>Status</th></tr></thead>
        <tbody>{users.map(person => <tr key={person.id}>
          <td>{person.displayName}</td><td>{person.email}</td><td>{person.role}</td><td>{person.status}</td>
        </tr>)}</tbody>
      </table></div>}
      {!busy && !message && users.length === 0 && <p>No users were returned.</p>}
    </section>
  );
}
