import { NextRequest, NextResponse } from "next/server";
import { db, cmsPageSections } from "@/db";
import { eq, desc, and } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth";

// GET - List all CMS page sections
export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const searchParams = request.nextUrl.searchParams;
    const pageId = searchParams.get("pageId");

    let whereClause = undefined;
    if (pageId) {
      whereClause = eq(cmsPageSections.pageId, pageId);
    }

    const sections = await db
      .select()
      .from(cmsPageSections)
      .where(whereClause)
      .orderBy(cmsPageSections.sortOrder);

    return NextResponse.json({ sections });
  } catch (error: any) {
    console.error("Error fetching CMS sections:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch CMS sections" },
      { status: 500 }
    );
  }
}

// POST - Create a new CMS page section
export async function POST(request: NextRequest) {
  try {
    await requireAdmin();

    const body = await request.json();
    const { pageId, sortOrder, sectionType, props } = body;

    if (!pageId || !sectionType) {
      return NextResponse.json(
        { error: "pageId and sectionType are required" },
        { status: 400 }
      );
    }

    const newSection = await db
      .insert(cmsPageSections)
      .values({
        id: crypto.randomUUID(),
        pageId,
        sortOrder: sortOrder || 0,
        sectionType,
        props: props || {},
      })
      .returning();

    return NextResponse.json(newSection[0]);
  } catch (error: any) {
    console.error("Error creating CMS section:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create CMS section" },
      { status: 500 }
    );
  }
}