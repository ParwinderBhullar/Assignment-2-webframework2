import { currentUser } from "@/lib/auth";
export const runtime = "nodejs";
export async function GET() {
  const user = await currentUser();
  return user ? Response.json({ user }) : Response.json({ message: "Login required" }, { status: 401 });
}
