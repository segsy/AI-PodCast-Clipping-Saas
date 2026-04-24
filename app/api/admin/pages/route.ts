import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { db } from '@/db';
import { cmsPages } from '@/db/schema';
import { eq, count } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const whereClause = undefined;

    const pages = await db
      .select({
        id: cmsPages.id,
        title: cmsPages.title,
        slug: cmsPages.slug,
        status: cmsPages.status,
        createdAt: cmsPages.createdAt,
        updatedAt: cmsPages.updatedAt,
      })
      .from(cmsPages)
      .where(whereClause)
      .limit(limit)
      .offset((page - 1) * limit)
      .orderBy(cmsPages.createdAt);

    const totalCount = await db
      .select({ count: count() })
      .from(cmsPages)
      .where(whereClause);

    return NextResponse.json({
      pages,
      total: totalCount[0]?.count || 0,
    });
  } catch (error) {
    console.error('Error fetching pages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pages' },
      { status: 500 }
    );
  }
}