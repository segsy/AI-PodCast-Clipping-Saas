import { NextRequest, NextResponse } from "next/server";
import { db, cmsResources } from "@/db";
import { eq, desc, and, sql } from "drizzle-orm";

// GET - Fetch published CMS resources for frontend
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get("type");
    const tag = searchParams.get("tag");
    const limit = parseInt(searchParams.get("limit") || "20");
    const featured = searchParams.get("featured") === "true";

    const conditions = [eq(cmsResources.status, "PUBLISHED")];

    // Add type filter if specified
    if (type) {
      conditions.push(eq(cmsResources.type, type as any));
    }

    // Add tag filter if specified (simplified for now)
    if (tag) {
      conditions.push(sql`${cmsResources.tags} @> ARRAY[${tag}]`);
    }

    const whereClause = and(...conditions);

    const resources = await db
      .select({
        id: cmsResources.id,
        title: cmsResources.title,
        slug: cmsResources.slug,
        type: cmsResources.type,
        excerpt: cmsResources.excerpt,
        coverS3Key: cmsResources.coverS3Key,
        body: cmsResources.body,
        tags: cmsResources.tags,
        authorName: cmsResources.authorName,
        publishedAt: cmsResources.publishedAt,
        seo: cmsResources.seo,
      })
      .from(cmsResources)
      .where(whereClause)
      .orderBy(desc(cmsResources.publishedAt))
      .limit(limit);

    // Transform the data for frontend consumption
    const transformedResources = resources.map(resource => ({
      id: resource.id,
      title: resource.title,
      slug: resource.slug,
      type: resource.type,
      excerpt: resource.excerpt,
      coverImage: resource.coverS3Key, // Assuming this is a URL or can be transformed
      content: resource.body,
      tags: resource.tags,
      author: resource.authorName,
      publishedAt: resource.publishedAt,
      seo: resource.seo,
    }));

    // If featured is requested, return the first item as featured and rest as regular
    if (featured && transformedResources.length > 0) {
      return NextResponse.json({
        featured: transformedResources[0],
        resources: transformedResources.slice(1),
      });
    }

    return NextResponse.json({ resources: transformedResources });
  } catch (error: any) {
    console.error("Error fetching CMS resources:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch resources" },
      { status: 500 }
    );
  }
}