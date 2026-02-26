import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users, adminUsersTable, workspaceMembers, workspaces } from "@/db/schema";
import { eq, count } from "drizzle-orm";
import { requireAdmin, isSuperAdmin } from "@/lib/auth";

// GET - Get single user by ID
export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    await requireAdmin();
    const userId = context.params.id;
    
    // Get user
    const user = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        image: users.image,
        avatarUrl: users.avatarUrl,
        emailVerified: users.emailVerified,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);
    
    if (user.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    // Get admin role
    const adminRole = await db
      .select()
      .from(adminUsersTable)
      .where(eq(adminUsersTable.userId, userId))
      .limit(1);
    
    // Get workspace memberships
    const memberships = await db
      .select({
        workspaceId: workspaceMembers.workspaceId,
        role: workspaceMembers.role,
        status: workspaceMembers.status,
        createdAt: workspaceMembers.createdAt,
      })
      .from(workspaceMembers)
      .where(eq(workspaceMembers.userId, userId));
    
    // Get workspace details
    const workspaceIds = memberships.map(m => m.workspaceId);
    let workspaceDetails: any[] = [];
    if (workspaceIds.length > 0) {
      workspaceDetails = await db
        .select({
          id: workspaces.id,
          name: workspaces.name,
          slug: workspaces.slug,
          createdBy: workspaces.createdBy,
          createdAt: workspaces.createdAt,
        })
        .from(workspaces)
        .where(eq(workspaces.id, workspaceIds[0]));
    }
    
    return NextResponse.json({
      user: {
        ...user[0],
        role: adminRole[0]?.role || null,
        memberships: memberships,
        workspaces: workspaceDetails,
      },
    });
  } catch (error: any) {
    console.error("Error fetching user:", error);
    if (error.message === "Unauthorized" || error.message.includes("Forbidden")) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT - Update user
export async function PUT(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    await requireAdmin();
    const userId = context.params.id;
    
    const body = await request.json();
    const { name, email, role, status } = body;
    
    // Check if user exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);
    
    if (existingUser.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    // Update user fields
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (Object.keys(updateData).length > 0) {
      updateData.updatedAt = new Date();
    }
    
    let updatedUser;
    if (Object.keys(updateData).length > 0) {
      updatedUser = await db
        .update(users)
        .set(updateData)
        .where(eq(users.id, userId))
        .returning();
    }
    
    // Update admin role if provided
    if (role !== undefined) {
      const isSuperAdminUser = await isSuperAdmin();
      
      if (!isSuperAdminUser && role === "SUPER_ADMIN") {
        return NextResponse.json(
          { error: "Only super admins can assign SUPER_ADMIN role" },
          { status: 403 }
        );
      }
      
      if (role) {
        await db
          .insert(adminUsersTable)
          .values({
            userId,
            role,
          })
          .onConflictDoUpdate({
            target: adminUsersTable.userId,
            set: { role },
          });
      } else {
        // Remove admin role
        await db
          .delete(adminUsersTable)
          .where(eq(adminUsersTable.userId, userId));
      }
    }
    
    // Get updated user with role
    const finalUser = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);
    
    const adminRole = await db
      .select()
      .from(adminUsersTable)
      .where(eq(adminUsersTable.userId, userId))
      .limit(1);
    
    return NextResponse.json({
      user: {
        ...finalUser[0],
        role: adminRole[0]?.role || null,
      },
    });
  } catch (error: any) {
    console.error("Error updating user:", error);
    if (error.message === "Unauthorized" || error.message.includes("Forbidden")) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE - Delete user
export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const session = await requireAdmin();
    const userId = context.params.id;
    
    // Prevent self-deletion
    if (session.user.id === userId) {
      return NextResponse.json(
        { error: "Cannot delete your own account" },
        { status: 400 }
      );
    }
    
    // Check if user exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);
    
    if (existingUser.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    // Delete user (cascade will handle related records)
    await db
      .delete(users)
      .where(eq(users.id, userId));
    
    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting user:", error);
    if (error.message === "Unauthorized" || error.message.includes("Forbidden")) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
