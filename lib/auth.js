import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
const cookieName = "a2_session";
const secret = () => {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32)
    throw new Error("JWT_SECRET must be at least 32 characters");
  return new TextEncoder().encode(process.env.JWT_SECRET);
};
export const sessionCookie = cookieName;
export const cookieOptions = {
  httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production",
  path: "/", maxAge: 60 * 60
};
export async function makeToken(id) {
  return new SignJWT({}).setProtectedHeader({ alg: "HS256" })
    .setSubject(String(id)).setIssuedAt().setExpirationTime("1h").sign(secret());
}
export async function currentUser() {
  const token = (await cookies()).get(cookieName)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret(), { algorithms: ["HS256"] });
    if (!ObjectId.isValid(payload.sub)) return null;
    const db = await getDb();
    const user = await db.collection("users").findOne({ _id: new ObjectId(payload.sub), status: "active" },
      { projection: { passwordHash: 0 } });
    if (!user) return null;
    return { id: String(user._id), email: user.email, displayName: user.displayName,
      role: user.role, preferences: user.preferences ?? { theme: "light" } };
  } catch { return null; }
}
