import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { brandTemplates, workspaces } from "@/db/schema";
import { eq, desc, count } from "drizzle-orm";
import { getActiveWorkspaceId } from "@/lib/auth";

// GET - List all brand templates for workspace
export async function GET(request: NextRequest) {
  try {
    const workspaceId = await getActiveWorkspaceId();

    if (!workspaceId) {
      return NextResponse.json(
        { error: "Workspace ID is required" },
        { status: 400 }
      );
    }

    // Get brand templates
    const templates = await db
      .select({
        id: brandTemplates.id,
        name: brandTemplates.name,
        config: brandTemplates.config,
        isDefault: brandTemplates.isDefault,
        createdAt: brandTemplates.createdAt,
        updatedAt: brandTemplates.updatedAt,
      })
      .from(brandTemplates)
      .where(eq(brandTemplates.workspaceId, workspaceId))
      .orderBy(desc(brandTemplates.createdAt));

    // Get total count
    const totalCount = await db
      .select({ count: count() })
      .from(brandTemplates)
      .where(eq(brandTemplates.workspaceId, workspaceId));

    return NextResponse.json({
      templates,
      total: totalCount[0]?.count || 0,
    });
  } catch (error) {
    console.error("Error fetching brand templates:", error);
    return NextResponse.json(
      { error: "Failed to fetch brand templates" },
      { status: 500 }
    );
  }
}

// POST - Create a new brand template
export async function POST(request: NextRequest) {
  try {
    const workspaceId = await getActiveWorkspaceId();
    
    if (!workspaceId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    const { name, config, isDefault } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    // If setting as default, unset other defaults
    if (isDefault) {
      await db
        .update(brandTemplates)
        .set({ isDefault: false })
        .where(eq(brandTemplates.workspaceId, workspaceId));
    }

    const newTemplate = await db
      .insert(brandTemplates)
      .values({
        id: `template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        workspaceId,
        name,
        config: config || {},
        isDefault: isDefault || false,
        createdBy: workspaceId, // Using workspaceId as createdBy since it's a workspace-level entity
      })
      .returning();

    return NextResponse.json(newTemplate[0], { status: 201 });
  } catch (error) {
    console.error("Error creating brand template:", error);
    return NextResponse.json(
      { error: "Failed to create brand template" },
      { status: 500 }
    );
  }
}

// PUT - Update a brand template
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, config, isDefault, workspaceId } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Template ID is required" },
        { status: 400 }
      );
    }

    // If setting as default, unset other defaults
    if (isDefault && workspaceId) {
      await db
        .update(brandTemplates)
        .set({ isDefault: false })
        .where(eq(brandTemplates.workspaceId, workspaceId));
    }

    const updateData: any = {
      updatedAt: new Date(),
    };

    if (name) updateData.name = name;
    if (config) updateData.config = config;
    if (isDefault !== undefined) updateData.isDefault = isDefault;

    const updatedTemplate = await db
      .update(brandTemplates)
      .set(updateData)
      .where(eq(brandTemplates.id, id))
      .returning();

    if (updatedTemplate.length === 0) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedTemplate[0]);
  } catch (error) {
    console.error("Error updating brand template:", error);
    return NextResponse.json(
      { error: "Failed to update brand template" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a brand template
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Template ID is required" },
        { status: 400 }
      );
    }

    const deleted = await db
      .delete(brandTemplates)
      .where(eq(brandTemplates.id, id))
      .returning();

    if (deleted.length === 0) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting brand template:", error);
    return NextResponse.json(
      { error: "Failed to delete brand template" },
      { status: 500 }
    );
  }
}
