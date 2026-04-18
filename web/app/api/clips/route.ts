import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { clips, clipJobs, projects } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";

// GET - List clips by workspace
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const workspaceId = searchParams.get("workspaceId");
    const status = searchParams.get("status");
    const projectId = searchParams.get("projectId");

    if (!workspaceId) {
      return NextResponse.json({ error: "Workspace ID is required" }, { status: 400 });
    }

    const conditions = [eq(clips.workspaceId, workspaceId)];

    if (status) {
      conditions.push(eq(clips.status, status as typeof clips.status.enumValues[number]));
    }

    if (projectId) {
      conditions.push(eq(clips.projectId, projectId));
    }

    const whereClause = and(...conditions);

    // Get clips with project info
    const clipsList = await db
      .select({
        id: clips.id,
        title: clips.title,
        status: clips.status,
        startMs: clips.startMs,
        endMs: clips.endMs,
        projectId: clips.projectId,
        projectName: projects.name,
        createdAt: clips.createdAt,
      })
      .from(clips)
      .leftJoin(projects, eq(clips.projectId, projects.id))
      .where(whereClause)
      .orderBy(desc(clips.createdAt));

    return NextResponse.json({ clips: clipsList });
  } catch (error) {
    console.error("Error fetching clips:", error);
    return NextResponse.json({ error: "Failed to fetch clips" }, { status: 500 });
  }
}

// POST - Create a new clip
export async function POST(request: NextRequest) {
  let workspaceId = null;
  
  try {
    // First try to get workspace ID from request body
    const body = await request.json();
    workspaceId = body.workspaceId;
    
    // If not in body, try to get from query params
    if (!workspaceId) {
      workspaceId = request.nextUrl.searchParams.get("workspaceId");
    }
    
    // Fallback to localStorage-style header (for client-side requests)
    if (!workspaceId) {
      workspaceId = request.headers.get("x-workspace-id");
    }
    
    if (!workspaceId) {
      // Use demo workspace as fallback for development
      workspaceId = "demo-workspace";
    }
    
    const { projectId, uploadId, title, startMs, endMs, variant, templateId, captionStyleId, jobId } = body;

    if (!projectId) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 }
      );
    }

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
