import { MongoClient } from "mongodb";
import { hash } from "bcryptjs";
import { config } from "dotenv";
config({ path: ".env.local" });
if (!process.env.MONGODB_URI || !process.env.MONGODB_DB) throw new Error("Missing Atlas settings");
const client = new MongoClient(process.env.MONGODB_URI);
try {
  await client.connect();
  const db = client.db(process.env.MONGODB_DB);
  const users = db.collection("users");
  await users.createIndex({ email: 1 }, { unique: true });
  await db.collection("favorites").createIndex({ userId: 1, artworkId: 1 }, { unique: true });
  const seed = [
    { email: "student@example.test", password: "Student123!", role: "user" },
    { email: "admin@example.test", password: "Admin123!", role: "admin" }
  ];
  for (const u of seed) {
    await users.updateOne({ email: u.email }, {
      $setOnInsert: {
        displayName: u.role === "admin" ? "Demo Admin" : "Demo Student",
        email: u.email, passwordHash: await hash(u.password, 12),
        role: u.role, status: "active", preferences: { theme: "light" },
        createdAt: new Date()
      }
    }, { upsert: true });
  }
  console.log("Demo users seeded. Replace demo passwords before publishing live login.");
} finally { await client.close(); }
