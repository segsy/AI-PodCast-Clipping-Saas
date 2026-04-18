import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { scheduledPosts, socialAccounts, projects, clips, platformEnum, postStatusEnum, workspaces } from "@/db/schema";
import { eq, and, gte, lte, desc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const workspaceId = searchParams.get("workspaceId");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const status = searchParams.get("status");
    const platform = searchParams.get("platform");

    if (!workspaceId || workspaceId.trim() === "") {
      return NextResponse.json({ error: "Workspace ID is required" }, { status: 400 });
    }

    const conditions = [eq(scheduledPosts.workspaceId, workspaceId)];

    // Validate and parse dates
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return NextResponse.json({ error: "Invalid date format for startDate or endDate" }, { status: 400 });
      }
      
      conditions.push(
        gte(scheduledPosts.scheduledAt, start),
        lte(scheduledPosts.scheduledAt, end)
      );
    }

    // Validate enum values
    const validStatuses = ["DRAFT", "SCHEDULED", "PUBLISHED", "FAILED", "CANCELLED"];
    const validPlatforms = ["YOUTUBE", "TIKTOK", "INSTAGRAM", "FACEBOOK", "TWITTER", "LINKEDIN", "PINTEREST", "SNAPCHAT"];

    if (status && !validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status value" }, { status: 400 });
    }

    if (platform && !validPlatforms.includes(platform)) {
      return NextResponse.json({ error: "Invalid platform value" }, { status: 400 });
    }

    if (status) {
      conditions.push(eq(scheduledPosts.status, status as typeof scheduledPosts.status.enumValues[number]));
    }

    if (platform) {
      conditions.push(eq(scheduledPosts.platform, platform as typeof scheduledPosts.platform.enumValues[number]));
    }

    const posts = await db
      .select({
        id: scheduledPosts.id,
        title: scheduledPosts.title,
        description: scheduledPosts.description,
        platform: scheduledPosts.platform,
        scheduledAt: scheduledPosts.scheduledAt,
        status: scheduledPosts.status,
        publishedAt: scheduledPosts.publishedAt,
        postUrl: scheduledPosts.postUrl,
        caption: scheduledPosts.caption,
        mediaUrls: scheduledPosts.mediaUrls,
        projectId: scheduledPosts.projectId,
        clipId: scheduledPosts.clipId,
        socialAccountId: scheduledPosts.socialAccountId,
        createdAt: scheduledPosts.createdAt,
      })
      .from(scheduledPosts)
      .where(and(...conditions))
      .orderBy(desc(scheduledPosts.scheduledAt));

    return NextResponse.json({ posts }, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
        'Pragma': 'no-cache',
      },
    });
  } catch (error) {
    console.error("Error fetching scheduled posts:", error);
    return NextResponse.json({ error: "Failed to fetch scheduled posts" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      workspaceId,
      userId,
      projectId,
      clipId,
      title,
      description,
      platform,
      socialAccountId,
      scheduledAt,
      caption,
      hashtags,
      mediaUrls,
    } = body;

    // Validate required fields
    if (!workspaceId || !title || !platform || !scheduledAt) {
      return NextResponse.json(
        { error: "Missing required fields: workspaceId, title, platform, and scheduledAt are required" },
        { status: 400 }
      );
    }

    // Validate platform - normalize to uppercase for validation
    const validPlatforms = ["YOUTUBE", "TIKTOK", "INSTAGRAM", "FACEBOOK", "TWITTER", "LINKEDIN", "PINTEREST", "SNAPCHAT"];
    const normalizedPlatform = platform?.toUpperCase();
    
    if (!normalizedPlatform || !validPlatforms.includes(normalizedPlatform)) {
      console.error("Invalid platform value:", platform);
      return NextResponse.json({ error: "Invalid platform value" }, { status: 400 });
    }

    // Validate workspace exists
    const workspaceExists = await db
      .select({ id: workspaces.id })
      .from(workspaces)
      .where(eq(workspaces.id, workspaceId))
      .limit(1);

    if (workspaceExists.length === 0) {
      return NextResponse.json(
        { error: "Workspace not found. Please provide a valid workspace ID." },
        { status: 400 }
      );
    }

    // Validate scheduledAt is a valid date
    const scheduledDate = new Date(scheduledAt);
    if (isNaN(scheduledDate.getTime())) {
      return NextResponse.json({ error: "Invalid scheduledAt date format" }, { status: 400 });
    }

    const id = `sp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const [newPost] = await db
      .insert(scheduledPosts)
      .values({
        id,
        workspaceId,
        userId,
        projectId,
        clipId,
        title,
        description,
        platform: normalizedPlatform,
        socialAccountId,
        scheduledAt: scheduledDate,
        caption,
        hashtags,
        mediaUrls,
        status: "SCHEDULED",
      })
      .returning();

    return NextResponse.json({ post: newPost }, { status: 201 });
  } catch (error) {
    console.error("Error creating scheduled post:", error);
    return NextResponse.json({ error: "Failed to create scheduled post" }, { status: 500 });
  }
}
