import { NextRequest, NextResponse } from "next/server";
import { db, cmsResources, users } from "@/db";
import { eq, desc, like, or, and, count } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth";

// GET - List all CMS resources
export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search") || "";
    const type = searchParams.get("type");
    const status = searchParams.get("status");

    const offset = (page - 1) * limit;

    // Build where conditions
    let whereClause = undefined;
    const conditions = [];

    if (search) {
      conditions.push(
        or(
          like(cmsResources.title, `%${search}%`),
          like(cmsResources.slug, `%${search}%`),
          like(cmsResources.excerpt, `%${search}%`)
        )
      );
    }

    if (type) {
      conditions.push(eq(cmsResources.type, type as any));
    }

    if (status) {
      conditions.push(eq(cmsResources.status, status as any));
    }

    if (conditions.length > 0) {
      whereClause = and(...conditions);
    }

    // Get total count
    const totalCount = await db
      .select({ count: count() })
      .from(cmsResources)
      .where(whereClause);

    const total = totalCount[0].count;
    const totalPages = Math.ceil(total / limit);

    // Get resources with creator info
    const resources = await db
      .select({
        id: cmsResources.id,
        title: cmsResources.title,
        slug: cmsResources.slug,
        type: cmsResources.type,
        status: cmsResources.status,
        excerpt: cmsResources.excerpt,
        coverS3Key: cmsResources.coverS3Key,
        tags: cmsResources.tags,
        authorName: cmsResources.authorName,
        publishedAt: cmsResources.publishedAt,
        createdAt: cmsResources.createdAt,
        updatedAt: cmsResources.updatedAt,
        createdBy: {
          name: users.name,
          email: users.email,
        },
      })
      .from(cmsResources)
      .leftJoin(users, eq(cmsResources.createdBy, users.id))
      .where(whereClause)
      .orderBy(desc(cmsResources.updatedAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json({
      resources,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (error: any) {
    console.error("Error fetching CMS resources:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch CMS resources" },
      { status: 500 }
    );
  }
}

// POST - Create a new CMS resource
export async function POST(request: NextRequest) {
  try {
    await requireAdmin();

    const body = await request.json();
    const { type, title, slug, status, excerpt, coverS3Key, body: contentBody, tags, authorName, publishedAt, seo } = body;

    if (!type || !title || !slug) {
      return NextResponse.json(
        { error: "Type, title and slug are required" },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingResource = await db
      .select()
      .from(cmsResources)
      .where(eq(cmsResources.slug, slug))
      .limit(1);

    if (existingResource.length > 0) {
      return NextResponse.json(
        { error: "Slug already exists" },
        { status: 400 }
      );
    }

    const newResource = await db
      .insert(cmsResources)
      .values({
        id: crypto.randomUUID(),
        type,
        title,
        slug,
        status: status || "DRAFT",
        excerpt,
        coverS3Key,
        body: contentBody || {},
        tags: tags || [],
        authorName,
        publishedAt: publishedAt ? new Date(publishedAt) : null,
        seo: seo || {},
      })
      .returning();

    return NextResponse.json(newResource[0]);
  } catch (error: any) {
    console.error("Error creating CMS resource:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create CMS resource" },
      { status: 500 }
    );
  }
}