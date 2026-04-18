import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { jobEvents, clipJobs, users, workspaces, projects } from "@/db/schema";
import { eq, desc, or, and, count, sql, gte } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth";

// GET - Get activity logs
export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const source = searchParams.get("source") || "all";
    
    const offset = (page - 1) * limit;
    
    // Build where conditions
    let whereClause;
    if (source && source !== "all") {
      // Use sql() for the raw comparison to avoid type issues with enum columns
      whereClause = sql`${jobEvents.source} = ${source}`;
    }
    
    // Get total count
    const totalCount = await db
      .select({ count: count() })
      .from(jobEvents)
      .where(whereClause);
    
    // Get events
    const events = await db
      .select()
      .from(jobEvents)
      .where(whereClause)
      .orderBy(desc(jobEvents.createdAt))
      .limit(limit)
      .offset(offset);
    
    // Get job details
    const jobIds = [...new Set(events.map(e => e.jobId).filter(Boolean))];
    let jobDetails: any[] = [];
    if (jobIds.length > 0) {
      const conditions = jobIds.map(id => eq(clipJobs.id, id));
      jobDetails = await db
        .select({
          id: clipJobs.id,
          workspaceId: clipJobs.workspaceId,
          projectId: clipJobs.projectId,
          status: clipJobs.status,
        })
        .from(clipJobs)
        .where(or(...conditions));
    }
    
    // Get workspace details
    const workspaceIds = [...new Set(jobDetails.map(j => j.workspaceId).filter(Boolean))];
    let workspaceDetails: any[] = [];
    if (workspaceIds.length > 0) {
      const conditions = workspaceIds.map(id => eq(workspaces.id, id!));
      workspaceDetails = await db
        .select({ id: workspaces.id, name: workspaces.name })
        .from(workspaces)
        .where(or(...conditions));
    }
    
    // Map data
    const jobMap = new Map(jobDetails.map(j => [j.id, j]));
    const workspaceMap = new Map(workspaceDetails.map(w => [w.id, w]));
    
    // Format events
    const formattedEvents = events.map(event => {
      const job = jobMap.get(event.jobId);
      const workspace = job ? workspaceMap.get(job.workspaceId!) : null;
      
      return {
        id: event.id,
        type: event.type,
        source: event.source,
        stage: event.stage,
        progress: event.progress,
        message: event.message,
        payload: event.payload,
        createdAt: event.createdAt,
        job: job ? {
          id: job.id,
          status: job.status,
          workspace: workspace ? { id: workspace.id, name: workspace.name } : null,
        } : null,
      };
    });
    
    // Get summary by type
    const typeSummary = await db
      .select({ type: jobEvents.type, count: count() })
      .from(jobEvents)
      .groupBy(jobEvents.type);
    
    // Get recent activity counts
    const recentActivity = await db
      .select({
        date: sql<string>`DATE(${jobEvents.createdAt})`.as("date"),
        count: count(),
      })
      .from(jobEvents)
      .where(gte(jobEvents.createdAt, new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)))
      .groupBy(sql`DATE(${jobEvents.createdAt})`)
      .orderBy(sql`DATE(${jobEvents.createdAt})`);
    
    return NextResponse.json({
      events: formattedEvents,
      total: totalCount[0]?.count || 0,
      page: page,
      limit: limit,
      totalPages: Math.ceil((totalCount[0]?.count || 0) / limit),
      summary: {
        byType: typeSummary.map(t => ({ type: t.type, count: t.count })),
      },
      recentActivity: recentActivity.map(a => ({
        date: a.date,
        count: Number(a.count),
      })),
    });
  } catch (error: any) {
    console.error("Error fetching activity:", error);
    if (error.message === "Unauthorized" || error.message.includes("Forbidden")) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
