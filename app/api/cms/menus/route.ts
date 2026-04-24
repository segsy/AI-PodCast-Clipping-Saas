import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { cmsMenus } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const menus = await db
      .select()
      .from(cmsMenus)
      .where(eq(cmsMenus.isActive, true))
      .orderBy(cmsMenus.sortOrder);

    // Group by category
    const grouped = menus.reduce((acc, menu) => {
      const category = menu.category;
      if (!acc[category]) acc[category] = [];
      acc[category].push(menu);
      return acc;
    }, {} as Record<string, typeof menus>);

    return NextResponse.json({ menus: grouped });
  } catch (error) {
    console.error('Error fetching menus:', error);
    return NextResponse.json(
      { error: 'Failed to fetch menus' },
      { status: 500 }
    );
  }
}