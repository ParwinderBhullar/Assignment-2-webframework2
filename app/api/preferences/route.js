import { currentUser } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
export const runtime = "nodejs";
export async function PATCH(req) {
  const user = await currentUser();
  if (!user) return Response.json({ message: "Login required" }, { status: 401 });
  const { theme } = await req.json().catch(() => ({}));
  if (!["light", "dark"].includes(theme)) return Response.json({ message: "Invalid theme" }, { status: 400 });
  const db = await getDb();
  await db.collection("users").updateOne({ _id: new ObjectId(user.id) },
    { $set: { "preferences.theme": theme } });
  return Response.json({ theme });
}
