import { NextRequest, NextResponse } from "next/server";
import { db, cmsPages } from "@/db";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth";

// GET - Get a specific CMS page
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();

    const page = await db
      .select()
      .from(cmsPages)
      .where(eq(cmsPages.id, params.id))
      .limit(1);

    if (page.length === 0) {
      return NextResponse.json(
        { error: "Page not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(page[0]);
  } catch (error: any) {
    console.error("Error fetching CMS page:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch CMS page" },
      { status: 500 }
    );
  }
}

// PUT - Update a CMS page
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();

    const body = await request.json();
    const { title, slug, content, status, seo, visibility, publishedAt } = body;

    // Check if slug already exists (excluding current page)
    if (slug) {
      const existingPage = await db
        .select()
        .from(cmsPages)
        .where(eq(cmsPages.slug, slug))
        .limit(1);

      if (existingPage.length > 0 && existingPage[0].id !== params.id) {
        return NextResponse.json(
          { error: "Slug already exists" },
          { status: 400 }
        );
      }
    }

    const updateData: any = {
      updatedAt: new Date(),
    };

    if (title !== undefined) updateData.title = title;
    if (slug !== undefined) updateData.slug = slug;
    if (content !== undefined) updateData.content = content;
    if (status !== undefined) updateData.status = status;
    if (seo !== undefined) updateData.seo = seo;
    if (visibility !== undefined) updateData.visibility = visibility;
    if (publishedAt !== undefined) updateData.publishedAt = publishedAt ? new Date(publishedAt) : null;

    const updatedPage = await db
      .update(cmsPages)
      .set(updateData)
      .where(eq(cmsPages.id, params.id))
      .returning();

    if (updatedPage.length === 0) {
      return NextResponse.json(
        { error: "Page not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedPage[0]);
  } catch (error: any) {
    console.error("Error updating CMS page:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update CMS page" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a CMS page
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();

    const deletedPage = await db
      .delete(cmsPages)
      .where(eq(cmsPages.id, params.id))
      .returning();

    if (deletedPage.length === 0) {
      return NextResponse.json(
        { error: "Page not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting CMS page:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete CMS page" },
      { status: 500 }
    );
  }
}