import { NextResponse } from "next/server";
import { sessionCookie, cookieOptions } from "@/lib/auth";
export async function POST() {
  const res = NextResponse.json({ message: "Logged out" });
  res.cookies.set(sessionCookie, "", { ...cookieOptions, maxAge: 0 });
  return res;
}
