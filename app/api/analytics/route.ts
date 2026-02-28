import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { analyticsSummary, analyticsEvents, platformEnum } from "@/db/schema";
import { eq, and, gte, lte, sum, avg, count, desc } from "drizzle-orm";

type Platform = "YOUTUBE" | "TIKTOK" | "INSTAGRAM" | "FACEBOOK" | "TWITTER" | "LINKEDIN" | "PINTEREST" | "SNAPCHAT";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const workspaceId = searchParams.get("workspaceId");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const platform = searchParams.get("platform");

    if (!workspaceId) {
      return NextResponse.json({ error: "Workspace ID required" }, { status: 400 });
    }

    const conditions = [eq(analyticsSummary.workspaceId, workspaceId)];

    if (startDate && endDate) {
      conditions.push(
        gte(analyticsSummary.date, new Date(startDate)),
        lte(analyticsSummary.date, new Date(endDate))
      );
    }

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

    // Get platform breakdown
    const platformBreakdown = await db
      .select({
        platform: analyticsSummary.platform,
        totalViews: sum(analyticsSummary.totalViews),
        totalLikes: sum(analyticsSummary.totalLikes),
        totalShares: sum(analyticsSummary.totalShares),
        newFollowers: sum(analyticsSummary.newFollowers),
        totalVideos: sum(analyticsSummary.totalVideos),
      })
      .from(analyticsSummary)
      .where(and(...conditions))
      .groupBy(analyticsSummary.platform);

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
      platformBreakdown: platformBreakdown.map((p) => ({
        platform: p.platform,
        totalViews: Number(p.totalViews || 0),
        totalLikes: Number(p.totalLikes || 0),
        totalShares: Number(p.totalShares || 0),
        newFollowers: Number(p.newFollowers || 0),
        totalVideos: Number(p.totalVideos || 0),
      })),
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

    const id = `as_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const [newSummary] = await db
      .insert(analyticsSummary)
      .values({
        id,
        workspaceId,
        platform,
        date: new Date(date),
        totalViews: totalViews || 0,
        totalLikes: totalLikes || 0,
        totalShares: totalShares || 0,
        totalComments: totalComments || 0,
        newFollowers: newFollowers || 0,
        avgWatchTime: avgWatchTime || 0,
        totalVideos: totalVideos || 0,
        engagementRate: engagementRate || 0,
      })
      .onConflictDoUpdate({
        target: [analyticsSummary.workspaceId, analyticsSummary.platform, analyticsSummary.date],
        set: {
          totalViews,
          totalLikes,
          totalShares,
          totalComments,
          newFollowers,
          avgWatchTime,
          totalVideos,
          engagementRate,
          updatedAt: new Date(),
        },
      })
      .returning();

    return NextResponse.json({ summary: newSummary }, { status: 201 });
  } catch (error) {
    console.error("Error creating analytics summary:", error);
    return NextResponse.json({ error: "Failed to create summary" }, { status: 500 });
  }
}
