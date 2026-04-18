import { NextRequest, NextResponse } from "next/server";
import { db, cmsPageSections } from "@/db";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth";

// GET - Get a specific CMS section
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();

    const section = await db
      .select()
      .from(cmsPageSections)
      .where(eq(cmsPageSections.id, params.id))
      .limit(1);

    if (section.length === 0) {
      return NextResponse.json(
        { error: "Section not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(section[0]);
  } catch (error: any) {
    console.error("Error fetching CMS section:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch CMS section" },
      { status: 500 }
    );
  }
}

// PUT - Update a CMS section
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();

    const body = await request.json();
    const { sortOrder, sectionType, props } = body;

    const updateData: any = {
      updatedAt: new Date(),
    };

    if (sortOrder !== undefined) updateData.sortOrder = sortOrder;
    if (sectionType !== undefined) updateData.sectionType = sectionType;
    if (props !== undefined) updateData.props = props;

    const updatedSection = await db
      .update(cmsPageSections)
      .set(updateData)
      .where(eq(cmsPageSections.id, params.id))
      .returning();

    if (updatedSection.length === 0) {
      return NextResponse.json(
        { error: "Section not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedSection[0]);
  } catch (error: any) {
    console.error("Error updating CMS section:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update CMS section" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a CMS section
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();

    const deletedSection = await db
      .delete(cmsPageSections)
      .where(eq(cmsPageSections.id, params.id))
      .returning();

    if (deletedSection.length === 0) {
      return NextResponse.json(
        { error: "Section not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting CMS section:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete CMS section" },
      { status: 500 }
    );
  }
}