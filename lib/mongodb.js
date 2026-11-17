import { MongoClient } from "mongodb";
const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("Set MONGODB_URI in .env.local");
const globalCache = globalThis;
if (!globalCache._a2MongoClientPromise) {
  globalCache._a2MongoClientPromise = new MongoClient(uri).connect();
}
export async function getDb() {
  const client = await globalCache._a2MongoClientPromise;
  return client.db(process.env.MONGODB_DB || "art_explorer_demo");
}
