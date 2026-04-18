import { NextRequest, NextResponse } from "next/server";
import { db, cmsPages, users } from "@/db";
import { eq, desc, like, or, and, count } from "drizzle-orm";
import { requireAdmin, getActiveWorkspaceId } from "@/lib/auth";

// GET - List all CMS pages
export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status");

    const offset = (page - 1) * limit;

    // Build where conditions
    let whereClause = undefined;
    const conditions = [];

    if (search) {
      conditions.push(
        or(
          like(cmsPages.title, `%${search}%`),
          like(cmsPages.slug, `%${search}%`)
        )
      );
    }

    if (status) {
      conditions.push(eq(cmsPages.status, status as any));
    }

    if (conditions.length > 0) {
      whereClause = and(...conditions);
    }

    // Get total count
    const totalCount = await db
      .select({ count: count() })
      .from(cmsPages)
      .where(whereClause);

    const total = totalCount[0].count;
    const totalPages = Math.ceil(total / limit);

    // Get pages with creator info
    const pages = await db
      .select({
        id: cmsPages.id,
        title: cmsPages.title,
        slug: cmsPages.slug,
        content: cmsPages.content,
        status: cmsPages.status,
        publishedAt: cmsPages.publishedAt,
        createdAt: cmsPages.createdAt,
        updatedAt: cmsPages.updatedAt,
        createdBy: {
          name: users.name,
          email: users.email,
        },
      })
      .from(cmsPages)
      .leftJoin(users, eq(cmsPages.createdBy, users.id))
      .where(whereClause)
      .orderBy(desc(cmsPages.updatedAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json({
      pages,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (error: any) {
    console.error("Error fetching CMS pages:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch CMS pages" },
      { status: 500 }
    );
  }
}

// POST - Create a new CMS page
export async function POST(request: NextRequest) {
  try {
    const session = await requireAdmin();
    const workspaceId = await getActiveWorkspaceId();

    const body = await request.json();
    const { title, slug, content, status, seo, visibility, publishedAt } = body;

    if (!title || !slug) {
      return NextResponse.json(
        { error: "Title and slug are required" },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingPage = await db
      .select()
      .from(cmsPages)
      .where(eq(cmsPages.slug, slug))
      .limit(1);

    if (existingPage.length > 0) {
      return NextResponse.json(
        { error: "Slug already exists" },
        { status: 400 }
      );
    }

    const newPage = await db
      .insert(cmsPages)
      .values({
        id: crypto.randomUUID(),
        workspaceId,
        title,
        slug,
        content,
        status: status || "DRAFT",
        seo: seo || {},
        visibility: visibility || {},
        publishedAt: publishedAt ? new Date(publishedAt) : null,
      })
      .returning();

    return NextResponse.json(newPage[0]);
  } catch (error: any) {
    console.error("Error creating CMS page:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create CMS page" },
      { status: 500 }
    );
  }
}