import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { analyticsEvents, users, workspaces, clips, clipJobs, uploads, subscriptions } from "@/db/schema";
import { eq, desc, or, and, count, sql, gte, lte } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth";

// GET - Get analytics overview
export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    
    const searchParams = request.nextUrl.searchParams;
    const period = searchParams.get("period") || "30d"; // 7d, 30d, 90d, 1y
    
    // Calculate date range
    const now = new Date();
    let startDate: Date;
    switch (period) {
      case "7d":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "30d":
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case "90d":
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case "1y":
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }
    
    // Get total users
    const totalUsers = await db
      .select({ count: count() })
      .from(users);
    
    // Get total workspaces
    const totalWorkspaces = await db
      .select({ count: count() })
      .from(workspaces);
    
    // Get total clips
    const totalClips = await db
      .select({ count: count() })
      .from(clips);
    
    // Get total uploads
    const totalUploads = await db
      .select({ count: count() })
      .from(uploads);
    
    // Get active subscriptions
    const activeSubscriptions = await db
      .select({ count: count() })
      .from(subscriptions)
      .where(eq(subscriptions.status, "ACTIVE"));
    
    // Get clip job stats
    const completedJobs = await db
      .select({ count: count() })
      .from(clipJobs)
      .where(eq(clipJobs.status, "DONE"));
    
    const failedJobs = await db
      .select({ count: count() })
      .from(clipJobs)
      .where(eq(clipJobs.status, "FAILED"));
    
    const processingJobs = await db
      .select({ count: count() })
      .from(clipJobs)
      .where(eq(clipJobs.status, "RENDER"));
    
    // Get analytics events for the period
    const eventStats = await db
      .select({
        name: analyticsEvents.name,
        count: count(),
      })
      .from(analyticsEvents)
      .where(gte(analyticsEvents.createdAt, startDate))
      .groupBy(analyticsEvents.name)
      .orderBy(desc(count()));
    
    // Get daily event counts
    const dailyEvents = await db
      .select({
        date: sql<string>`DATE(${analyticsEvents.createdAt})`.as("date"),
        count: count(),
      })
      .from(analyticsEvents)
      .where(gte(analyticsEvents.createdAt, startDate))
      .groupBy(sql`DATE(${analyticsEvents.createdAt})`)
      .orderBy(sql`DATE(${analyticsEvents.createdAt})`);
    
    // Get top clips by score
    const topClips = await db
      .select({
        id: clips.id,
        title: clips.title,
        score: clips.score,
        status: clips.status,
        createdAt: clips.createdAt,
      })
      .from(clips)
      .where(sql`${clips.score} IS NOT NULL`)
      .orderBy(desc(clips.score))
      .limit(10);
    
    // Get workspace activity
    const workspaceActivity = await db
      .select({
        workspaceId: analyticsEvents.workspaceId,
        count: count(),
      })
      .from(analyticsEvents)
      .where(gte(analyticsEvents.createdAt, startDate))
      .groupBy(analyticsEvents.workspaceId)
      .orderBy(desc(count()))
      .limit(10);
    
    // Get workspace details
    const workspaceIds = workspaceActivity.map(w => w.workspaceId);
    let workspaceDetails: any[] = [];
    if (workspaceIds.length > 0 && workspaceIds[0] !== null) {
      const conditions = workspaceIds.map(id => eq(workspaces.id, id!));
      workspaceDetails = await db
        .select({
          id: workspaces.id,
          name: workspaces.name,
        })
        .from(workspaces)
        .where(or(...conditions));
    }
    
    const workspaceMap = new Map(workspaceDetails.map(w => [w.id, w]));
    
    const formattedWorkspaceActivity = workspaceActivity
      .filter(w => w.workspaceId !== null)
      .map(w => ({
        workspaceId: w.workspaceId,
        workspaceName: workspaceMap.get(w.workspaceId!)?.name || "Unknown",
        eventCount: w.count,
      }));
    
    // Calculate growth percentages (comparing to previous period)
    const prevStartDate = new Date(startDate.getTime() - (now.getTime() - startDate.getTime()));
    const prevEndDate = startDate;
    
    const prevUsers = await db
      .select({ count: count() })
      .from(users)
      .where(lte(users.createdAt, prevEndDate));
    
    const userGrowth = prevUsers[0]?.count ? 
      Math.round(((totalUsers[0].count - prevUsers[0].count) / prevUsers[0].count) * 100) : 0;
    
    return NextResponse.json({
      period,
      overview: {
        totalUsers: totalUsers[0]?.count || 0,
        totalWorkspaces: totalWorkspaces[0]?.count || 0,
        totalClips: totalClips[0]?.count || 0,
        totalUploads: totalUploads[0]?.count || 0,
        activeSubscriptions: activeSubscriptions[0]?.count || 0,
        completedJobs: completedJobs[0]?.count || 0,
        failedJobs: failedJobs[0]?.count || 0,
        processingJobs: processingJobs[0]?.count || 0,
        userGrowth,
      },
      eventStats: eventStats.map(e => ({
        name: e.name,
        count: e.count,
      })),
      dailyEvents: dailyEvents.map(e => ({
        date: e.date,
        count: Number(e.count),
      })),
      topClips: topClips.map(c => ({
        id: c.id,
        title: c.title,
        score: c.score,
        status: c.status,
        createdAt: c.createdAt,
      })),
      workspaceActivity: formattedWorkspaceActivity,
    });
  } catch (error: any) {
    console.error("Error fetching analytics:", error);
    if (error.message === "Unauthorized" || error.message.includes("Forbidden")) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
