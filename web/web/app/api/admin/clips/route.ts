import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { clips, clipJobs, projects, workspaces, users, workspaceMembers, clipAssets } from "@/db/schema";
import { clipStatusEnum } from "@/db/schema";
import { eq, desc, like, or, and, count, asc } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth";

// GET - List all clips with pagination and search
export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "all";
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";
    
    const offset = (page - 1) * limit;
    
    // Build where conditions
    let whereClause;
    const conditions = [];
    
    if (search) {
      conditions.push(like(clips.title, `%${search}%`));
    }
    
    if (status && status !== "all") {
      const statusValue = status.toUpperCase() as "PENDING" | "RENDERING" | "READY" | "FAILED" | "ARCHIVED";
      conditions.push(eq(clips.status, clipStatusEnum(statusValue)));
    }
    
    if (conditions.length > 0) {
      whereClause = and(...conditions);
    }
    
    // Get total count
    const totalCount = await db
      .select({ count: count() })
      .from(clips)
      .where(whereClause);
    
    // Get clips
    let allClips;
    if (sortOrder === "asc") {
      allClips = await db
        .select()
        .from(clips)
        .where(whereClause)
        .orderBy(asc(clips.createdAt))
        .limit(limit)
        .offset(offset);
    } else {
      allClips = await db
        .select()
        .from(clips)
        .where(whereClause)
        .orderBy(desc(clips.createdAt))
        .limit(limit)
        .offset(offset);
    }
    
    // Get related data
    const projectIds = allClips.map(c => c.projectId);
    const workspaceIds = allClips.map(c => c.workspaceId);
    const jobIds = allClips.map(c => c.jobId);
    
    // Get projects
    let projectDetails: any[] = [];
    if (projectIds.length > 0) {
      projectDetails = await db
        .select({
          id: projects.id,
          name: projects.name,
        })
        .from(projects)
        .where(or(...projectIds.map(id => eq(projects.id, id))));
    }
    
    // Get workspaces
    let workspaceDetails: any[] = [];
    if (workspaceIds.length > 0) {
      workspaceDetails = await db
        .select({
          id: workspaces.id,
          name: workspaces.name,
        })
        .from(workspaces)
        .where(or(...workspaceIds.map(id => eq(workspaces.id, id))));
    }
    
    // Get job details
    let jobDetails: any[] = [];
    if (jobIds.length > 0) {
      jobDetails = await db
        .select({
          id: clipJobs.id,
          status: clipJobs.status,
          progress: clipJobs.progress,
        })
        .from(clipJobs)
        .where(or(...jobIds.map(id => eq(clipJobs.id, id))));
    }
    
    // Map data
    const projectMap = new Map(projectDetails.map(p => [p.id, p]));
    const workspaceMap = new Map(workspaceDetails.map(w => [w.id, w]));
    const jobMap = new Map(jobDetails.map(j => [j.id, j]));
    
    // Format clips
    const formattedClips = allClips.map(clip => {
      const project = projectMap.get(clip.projectId);
      const workspace = workspaceMap.get(clip.workspaceId);
      const job = jobMap.get(clip.jobId);
      
      return {
        id: clip.id,
        title: clip.title,
        startMs: clip.startMs,
        endMs: clip.endMs,
        score: clip.score,
        status: clip.status,
        variant: clip.variant,
        templateId: clip.templateId,
        captionStyleId: clip.captionStyleId,
        workspace: workspace ? { id: workspace.id, name: workspace.name } : null,
        project: project ? { id: project.id, name: project.name } : null,
        job: job ? { status: job.status, progress: job.progress } : null,
        createdAt: clip.createdAt,
        updatedAt: clip.updatedAt,
      };
    });
    
    // Get status counts
    const statusCountsResult = await db
      .select({
        status: clips.status,
        count: count(),
      })
      .from(clips)
      .groupBy(clips.status);
    
    const statusMap: Record<string, number> = {};
    statusCountsResult.forEach(s => {
      statusMap[s.status] = s.count;
    });
    
    return NextResponse.json({
      clips: formattedClips,
      total: totalCount[0]?.count || 0,
      page,
      limit,
      totalPages: Math.ceil((totalCount[0]?.count || 0) / limit),
      statusCounts: {
        pending: statusMap["PENDING"] || 0,
        rendering: statusMap["RENDERING"] || 0,
        ready: statusMap["READY"] || 0,
        failed: statusMap["FAILED"] || 0,
        archived: statusMap["ARCHIVED"] || 0,
      },
    });
  } catch (error: any) {
    console.error("Error fetching clips:", error);
    if (error.message === "Unauthorized" || error.message.includes("Forbidden")) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH - Update clip status (approve/reject/archive)
export async function PATCH(request: NextRequest) {
  try {
    await requireAdmin();
    
    const body = await request.json();
    const { clipId, status } = body;
    
    if (!clipId || !status) {
      return NextResponse.json(
        { error: "Clip ID and status are required" },
        { status: 400 }
      );
    }
    
    // Check if clip exists
    const existingClip = await db
      .select()
      .from(clips)
      .where(eq(clips.id, clipId))
      .limit(1);
    
    if (existingClip.length === 0) {
      return NextResponse.json({ error: "Clip not found" }, { status: 404 });
    }
    
    // Update clip status
    const updatedClip = await db
      .update(clips)
      .set({ 
        status: status.toUpperCase(),
        updatedAt: new Date(),
      })
      .where(eq(clips.id, clipId))
      .returning();
    
    return NextResponse.json({
      clip: updatedClip[0],
    });
  } catch (error: any) {
    console.error("Error updating clip:", error);
    if (error.message === "Unauthorized" || error.message.includes("Forbidden")) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
