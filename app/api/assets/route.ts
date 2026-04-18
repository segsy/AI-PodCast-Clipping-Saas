import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { assetLibrary } from "@/db/schema";
import { eq, and, desc, like } from "drizzle-orm";
import { getActiveWorkspaceId } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const workspaceId = await getActiveWorkspaceId();
    
    // Fallback to query param for backwards compatibility
    const queryWorkspaceId = request.nextUrl.searchParams.get("workspaceId");
    
    if (!workspaceId && !queryWorkspaceId) {
      return NextResponse.json({ error: "Workspace ID required" }, { status: 400 });
    }

    const useWorkspaceId = workspaceId || queryWorkspaceId;
    const type = request.nextUrl.searchParams.get("type");
    const folder = request.nextUrl.searchParams.get("folder");
    const search = request.nextUrl.searchParams.get("search");
    const page = parseInt(request.nextUrl.searchParams.get("page") || "1");
    const limit = parseInt(request.nextUrl.searchParams.get("limit") || "20");

    const conditions = [eq(assetLibrary.workspaceId, useWorkspaceId!)];

    if (type) {
      conditions.push(eq(assetLibrary.type, type));
    }

    if (folder) {
      conditions.push(eq(assetLibrary.folder, folder));
    }

    if (search) {
      conditions.push(like(assetLibrary.name, `%${search}%`));
    }

    const offset = (page - 1) * limit;

    const assets = await db
      .select()
      .from(assetLibrary)
      .where(and(...conditions))
      .orderBy(desc(assetLibrary.createdAt))
      .limit(limit)
      .offset(offset);

    const totalCount = await db
      .select({ count: assetLibrary.id })
      .from(assetLibrary)
      .where(and(...conditions));

    // Get unique folders - useWorkspaceId is guaranteed to be defined at this point
    const folders = await db
      .selectDistinct({ folder: assetLibrary.folder })
      .from(assetLibrary)
      .where(eq(assetLibrary.workspaceId, useWorkspaceId as string));

    return NextResponse.json({
      assets,
      pagination: {
        page,
        limit,
        total: totalCount.length,
        pages: Math.ceil(totalCount.length / limit),
      },
      folders: folders.map(f => f.folder).filter(Boolean),
    });
  } catch (error) {
    console.error("Error fetching assets:", error);
    return NextResponse.json({ error: "Failed to fetch assets" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const workspaceId = await getActiveWorkspaceId();
    const body = await request.json();
    
    // Fallback to body workspaceId for backwards compatibility
    const useWorkspaceId = workspaceId || body.workspaceId;
    
    const {
      name,
      type,
      s3Key,
      url,
      thumbnailUrl,
      bytes,
      contentType,
      width,
      height,
      durationSec,
      folder,
      tags,
      createdBy,
    } = body;

    if (!useWorkspaceId || !name || !type || !s3Key) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const id = `asset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const [newAsset] = await db
      .insert(assetLibrary)
      .values({
        id,
        workspaceId: useWorkspaceId!,
        name,
        type,
        s3Key,
        url,
        thumbnailUrl,
        bytes,
        contentType,
        width,
        height,
        durationSec,
        folder,
        tags: tags || [],
        createdBy,
      })
      .returning();

    return NextResponse.json({ asset: newAsset }, { status: 201 });
  } catch (error) {
    console.error("Error creating asset:", error);
    return NextResponse.json({ error: "Failed to create asset" }, { status: 500 });
  }
}
