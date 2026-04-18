import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { scheduledPosts } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const post = await db
      .select()
      .from(scheduledPosts)
      .where(eq(scheduledPosts.id, id))
      .limit(1);

    if (!post.length) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ post: post[0] });
  } catch (error) {
    console.error("Error fetching scheduled post:", error);
    return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      title,
      description,
      platform,
      socialAccountId,
      scheduledAt,
      status,
      caption,
      hashtags,
      mediaUrls,
      postUrl,
      publishedAt,
    } = body;

    // Validate platform if provided
    const validPlatforms = ["YOUTUBE", "TIKTOK", "INSTAGRAM", "FACEBOOK", "TWITTER", "LINKEDIN", "PINTEREST", "SNAPCHAT"];
    if (platform !== undefined && !validPlatforms.includes(platform)) {
      return NextResponse.json({ error: "Invalid platform value" }, { status: 400 });
    }

    // Validate status if provided
    const validStatuses = ["DRAFT", "SCHEDULED", "PUBLISHED", "FAILED", "CANCELLED"];
    if (status !== undefined && !validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status value" }, { status: 400 });
    }

    const updates: Record<string, unknown> = {
      updatedAt: new Date(),
    };

    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (platform !== undefined) updates.platform = platform;
    if (socialAccountId !== undefined) updates.socialAccountId = socialAccountId;
    if (scheduledAt !== undefined) {
      const date = new Date(scheduledAt);
      if (isNaN(date.getTime())) {
        return NextResponse.json({ error: "Invalid scheduledAt date format" }, { status: 400 });
      }
      updates.scheduledAt = date;
    }
    if (status !== undefined) updates.status = status;
    if (caption !== undefined) updates.caption = caption;
    if (hashtags !== undefined) updates.hashtags = hashtags;
    if (mediaUrls !== undefined) updates.mediaUrls = mediaUrls;
    if (postUrl !== undefined) updates.postUrl = postUrl;
    if (publishedAt !== undefined) updates.publishedAt = publishedAt ? new Date(publishedAt) : null;

    const [updatedPost] = await db
      .update(scheduledPosts)
      .set(updates)
      .where(eq(scheduledPosts.id, id))
      .returning();

    if (!updatedPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ post: updatedPost });
  } catch (error) {
    console.error("Error updating scheduled post:", error);
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const [deletedPost] = await db
      .delete(scheduledPosts)
      .where(eq(scheduledPosts.id, id))
      .returning();

    if (!deletedPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting scheduled post:", error);
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}
