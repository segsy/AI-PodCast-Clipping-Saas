import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { uploads, projects } from "@/db/schema";
import { eq, desc, count, and } from "drizzle-orm";

// GET - List all uploads for workspace
export async function GET(request: NextRequest) {
  try {
    // First try to get workspace ID from query params (client-side)
    const searchParams = request.nextUrl.searchParams;
    let workspaceId = searchParams.get("workspaceId");

    // If not in query params, try header
    if (!workspaceId) {
      workspaceId = request.headers.get("x-workspace-id");
    }
    
    // Fallback to demo workspace for development
    if (!workspaceId) {
      workspaceId = "demo-workspace";
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

    try {
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

      const stats = {
        total: totalCount[0]?.count || 0,
        completed: statusCounts.find(s => s.status === "UPLOAD_COMPLETE")?.count || 0,
        uploading: statusCounts.find(s => s.status === "UPLOADING")?.count || 0,
        failed: statusCounts.find(s => s.status === "FAILED")?.count || 0,
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
    } catch (dbError) {
      console.error("Database error fetching uploads:", dbError);
      // Return empty response for demo mode
      return NextResponse.json({
        uploads: [],
        total: 0,
        stats: { total: 0, completed: 0, uploading: 0, failed: 0 },
        page,
        limit,
        demo: true
      });
    }
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

    // Get workspace from body, query params, or header
    let workspaceId = bodyWorkspaceId || request.nextUrl.searchParams.get("workspaceId");
    if (!workspaceId) {
      workspaceId = request.headers.get("x-workspace-id");
    }
    // Fallback to demo workspace
    if (!workspaceId) {
      workspaceId = "demo-workspace";
    }
    
    // Get userId from body or header
    let userId = bodyUserId || request.headers.get("x-user-id");
    if (!userId) {
      userId = "demo-user";
    }

    if (!projectId || !filename || !contentType || !bytes) {
      return NextResponse.json(
        { error: "Project ID, filename, contentType, and bytes are required" },
        { status: 400 }
      );
    }

    try {
      const newUpload = await db
        .insert(uploads)
        .values({
          id: `upload_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          workspaceId,
          projectId,
          filename,
          contentType,
          bytes,
          s3Key: s3Key || `uploads/${workspaceId}/${filename}`,
          status: "UPLOAD_COMPLETE",
          durationSec,
          createdBy: userId,
        })
        .returning();

      return NextResponse.json(newUpload[0], { status: 201 });
    } catch (dbError) {
      console.error("Database error creating upload:", dbError);
      // Return mock response for demo
      return NextResponse.json({
        id: `upload_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        workspaceId,
        projectId,
        filename,
        contentType,
        bytes,
        status: "UPLOAD_COMPLETE",
        demo: true
      }, { status: 201 });
    }
  } catch (error) {
    console.error("Error creating upload:", error);
    return NextResponse.json(
      { error: "Failed to create upload" },
      { status: 500 }
    );
  }
}

// DELETE - Delete an upload
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    let workspaceId = searchParams.get("workspaceId");
    
    if (!workspaceId) {
      workspaceId = request.headers.get("x-workspace-id");
    }
    
    if (!workspaceId) {
      workspaceId = "demo-workspace";
    }
    
    const uploadId = searchParams.get("id");
    
    if (!uploadId) {
      return NextResponse.json(
        { error: "Upload ID is required" },
        { status: 400 }
      );
    }
    
    try {
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
    } catch (dbError) {
      console.error("Database error deleting upload:", dbError);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting upload:", error);
    return NextResponse.json(
      { error: "Failed to delete upload" },
      { status: 500 }
    );
  }
}
