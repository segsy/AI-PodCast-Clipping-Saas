import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { scheduledPosts, socialAccounts, projects, clips, platformEnum, postStatusEnum } from "@/db/schema";
import { eq, and, gte, lte, desc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const workspaceId = searchParams.get("workspaceId");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const status = searchParams.get("status");
    const platform = searchParams.get("platform");

    if (!workspaceId) {
      return NextResponse.json({ error: "Workspace ID required" }, { status: 400 });
    }

    const conditions = [eq(scheduledPosts.workspaceId, workspaceId)];

    if (startDate && endDate) {
      conditions.push(
        gte(scheduledPosts.scheduledAt, new Date(startDate)),
        lte(scheduledPosts.scheduledAt, new Date(endDate))
      );
    }

    if (status) {
      conditions.push(eq(scheduledPosts.status, status as typeof postStatusEnum.EnumValues[number]));
    }

    if (platform) {
      conditions.push(eq(scheduledPosts.platform, platform as typeof platformEnum.EnumValues[number]));
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

    return NextResponse.json({ posts });
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

    if (!workspaceId || !title || !platform || !scheduledAt) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
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
        platform,
        socialAccountId,
        scheduledAt: new Date(scheduledAt),
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
