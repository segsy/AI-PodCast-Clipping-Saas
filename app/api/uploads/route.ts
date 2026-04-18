import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { uploads, projects, workspaces } from "@/db/schema";
import { eq, desc, count, and, sql } from "drizzle-orm";
import { getActiveWorkspaceId, getCurrentUserId } from "@/lib/auth";

// GET - List all uploads for workspace
export async function GET(request: NextRequest) {
  try {
    // First try to get workspace ID from query params (client-side)
    const searchParams = request.nextUrl.searchParams;
    let workspaceId = searchParams.get("workspaceId");

    // If not in query params, try to get from session (server-side)
    if (!workspaceId) {
      workspaceId = await getActiveWorkspaceId();
    }
    
    // If still no workspaceId, try header (set by client from localStorage)
    if (!workspaceId) {
      workspaceId = request.headers.get("x-workspace-id") || "demo-workspace";
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

    const conditions = [eq(uploads.workspaceId, workspaceId)];

    if (projectId) {
      conditions.push(eq(uploads.projectId, projectId));
    }

    if (status) {
      conditions.push(eq(uploads.status, status.toUpperCase() as any));
    }

    const whereClause = and(...conditions);

    // Get total count
    const totalCount = await db
      .select({ count: count() })
      .from(uploads)
      .where(whereClause);

    // Get uploads with project info
    const allUploads = await db
      .select({
        id: uploads.id,
        filename: uploads.filename,
        contentType: uploads.contentType,
        bytes: uploads.bytes,
        durationSec: uploads.durationSec,
        status: uploads.status,
        s3Key: uploads.s3Key,
        createdAt: uploads.createdAt,
        updatedAt: uploads.updatedAt,
        projectId: uploads.projectId,
        projectName: projects.name,
      })
      .from(uploads)
      .leftJoin(projects, eq(uploads.projectId, projects.id))
      .where(whereClause)
      .orderBy(desc(uploads.createdAt))
      .limit(limit)
      .offset((page - 1) * limit);

    // Get status counts
    const statusCounts = await db
      .select({
        status: uploads.status,
        count: count(),
      })
      .from(uploads)
      .where(eq(uploads.workspaceId, workspaceId))
      .groupBy(uploads.status);

    // Get total size
    const totalSizeResult = await db
      .select({
        totalBytes: sql<number>`sum(${uploads.bytes})`,
      })
      .from(uploads)
      .where(eq(uploads.workspaceId, workspaceId));

    const stats = {
      total: totalCount[0]?.count || 0,
      completed: statusCounts.find(s => s.status === "UPLOAD_COMPLETE")?.count || 0,
      uploading: statusCounts.find(s => s.status === "UPLOADING")?.count || 0,
      failed: statusCounts.find(s => s.status === "FAILED")?.count || 0,
      totalSize: totalSizeResult[0]?.totalBytes || 0,
    };

    return NextResponse.json({
      uploads: allUploads,
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
    console.error("Error fetching uploads:", error);
    return NextResponse.json(
      { error: "Failed to fetch uploads" },
      { status: 500 }
    );
  }
}

// POST - Create a new upload record
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { workspaceId: bodyWorkspaceId, userId: bodyUserId, projectId, filename, contentType, bytes, s3Key, durationSec } = body;

    // Try to get workspace from body first, then from session
    let workspaceId = bodyWorkspaceId;
    if (!workspaceId) {
      workspaceId = await getActiveWorkspaceId();
    }
    
    let userId = bodyUserId;
    if (!userId) {
      userId = await getCurrentUserId();
    }
    
    // If no workspaceId from body or session, check localStorage fallback from client
    // This allows demo mode to work
    if (!workspaceId) {
      // Try to get from header (set by client from localStorage)
      workspaceId = request.headers.get("x-workspace-id") || "demo-workspace";
    }
    
    if (!userId) {
      userId = request.headers.get("x-user-id") || "demo-user";
    }
    
    if (!workspaceId) {
      return NextResponse.json(
        { error: "Workspace ID is required" },
        { status: 400 }
      );
    }

    if (!projectId || !filename || !contentType || !bytes || !s3Key) {
      return NextResponse.json(
        { error: "Project ID, filename, contentType, bytes, and s3Key are required" },
        { status: 400 }
      );
    }

    // Check if workspace exists, create if it doesn't (for demo mode)
    const existingWorkspace = await db
      .select({ id: workspaces.id })
      .from(workspaces)
      .where(eq(workspaces.id, workspaceId))
      .limit(1);

    if (existingWorkspace.length === 0) {
      // Create the workspace for demo mode
      try {
        await db.insert(workspaces).values({
          id: workspaceId,
          name: "Demo Workspace",
          slug: workspaceId,
          createdBy: userId || "unknown",
        });
      } catch (wsError) {
        console.error("Error creating workspace:", wsError);
        // Continue anyway - might already exist from another request
      }
    }

    // Check if project exists, create if it doesn't (for demo mode)
    const existingProject = await db
      .select({ id: projects.id })
      .from(projects)
      .where(eq(projects.id, projectId))
      .limit(1);

    if (existingProject.length === 0) {
      // Create a default project for demo mode
      try {
        await db.insert(projects).values({
          id: projectId,
          name: "Demo Project",
          workspaceId: workspaceId,
          createdBy: userId || "unknown",
        });
      } catch (projError) {
        console.error("Error creating project:", projError);
        // Continue anyway - might already exist from another request
      }
    }

    const newUpload = await db
      .insert(uploads)
      .values({
        id: `upload_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        workspaceId,
        projectId,
        filename,
        contentType,
        bytes: Number(bytes) || 0,
        s3Key,
        status: "UPLOAD_COMPLETE",
        durationSec,
        createdBy: userId || "unknown",
      })
      .returning();

    return NextResponse.json(newUpload[0], { status: 201 });
  } catch (error) {
    console.error("Error creating upload:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Failed to create upload: ${errorMessage}` },
      { status: 500 }
    );
  }
}

// DELETE - Delete an upload
export async function DELETE(request: NextRequest) {
  try {
    let workspaceId = await getActiveWorkspaceId();
    
    // If no workspaceId from session, try header
    if (!workspaceId) {
      workspaceId = request.headers.get("x-workspace-id") || "demo-workspace";
    }
    
    if (!workspaceId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const searchParams = request.nextUrl.searchParams;
    const uploadId = searchParams.get("id");
    
    if (!uploadId) {
      return NextResponse.json(
        { error: "Upload ID is required" },
        { status: 400 }
      );
    }
    
    // Verify the upload belongs to the current workspace before deleting
    const existingUpload = await db
      .select({ id: uploads.id, workspaceId: uploads.workspaceId })
      .from(uploads)
      .where(eq(uploads.id, uploadId))
      .limit(1);
    
    if (!existingUpload.length || existingUpload[0].workspaceId !== workspaceId) {
      return NextResponse.json(
        { error: "Upload not found or access denied" },
        { status: 404 }
      );
    }
    
    // Delete the upload record
    await db
      .delete(uploads)
      .where(eq(uploads.id, uploadId));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting upload:", error);
    return NextResponse.json(
      { error: "Failed to delete upload" },
      { status: 500 }
    );
  }
}
