import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";

const databaseUrl = process.env.DATABASE_URL;

if (
  !databaseUrl ||
  databaseUrl.includes("[user]") ||
  databaseUrl.includes("[password]") ||
  databaseUrl.includes("[neon_hostname]") ||
  databaseUrl.includes("[dbname]")
) {
  throw new Error("DATABASE_URL is not defined with a real Neon connection string");
}

// Required for Node.js runtimes that do not expose a native WebSocket implementation.
neonConfig.webSocketConstructor = ws;

export const pool = new Pool({ connectionString: databaseUrl });
export const db = drizzle(pool);
