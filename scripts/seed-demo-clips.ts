/**
 * Seed script to create demo clips
 * Run with: npx tsx scripts/seed-demo-clips.ts
 */
import 'dotenv/config';
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { clips } from "../db/schema";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("❌ DATABASE_URL is not defined in .env");
  process.exit(1);
}

const sql = neon(databaseUrl);
const db = drizzle(sql);

async function seedDemoClips() {
  console.log("🌱 Starting demo clips seed...");

  try {
    // Create demo clips for the demo workspace
    const demoClips = [
      {
        id: "clip_001",
        workspaceId: "demo-workspace",
        projectId: "demo-project",
        title: "Introduction to AI",
        description: "An introductory video about AI",
        status: "READY" as const,
        duration: 120,
        startMs: 0,
        endMs: 120000,
        thumbnailUrl: null,
        s3Key: "clips/demo/intro.mp4",
        caption: null,
        hashtags: null,
        score: 85,
        createdBy: "demo-user",
      },
      {
        id: "clip_002",
        workspaceId: "demo-workspace",
        projectId: "demo-project",
        title: "Machine Learning Basics",
        description: "Learn the basics of machine learning",
        status: "READY" as const,
        duration: 180,
        startMs: 0,
        endMs: 180000,
        thumbnailUrl: null,
        s3Key: "clips/demo/ml-basics.mp4",
        caption: null,
        hashtags: null,
        score: 90,
        createdBy: "demo-user",
      },
      {
        id: "clip_003",
        workspaceId: "demo-workspace",
        projectId: "demo-project",
        title: "Deep Learning Explained",
        description: "Understanding deep learning concepts",
        status: "READY" as const,
        duration: 240,
        startMs: 0,
        endMs: 240000,
        thumbnailUrl: null,
        s3Key: "clips/demo/deep-learning.mp4",
        caption: null,
        hashtags: null,
        score: 88,
        createdBy: "demo-user",
      },
    ];

    for (const clip of demoClips) {
      try {
        await db.insert(clips).values(clip).onConflictDoNothing();
        console.log("✅ Created clip:", clip.title);
      } catch (err: any) {
        if (err.code === "23505") {
          console.log("⏭️  Clip already exists:", clip.title);
        } else {
          console.error("❌ Error creating clip:", clip.title, err);
        }
      }
    }

    console.log("\n🎉 Demo clips seeding completed successfully!");
    console.log("   - Created 3 demo clips for workspace: demo-workspace");

  } catch (error) {
    console.error("❌ Error seeding demo clips:", error);
    process.exit(1);
  }
}

seedDemoClips();
