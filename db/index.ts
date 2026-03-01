import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

//const sql = neon(process.env.DATABASE_URL!);

//export const db = drizzle(sql, { schema });

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL is not defined");
}
const sql = neon(databaseUrl);
export const db = drizzle(sql, { schema });


// Export all schema tables for easy access
export * from "./schema";

// Helper function to check database connection
export async function checkDatabaseConnection() {
  try {
    await sql`SELECT 1`;
    console.log("✅ Database connected successfully");
    return true;
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    return false;
  }
}
