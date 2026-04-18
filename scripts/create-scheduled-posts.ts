import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { scheduledPosts, workspaces, users } from "../db/schema";

const DATABASE_URL = process.env.DATABASE_URL || "";

interface ScheduledPostData {
  workspaceId: string;
  userId?: string;
  projectId?: string;
  clipId?: string;
  title: string;
  description?: string;
  platform: "YOUTUBE" | "TIKTOK" | "INSTAGRAM" | "TWITTER" | "LINKEDIN" | "FACEBOOK";
  socialAccountId?: string;
  scheduledAt: Date;
  status: "DRAFT" | "SCHEDULED" | "PUBLISHED" | "FAILED";
  caption?: string;
  mediaUrls?: string[];
  hashtags?: string[];
}

async function main() {
  console.log("🔌 Connecting to database...");
  const sql = neon(DATABASE_URL);
  const db = drizzle(sql);

  // Get first workspace and user for testing
  console.log("📋 Fetching workspace and user data...");
  const workspaceList = await db.select().from(workspaces).limit(1);
  const userList = await db.select().from(users).limit(1);

  if (workspaceList.length === 0) {
    console.error("❌ No workspaces found. Please run seed-admin.ts first to create a workspace.");
    process.exit(1);
  }

  const workspaceId = workspaceList[0].id;
  const userId = userList[0]?.id;

  console.log(`   Using workspace: ${workspaceId}`);
  console.log(`   Using user: ${userId || "N/A"}`);

  // Sample scheduled posts to create
  const scheduledPostsData: ScheduledPostData[] = [
    {
      workspaceId,
      userId,
      title: "New Podcast Episode Announcement",
      description: "Announcing our latest podcast episode about AI in content creation",
      platform: "YOUTUBE",
      scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
      status: "SCHEDULED",
      caption: "🎙️ New episode dropping tomorrow! We're discussing how AI is revolutionizing content creation. Stay tuned! #AI #Podcast #ContentCreation",
      hashtags: ["AI", "Podcast", "ContentCreation"],
      mediaUrls: ["https://example.com/media1.mp4"],
    },
    {
      workspaceId,
      userId,
      title: "Behind the Scenes Clip",
      description: "Behind the scenes look at our recording setup",
      platform: "TIKTOK",
      scheduledAt: new Date(Date.now() + 48 * 60 * 60 * 1000), // 48 hours from now
      status: "DRAFT",
      caption: "🎬 Ever wondered how we record? Here's a behind the scenes look! #BehindTheScenes #Recording #Podcast",
      hashtags: ["BehindTheScenes", "Recording", "Podcast"],
    },
    {
      workspaceId,
      userId,
      title: "Weekly Highlights",
      description: "Highlights from this week's episodes",
      platform: "INSTAGRAM",
      scheduledAt: new Date(Date.now() + 72 * 60 * 60 * 1000), // 72 hours from now
      status: "SCHEDULED",
      caption: "📸 This week's highlights are here! What was your favorite moment? Let us know in the comments! #Highlights #Weekly #Podcast",
      hashtags: ["Highlights", "Weekly", "Podcast"],
    },
  ];

  console.log("📝 Creating scheduled posts...");

  for (const postData of scheduledPostsData) {
    const postId = `sp_${crypto.randomUUID()}`;
    
    try {
      await db.insert(scheduledPosts).values({
        id: postId,
        workspaceId: postData.workspaceId,
        userId: postData.userId || null,
        projectId: postData.projectId || null,
        clipId: postData.clipId || null,
        title: postData.title,
        description: postData.description || null,
        platform: postData.platform,
        socialAccountId: postData.socialAccountId || null,
        scheduledAt: postData.scheduledAt,
        status: postData.status,
        caption: postData.caption || null,
        mediaUrls: postData.mediaUrls || null,
        hashtags: postData.hashtags || null,
      });
      
      console.log(`   ✅ Created: ${postData.title} (${postData.platform}) - ${postData.scheduledAt.toISOString()}`);
    } catch (error) {
      console.error(`   ❌ Error creating post "${postData.title}":`, error);
    }
  }

  console.log("✅ Scheduled posts created successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
