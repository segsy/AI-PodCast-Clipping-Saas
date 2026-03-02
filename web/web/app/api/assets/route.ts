import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { assetLibrary } from "@/db/schema";
import { eq, and, desc, like } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const workspaceId = searchParams.get("workspaceId");
    const type = searchParams.get("type");
    const folder = searchParams.get("folder");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    if (!workspaceId) {
      return NextResponse.json({ error: "Workspace ID required" }, { status: 400 });
    }

    const conditions = [eq(assetLibrary.workspaceId, workspaceId)];

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

    // Get unique folders
    const folders = await db
      .selectDistinct({ folder: assetLibrary.folder })
      .from(assetLibrary)
      .where(eq(assetLibrary.workspaceId, workspaceId));

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
    const body = await request.json();
    const {
      workspaceId,
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

    if (!workspaceId || !name || !type || !s3Key) {
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
        workspaceId,
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
