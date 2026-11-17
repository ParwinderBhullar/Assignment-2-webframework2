import { currentUser } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
export const runtime = "nodejs";
export async function GET() {
  const user = await currentUser();
  if (!user) return Response.json({ message: "Login required" }, { status: 401 });
  const db = await getDb();
  const records = await db.collection("favorites").find({ userId: user.id }).sort({ createdAt: -1 }).toArray();
  return Response.json({ favorites: records.map(x => ({ artworkId: x.artworkId, note: x.note ?? "" })) });
}
export async function POST(req) {
  const user = await currentUser();
  if (!user) return Response.json({ message: "Login required" }, { status: 401 });
  const { artworkId } = await req.json().catch(() => ({}));
  if (!Number.isInteger(artworkId) || artworkId <= 0)
    return Response.json({ message: "Valid artworkId required" }, { status: 400 });
  const db = await getDb();
  await db.collection("favorites").updateOne({ userId: user.id, artworkId },
    { $setOnInsert: { userId: user.id, artworkId, note: "", createdAt: new Date() } }, { upsert: true });
  return Response.json({ ok: true }, { status: 201 });
}
