/**
 * Seed script to create demo workspace and user
 * Run with: npx tsx scripts/seed-demo-workspace.ts
 */
import 'dotenv/config';
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { users, workspaces, workspaceMembers } from "../db/schema";
import { eq } from "drizzle-orm";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("❌ DATABASE_URL is not defined in .env");
  process.exit(1);
}

const sql = neon(databaseUrl);
const db = drizzle(sql);

async function seedDemoWorkspace() {
  console.log("🌱 Starting demo workspace seed...");

  try {
    // Check if demo user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.id, "demo-user"))
      .limit(1);

    let userId = "demo-user";

    if (existingUser.length === 0) {
      console.log("Creating demo user...");
      // Create demo user
      const [newUser] = await db
        .insert(users)
        .values({
          id: "demo-user",
          name: "Demo User",
          email: "demo@example.com",
          emailVerified: new Date(),
          image: "https://api.dicebear.com/7.x/avataaars/svg?seed=demo",
        })
        .returning();
      userId = newUser.id;
      console.log("✅ Demo user created:", userId);
    } else {
      console.log("✅ Demo user already exists:", userId);
    }

    // Check if demo workspace already exists
    const existingWorkspace = await db
      .select()
      .from(workspaces)
      .where(eq(workspaces.id, "demo-workspace"))
      .limit(1);

    if (existingWorkspace.length === 0) {
      console.log("Creating demo workspace...");
      // Create demo workspace
      const [newWorkspace] = await db
        .insert(workspaces)
        .values({
          id: "demo-workspace",
          name: "Demo Workspace",
          slug: "demo-workspace",
          createdBy: userId,
        })
        .returning();
      console.log("✅ Demo workspace created:", newWorkspace.id);
    } else {
      console.log("✅ Demo workspace already exists");
    }

    // Check if workspace membership already exists
    const existingMembership = await db
      .select()
      .from(workspaceMembers)
      .where(eq(workspaceMembers.workspaceId, "demo-workspace"))
      .limit(1);

    if (existingMembership.length === 0) {
      console.log("Creating workspace membership...");
      // Add user to workspace
      await db.insert(workspaceMembers).values({
        workspaceId: "demo-workspace",
        userId: userId,
        role: "OWNER",
        status: "ACTIVE",
      });
      console.log("✅ Workspace membership created");
    } else {
      console.log("✅ Workspace membership already exists");
    }

    console.log("\n🎉 Demo workspace seeding completed successfully!");
    console.log("   - User ID: demo-user");
    console.log("   - Workspace ID: demo-workspace");
    console.log("\nYou can now test the calendar upload feature.");

  } catch (error) {
    console.error("❌ Error seeding demo workspace:", error);
    process.exit(1);
  }
}

seedDemoWorkspace();
