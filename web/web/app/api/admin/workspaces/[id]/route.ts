import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { workspaces, workspaceMembers, users, subscriptions, creditsBalance, projects, uploads, clips } from "@/db/schema";
import { eq, count, or } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth";

// GET - Get single workspace by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id: workspaceId } = await params;
    
    // Get workspace
    const workspace = await db
      .select()
      .from(workspaces)
      .where(eq(workspaces.id, workspaceId))
      .limit(1);
    
    if (workspace.length === 0) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
    }
    
    // Get owner info
    const owner = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
      })
      .from(users)
      .where(eq(users.id, workspace[0].createdBy))
      .limit(1);
    
    // Get members
    const members = await db
      .select({
        userId: workspaceMembers.userId,
        role: workspaceMembers.role,
        status: workspaceMembers.status,
        createdAt: workspaceMembers.createdAt,
      })
      .from(workspaceMembers)
      .where(eq(workspaceMembers.workspaceId, workspaceId));
    
    // Get member details
    const memberUserIds = members.map(m => m.userId);
    let memberDetails: any[] = [];
    if (memberUserIds.length > 0) {
      const conditions = memberUserIds.map(id => eq(users.id, id));
      memberDetails = await db
        .select({
          id: users.id,
          name: users.name,
          email: users.email,
          image: users.image,
        })
        .from(users)
        .where(or(...conditions));
    }
    
    // Get subscription
    const subscription = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.workspaceId, workspaceId))
      .limit(1);
    
    // Get credits
    const credits = await db
      .select()
      .from(creditsBalance)
      .where(eq(creditsBalance.workspaceId, workspaceId))
      .limit(1);
    
    // Get stats
    const projectCount = await db
      .select({ count: count() })
      .from(projects)
      .where(eq(projects.workspaceId, workspaceId));
    
    const uploadCount = await db
      .select({ count: count() })
      .from(uploads)
      .where(eq(uploads.workspaceId, workspaceId));
    
    const clipCount = await db
      .select({ count: count() })
      .from(clips)
      .where(eq(clips.workspaceId, workspaceId));
    
    const memberDetailMap = new Map(memberDetails.map(m => [m.id, m]));
    
    return NextResponse.json({
      workspace: {
        ...workspace[0],
        owner: owner[0] || null,
        members: members.map(m => ({
          ...m,
          user: memberDetailMap.get(m.userId) || null,
        })),
        subscription: subscription[0] || null,
        credits: credits[0] || null,
        stats: {
          projects: projectCount[0]?.count || 0,
          uploads: uploadCount[0]?.count || 0,
          clips: clipCount[0]?.count || 0,
        },
      },
    });
  } catch (error: any) {
    console.error("Error fetching workspace:", error);
    if (error.message === "Unauthorized" || error.message.includes("Forbidden")) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT - Update workspace
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id: workspaceId } = await params;
    
    const body = await request.json();
    const { name, slug } = body;
    
    // Check if workspace exists
    const existingWorkspace = await db
      .select()
      .from(workspaces)
      .where(eq(workspaces.id, workspaceId))
      .limit(1);
    
    if (existingWorkspace.length === 0) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
    }
    
    // Check if slug is taken by another workspace
    if (slug && slug !== existingWorkspace[0].slug) {
      const slugExists = await db
        .select()
        .from(workspaces)
        .where(eq(workspaces.slug, slug))
        .limit(1);
      
      if (slugExists.length > 0) {
        return NextResponse.json(
          { error: "Slug already in use" },
          { status: 400 }
        );
      }
    }
    
    // Update workspace
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (slug !== undefined) updateData.slug = slug;
    updateData.updatedAt = new Date();
    
    const updatedWorkspace = await db
      .update(workspaces)
      .set(updateData)
      .where(eq(workspaces.id, workspaceId))
      .returning();
    
    return NextResponse.json({
      workspace: updatedWorkspace[0],
    });
  } catch (error: any) {
    console.error("Error updating workspace:", error);
    if (error.message === "Unauthorized" || error.message.includes("Forbidden")) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE - Delete workspace
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id: workspaceId } = await params;
    
    // Check if workspace exists
    const existingWorkspace = await db
      .select()
      .from(workspaces)
      .where(eq(workspaces.id, workspaceId))
      .limit(1);
    
    if (existingWorkspace.length === 0) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
    }
    
    // Delete workspace (cascade will handle related records)
    await db
      .delete(workspaces)
      .where(eq(workspaces.id, workspaceId));
    
    return NextResponse.json({ message: "Workspace deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting workspace:", error);
    if (error.message === "Unauthorized" || error.message.includes("Forbidden")) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
