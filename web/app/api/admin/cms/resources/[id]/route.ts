import { NextRequest, NextResponse } from "next/server";
import { db, cmsResources } from "@/db";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth";

// GET - Get a specific CMS resource
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();

    const resource = await db
      .select()
      .from(cmsResources)
      .where(eq(cmsResources.id, params.id))
      .limit(1);

    if (resource.length === 0) {
      return NextResponse.json(
        { error: "Resource not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(resource[0]);
  } catch (error: any) {
    console.error("Error fetching CMS resource:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch CMS resource" },
      { status: 500 }
    );
  }
}

// PUT - Update a CMS resource
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();

    const body = await request.json();
    const { type, title, slug, status, excerpt, coverS3Key, body: contentBody, tags, authorName, publishedAt, seo } = body;

    // Check if slug already exists (excluding current resource)
    if (slug) {
      const existingResource = await db
        .select()
        .from(cmsResources)
        .where(eq(cmsResources.slug, slug))
        .limit(1);

      if (existingResource.length > 0 && existingResource[0].id !== params.id) {
        return NextResponse.json(
          { error: "Slug already exists" },
          { status: 400 }
        );
      }
    }

    const updateData: any = {
      updatedAt: new Date(),
    };

    if (type !== undefined) updateData.type = type;
    if (title !== undefined) updateData.title = title;
    if (slug !== undefined) updateData.slug = slug;
    if (status !== undefined) updateData.status = status;
    if (excerpt !== undefined) updateData.excerpt = excerpt;
    if (coverS3Key !== undefined) updateData.coverS3Key = coverS3Key;
    if (contentBody !== undefined) updateData.body = contentBody;
    if (tags !== undefined) updateData.tags = tags;
    if (authorName !== undefined) updateData.authorName = authorName;
    if (publishedAt !== undefined) updateData.publishedAt = publishedAt ? new Date(publishedAt) : null;
    if (seo !== undefined) updateData.seo = seo;

    const updatedResource = await db
      .update(cmsResources)
      .set(updateData)
      .where(eq(cmsResources.id, params.id))
      .returning();

    if (updatedResource.length === 0) {
      return NextResponse.json(
        { error: "Resource not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedResource[0]);
  } catch (error: any) {
    console.error("Error updating CMS resource:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update CMS resource" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a CMS resource
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();

    const deletedResource = await db
      .delete(cmsResources)
      .where(eq(cmsResources.id, params.id))
      .returning();

    if (deletedResource.length === 0) {
      return NextResponse.json(
        { error: "Resource not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting CMS resource:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete CMS resource" },
      { status: 500 }
    );
  }
}