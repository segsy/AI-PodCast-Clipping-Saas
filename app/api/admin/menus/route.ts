import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { db } from '@/db';
import { cmsMenus } from '@/db/schema';
import { eq, count } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const category = searchParams.get("category");

    const whereClause = category ? eq(cmsMenus.category, category) : undefined;

    const menus = await db
      .select()
      .from(cmsMenus)
      .where(whereClause)
      .limit(limit)
      .offset((page - 1) * limit)
      .orderBy(cmsMenus.sortOrder);

    const totalCount = await db
      .select({ count: count() })
      .from(cmsMenus)
      .where(whereClause);

    return NextResponse.json({
      menus,
      total: totalCount[0]?.count || 0,
      page,
      limit,
    });
  } catch (error) {
    console.error('Error fetching menus:', error);
    return NextResponse.json(
      { error: 'Failed to fetch menus' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();

    const body = await request.json();
    const { category, name, href, description, icon, sortOrder, isActive } = body;

    if (!category || !name || !href) {
      return NextResponse.json(
        { error: 'category, name, and href are required' },
        { status: 400 }
      );
    }

    const newMenu = await db.insert(cmsMenus).values({
      id: crypto.randomUUID(),
      workspaceId: 'ws_8a548caf-02c3-4f40-ac85-1c193fa4ee5a',
      category,
      name,
      href,
      description,
      icon,
      sortOrder: sortOrder || 0,
      isActive: isActive ?? true,
      createdBy: 'user_bfcbc510-843e-4b1f-a32a-b1feeb9b4a28',
    }).returning();

    return NextResponse.json(newMenu[0]);
  } catch (error) {
    console.error('Error creating menu:', error);
    return NextResponse.json(
      { error: 'Failed to create menu' },
      { status: 500 }
    );
  }
}