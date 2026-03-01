import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { workspaces, workspaceMembers, users, subscriptions, creditsBalance } from "@/db/schema";
import { eq, desc, like, or, and, count, asc } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth";

// GET - List all workspaces with pagination and search
export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search") || "";
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";
    
    const offset = (page - 1) * limit;
    
    // Build where conditions
    let whereClause;
    if (search) {
      whereClause = and(
        or(
          like(workspaces.name, `%${search}%`),
          like(workspaces.slug, `%${search}%`)
        )
      );
    }
    
    // Get total count
    const totalCount = await db
      .select({ count: count() })
      .from(workspaces)
      .where(whereClause);
    
    // Get workspaces
    let allWorkspaces;
    if (sortOrder === "asc") {
      allWorkspaces = await db
        .select()
        .from(workspaces)
        .where(whereClause)
        .orderBy(asc(workspaces.createdAt))
        .limit(limit)
        .offset(offset);
    } else {
      allWorkspaces = await db
        .select()
        .from(workspaces)
        .where(whereClause)
        .orderBy(desc(workspaces.createdAt))
        .limit(limit)
        .offset(offset);
    }
    
    // Get member counts for each workspace
    const workspaceIds = allWorkspaces.map(w => w.id);
    let memberCounts: any[] = [];
    let ownerInfos: any[] = [];
    
    if (workspaceIds.length > 0) {
      // Get member counts
      memberCounts = await db
        .select({
          workspaceId: workspaceMembers.workspaceId,
          count: count(),
        })
        .from(workspaceMembers)
        .where(or(...workspaceIds.map(id => eq(workspaceMembers.workspaceId, id))))
        .groupBy(workspaceMembers.workspaceId);
      
      // Get owner info
      ownerInfos = await db
        .select({
          id: users.id,
          name: users.name,
          email: users.email,
        })
        .from(users)
        .where(or(...allWorkspaces.map(w => eq(users.id, w.createdBy))));
    }
    
    // Get subscription and credits info for each workspace
    let subscriptionInfos: any[] = [];
    let creditsInfos: any[] = [];
    
    if (workspaceIds.length > 0) {
      subscriptionInfos = await db
        .select()
        .from(subscriptions)
        .where(or(...workspaceIds.map(id => eq(subscriptions.workspaceId, id))));
      
      creditsInfos = await db
        .select()
        .from(creditsBalance)
        .where(or(...workspaceIds.map(id => eq(creditsBalance.workspaceId, id))));
    }
    
    // Map data
    const memberCountMap = new Map(memberCounts.map(m => [m.workspaceId, m.count]));
    const ownerMap = new Map(ownerInfos.map(o => [o.id, o]));
    const subscriptionMap = new Map(subscriptionInfos.map(s => [s.workspaceId, s]));
    const creditsMap = new Map(creditsInfos.map(c => [c.workspaceId, c]));
    
    // Format workspaces
    const formattedWorkspaces = allWorkspaces.map(workspace => {
      const owner = ownerMap.get(workspace.createdBy);
      const subscription = subscriptionMap.get(workspace.id);
      const credits = creditsMap.get(workspace.id);
      
      return {
        id: workspace.id,
        name: workspace.name,
        slug: workspace.slug,
        createdBy: workspace.createdBy,
        ownerName: owner?.name || "Unknown",
        ownerEmail: owner?.email || "",
        memberCount: memberCountMap.get(workspace.id) || 0,
        subscription: subscription ? {
          status: subscription.status,
          planId: subscription.planId,
          interval: subscription.interval,
        } : null,
        credits: credits?.balance || 0,
        createdAt: workspace.createdAt,
        updatedAt: workspace.updatedAt,
      };
    });
    
    return NextResponse.json({
      workspaces: formattedWorkspaces,
      total: totalCount[0]?.count || 0,
      page,
      limit,
      totalPages: Math.ceil((totalCount[0]?.count || 0) / limit),
    });
  } catch (error: any) {
    console.error("Error fetching workspaces:", error);
    if (error.message === "Unauthorized" || error.message.includes("Forbidden")) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST - Create a new workspace
export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    
    const body = await request.json();
    const { name, slug, createdBy } = body;
    
    if (!name || !slug || !createdBy) {
      return NextResponse.json(
        { error: "Name, slug, and createdBy are required" },
        { status: 400 }
      );
    }
    
    // Check if slug already exists
    const existingWorkspace = await db
      .select()
      .from(workspaces)
      .where(eq(workspaces.slug, slug))
      .limit(1);
    
    if (existingWorkspace.length > 0) {
      return NextResponse.json(
        { error: "Workspace with this slug already exists" },
        { status: 400 }
      );
    }
    
    // Create workspace
    const newWorkspace = await db
      .insert(workspaces)
      .values({
        id: `ws_${Date.now()}`,
        name,
        slug,
        createdBy,
      })
      .returning();
    
    // Add creator as owner member
    await db
      .insert(workspaceMembers)
      .values({
        workspaceId: newWorkspace[0].id,
        userId: createdBy,
        role: "OWNER",
        status: "ACTIVE",
      });
    
    // Initialize credits balance
    await db
      .insert(creditsBalance)
      .values({
        workspaceId: newWorkspace[0].id,
        balance: 0,
      });
    
    return NextResponse.json({
      workspace: newWorkspace[0],
    });
  } catch (error: any) {
    console.error("Error creating workspace:", error);
    if (error.message === "Unauthorized" || error.message.includes("Forbidden")) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
