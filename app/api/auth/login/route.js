import { compare } from "bcryptjs";
import { getDb } from "@/lib/mongodb";
import { makeToken, sessionCookie, cookieOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
export const runtime = "nodejs";
export async function POST(req) {
  const { email, password } = await req.json().catch(() => ({}));
  if (typeof email !== "string" || typeof password !== "string")
    return Response.json({ message: "Email and password required" }, { status: 400 });
  const db = await getDb();
  const u = await db.collection("users").findOne({ email: email.trim().toLowerCase(), status: "active" });
  if (!u || !(await compare(password, u.passwordHash)))
    return Response.json({ message: "Invalid credentials" }, { status: 401 });
  const res = NextResponse.json({ user: { id: String(u._id), email: u.email, displayName: u.displayName, role: u.role } });
  res.cookies.set(sessionCookie, await makeToken(u._id), cookieOptions);
  return res;
}
