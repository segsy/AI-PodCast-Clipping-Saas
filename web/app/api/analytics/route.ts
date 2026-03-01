import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { analyticsSummary, analyticsEvents } from "@/db/schema";
import { eq, and, sql, desc } from "drizzle-orm";

type Platform = "YOUTUBE" | "TIKTOK" | "INSTAGRAM" | "FACEBOOK" | "TWITTER" | "LINKEDIN" | "PINTEREST" | "SNAPCHAT";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const workspaceId = searchParams.get("workspaceId");
    const platform = searchParams.get("platform");

    if (!workspaceId) {
      return NextResponse.json({ error: "Workspace ID required" }, { status: 400 });
    }

    const conditions = [eq(analyticsSummary.workspaceId, workspaceId)];

    if (platform) {
      conditions.push(eq(analyticsSummary.platform, platform as Platform));
    }

    // Get analytics summary data
    const summaryData = await db
      .select()
      .from(analyticsSummary)
      .where(and(...conditions))
      .orderBy(desc(analyticsSummary.date));

    // Calculate totals
    let totalViews = 0;
    let totalLikes = 0;
    let totalShares = 0;
    let totalComments = 0;
    let totalNewFollowers = 0;
    let totalWatchTime = 0;
    let totalVideos = 0;

    summaryData.forEach((day) => {
      totalViews += Number(day.totalViews);
      totalLikes += Number(day.totalLikes);
      totalShares += Number(day.totalShares);
      totalComments += Number(day.totalComments);
      totalNewFollowers += Number(day.newFollowers);
      totalWatchTime += day.avgWatchTime * day.totalVideos;
      totalVideos += day.totalVideos;
    });

    const avgWatchTime = totalVideos > 0 ? totalWatchTime / totalVideos : 0;
    const engagementRate = totalViews > 0 
      ? ((totalLikes + totalShares + totalComments) / totalViews) * 100 
      : 0;

    // Get recent analytics events
    const recentEvents = await db
      .select({
        id: analyticsEvents.id,
        name: analyticsEvents.name,
        path: analyticsEvents.path,
        properties: analyticsEvents.properties,
        createdAt: analyticsEvents.createdAt,
      })
      .from(analyticsEvents)
      .where(eq(analyticsEvents.workspaceId, workspaceId))
      .orderBy(desc(analyticsEvents.createdAt))
      .limit(50);

    return NextResponse.json({
      summary: {
        totalViews,
        totalLikes,
        totalShares,
        totalComments,
        totalNewFollowers,
        avgWatchTime: Math.round(avgWatchTime * 100) / 100,
        totalVideos,
        engagementRate: Math.round(engagementRate * 100) / 100,
      },
      dailyData: summaryData,
      recentEvents,
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      workspaceId,
      platform,
      date,
      totalViews,
      totalLikes,
      totalShares,
      totalComments,
      newFollowers,
      avgWatchTime,
      totalVideos,
      engagementRate,
    } = body;

    if (!workspaceId || !date) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const id = "as_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
    const dateStr = new Date(date).toISOString();

    // Use raw SQL for insert to avoid type issues
    const result = await db.execute(sql`
      INSERT INTO analytics_summary (id, workspace_id, platform, date, total_views, total_likes, total_shares, total_comments, new_followers, avg_watch_time, total_videos, engagement_rate, created_at, updated_at)
      VALUES (${id}, ${workspaceId}, ${platform || null}, ${dateStr}, ${totalViews || 0}, ${totalLikes || 0}, ${totalShares || 0}, ${totalComments || 0}, ${newFollowers || 0}, ${avgWatchTime || 0}, ${totalVideos || 0}, ${engagementRate || 0}, NOW(), NOW())
      ON CONFLICT (workspace_id, platform, date) DO UPDATE SET
        total_views = ${totalViews || 0},
        total_likes = ${totalLikes || 0},
        total_shares = ${totalShares || 0},
        total_comments = ${totalComments || 0},
        new_followers = ${newFollowers || 0},
        avg_watch_time = ${avgWatchTime || 0},
        total_videos = ${totalVideos || 0},
        engagement_rate = ${engagementRate || 0},
        updated_at = NOW()
      RETURNING *
    `);

    return NextResponse.json({ summary: result }, { status: 201 });
  } catch (error) {
    console.error("Error creating analytics summary:", error);
    return NextResponse.json({ error: "Failed to create summary" }, { status: 500 });
  }
}
