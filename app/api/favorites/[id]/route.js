import { currentUser } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
export const runtime = "nodejs";
export async function DELETE(req, { params }) {
  const user = await currentUser();
  if (!user) return Response.json({ message: "Login required" }, { status: 401 });
  const { id } = await params;
  const artworkId = Number(id);
  if (!Number.isInteger(artworkId) || artworkId <= 0)
    return Response.json({ message: "Invalid artwork ID" }, { status: 400 });
  const db = await getDb();
  await db.collection("favorites").deleteOne({ userId: user.id, artworkId });
  return Response.json({ ok: true });
}
export async function PATCH(req, { params }) {
  const user = await currentUser();
  if (!user) return Response.json({ message: "Login required" }, { status: 401 });
  const { id } = await params; const artworkId = Number(id);
  const { note } = await req.json().catch(() => ({}));
  if (!Number.isInteger(artworkId) || artworkId <= 0 || typeof note !== "string" || note.length > 250)
    return Response.json({ message: "Invalid input" }, { status: 400 });
  const db = await getDb();
  const r = await db.collection("favorites").updateOne({ userId: user.id, artworkId }, { $set: { note } });
  return r.matchedCount ? Response.json({ ok: true }) : Response.json({ message: "Not found" }, { status: 404 });
}
