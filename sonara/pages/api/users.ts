import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../lib/mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const users = await db.collection("users").find({}).toArray();
    res.status(200).json(users);
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
}
