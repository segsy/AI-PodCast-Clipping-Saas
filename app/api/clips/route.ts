import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { clips, clipJobs, projects, workspaces, clipAssets } from "@/db/schema";
import { eq, desc, count, and } from "drizzle-orm";
import { getActiveWorkspaceId } from "@/lib/auth";

// GET - List all clips for workspace
export async function GET(request: NextRequest) {
  try {
    // First try to get workspace ID from query params (client-side)
    const searchParams = request.nextUrl.searchParams;
    let workspaceId = searchParams.get("workspaceId");

    // If not in query params, try to get from session (server-side)
    if (!workspaceId) {
      workspaceId = await getActiveWorkspaceId();
    }
    
    if (!workspaceId) {
      return NextResponse.json(
        { error: "Workspace ID is required" },
        { status: 400 }
      );
    }

    const projectId = searchParams.get("projectId");
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const conditions = [eq(clips.workspaceId, workspaceId)];

    if (projectId) {
      conditions.push(eq(clips.projectId, projectId));
    }

    if (status) {
      conditions.push(eq(clips.status, status.toUpperCase() as any));
    }

    const whereClause = and(...conditions);

    // Get total count
    const totalCount = await db
      .select({ count: count() })
      .from(clips)
      .where(whereClause);

    // Get clips with project info
    const allClips = await db
      .select({
        id: clips.id,
        title: clips.title,
        startMs: clips.startMs,
        endMs: clips.endMs,
        status: clips.status,
        score: clips.score,
        variant: clips.variant,
        templateId: clips.templateId,
        createdAt: clips.createdAt,
        updatedAt: clips.updatedAt,
        projectId: clips.projectId,
        jobId: clips.jobId,
        projectName: projects.name,
      })
      .from(clips)
      .leftJoin(projects, eq(clips.projectId, projects.id))
      .where(whereClause)
      .orderBy(desc(clips.createdAt))
      .limit(limit)
      .offset((page - 1) * limit);

    // Get status counts
    const statusCounts = await db
      .select({
        status: clips.status,
        count: count(),
      })
      .from(clips)
      .where(eq(clips.workspaceId, workspaceId))
      .groupBy(clips.status);

    const stats = {
      total: totalCount[0]?.count || 0,
      published: statusCounts.find(s => s.status === "READY")?.count || 0,
      drafts: statusCounts.filter(s => s.status === "PENDING" || s.status === "RENDERING").reduce((acc, s) => acc + s.count, 0),
    };

    return NextResponse.json({
      clips: allClips,
      total: stats.total,
      stats,
      page,
      limit,
    }, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
        'Pragma': 'no-cache',
      },
    });
  } catch (error) {
    console.error("Error fetching clips:", error);
    return NextResponse.json(
      { error: "Failed to fetch clips" },
      { status: 500 }
    );
  }
}

// POST - Create a new clip
export async function POST(request: NextRequest) {
  let workspaceId = null;
  
  try {
    workspaceId = await getActiveWorkspaceId();
  } catch (authError) {
    console.error("Error getting workspace ID:", authError);
    return NextResponse.json(
      { error: "Authentication error" },
      { status: 401 }
    );
  }
  
  if (!workspaceId) {
    return NextResponse.json(
      { error: "Unauthorized - No active workspace" },
      { status: 401 }
    );
  }
  
  let body;
  try {
    body = await request.json();
  } catch (parseError) {
    console.error("Error parsing request body:", parseError);
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
  
  const { projectId, jobId, title, startMs, endMs, variant, templateId, captionStyleId, uploadId } = body;

  if (!projectId) {
    return NextResponse.json(
      { error: "Project ID is required" },
      { status: 400 }
    );
  }

  try {
    // If jobId is provided, verify it exists; otherwise create clip without job
    let finalJobId = jobId;
    
    // If we have an uploadId but no jobId, create a job first
    if (!jobId && uploadId) {
      try {
        const newJob = await db
          .insert(clipJobs)
          .values({
            id: `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            workspaceId,
            projectId,
            uploadId,
            status: "UPLOAD_READY",
            stage: "init",
            progress: 0,
            optionsJson: {},
            pipelineVersion: "v1",
            reservedCredits: 0,
            finalCredits: 0,
            failureRetryable: false,
            createdBy: "system",
          })
          .returning();
        finalJobId = newJob[0].id;
      } catch (jobError) {
        console.error("Error creating job:", jobError);
        // Continue without jobId if job creation fails
      }
    }

    const newClip = await db
      .insert(clips)
      .values({
        id: `clip_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        workspaceId,
        projectId,
        jobId: finalJobId || null,
        title: title || `Clip ${new Date().toISOString()}`,
        startMs: startMs || 0,
        endMs: endMs || 1000,
        status: "PENDING",
        variant,
        templateId,
        captionStyleId,
      })
      .returning();

    return NextResponse.json(newClip[0], { status: 201 });
  } catch (error) {
    console.error("Error creating clip:", error);
    return NextResponse.json(
      { error: "Failed to create clip" },
      { status: 500 }
    );
  }
}
