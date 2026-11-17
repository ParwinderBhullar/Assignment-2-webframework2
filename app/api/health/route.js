import { getDb } from "@/lib/mongodb";
export const runtime = "nodejs";
export async function GET() {
  try {
    const db = await getDb();
    await db.command({ ping: 1 });
    return Response.json({ connected: true, database: db.databaseName });
  } catch {
    return Response.json({ connected: false }, { status: 503 });
  }
}
