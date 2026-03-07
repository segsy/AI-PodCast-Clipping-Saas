import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { uploads, projects, workspaces } from "@/db/schema";
import { eq, desc, count, and, sql } from "drizzle-orm";
import { getActiveWorkspaceId, getCurrentUserId } from "@/lib/auth";

// GET - List all uploads for workspace
export async function GET(request: NextRequest) {
  try {
    const workspaceId = await getActiveWorkspaceId();
    
    if (!workspaceId) {
      return NextResponse.json(
        { error: "Workspace ID is required" },
        { status: 400 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const projectId = searchParams.get("projectId");
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    if (!workspaceId) {
      return NextResponse.json(
        { error: "Workspace ID is required" },
        { status: 400 }
      );
    }

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
    const workspaceId = await getActiveWorkspaceId();
    const userId = await getCurrentUserId();
    
    if (!workspaceId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    const { projectId, filename, contentType, bytes, s3Key, durationSec } = body;

    if (!projectId || !filename || !contentType || !bytes || !s3Key) {
      return NextResponse.json(
        { error: "Project ID, filename, contentType, bytes, and s3Key are required" },
        { status: 400 }
      );
    }

    const newUpload = await db
      .insert(uploads)
      .values({
        id: `upload_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        workspaceId,
        projectId,
        filename,
        contentType,
        bytes,
        s3Key,
        status: "UPLOAD_COMPLETE",
        durationSec,
        createdBy: userId || "unknown",
      })
      .returning();

    return NextResponse.json(newUpload[0], { status: 201 });
  } catch (error) {
    console.error("Error creating upload:", error);
    return NextResponse.json(
      { error: "Failed to create upload" },
      { status: 500 }
    );
  }
}
