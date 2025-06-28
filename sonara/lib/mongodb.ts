import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI!;
const options = {};

let client;
let clientPromise: Promise<MongoClient>;

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your Mongo URI to .env");
}

// Use (globalThis as Record<string, unknown>) for _mongoClientPromise to avoid 'any' and 'unknown' type errors
if (process.env.NODE_ENV === "development") {
  if (!(globalThis as Record<string, unknown>)._mongoClientPromise) {
    client = new MongoClient(uri, options);
    (globalThis as Record<string, unknown>)._mongoClientPromise = client.connect();
  }
  clientPromise = (globalThis as Record<string, unknown>)._mongoClientPromise as Promise<MongoClient>;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
