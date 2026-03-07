import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { workspaceMembers, users, workspaces, teamInvitations } from "@/db/schema";
import { eq, and, or, desc, count } from "drizzle-orm";
import { getActiveWorkspaceId, getCurrentUserId } from "@/lib/auth";

// GET - List all team members and pending invitations for workspace
export async function GET(request: NextRequest) {
  try {
    const workspaceId = await getActiveWorkspaceId();
    
    if (!workspaceId) {
      return NextResponse.json(
        { error: "Workspace ID is required" },
        { status: 400 }
      );
    }

    // Get workspace members with user details
    const members = await db
      .select({
        id: workspaceMembers.userId,
        role: workspaceMembers.role,
        status: workspaceMembers.status,
        createdAt: workspaceMembers.createdAt,
        email: users.email,
        name: users.name,
        image: users.image,
      })
      .from(workspaceMembers)
      .leftJoin(users, eq(workspaceMembers.userId, users.id))
      .where(eq(workspaceMembers.workspaceId, workspaceId));

    // Get pending invitations
    const invitations = await db
      .select()
      .from(teamInvitations)
      .where(
        and(
          eq(teamInvitations.workspaceId, workspaceId),
          eq(teamInvitations.status, "PENDING")
        )
      )
      .orderBy(desc(teamInvitations.createdAt));

    // Get stats
    const ownerCount = members.filter(m => m.role === "OWNER").length;
    const adminCount = members.filter(m => m.role === "ADMIN").length;
    const memberCount = members.filter(m => m.role === "MEMBER").length;
    const viewerCount = members.filter(m => m.role === "VIEWER").length;
    const pendingCount = invitations.length;

    // Transform members to include avatar initials
    const transformedMembers = members.map(member => ({
      ...member,
      avatar: member.name 
        ? member.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        : member.email?.slice(0, 2).toUpperCase() || '??',
      status: member.status === "ACTIVE" ? "active" : "inactive"
    }));

    // Transform invitations
    const transformedInvitations = invitations.map(inv => ({
      id: inv.id,
      email: inv.email,
      role: inv.role,
      status: inv.status.toLowerCase(),
      createdAt: inv.createdAt
    }));

    return NextResponse.json({
      members: transformedMembers,
      invitations: transformedInvitations,
      stats: {
        total: members.length,
        owners: ownerCount,
        admins: adminCount,
        members: memberCount,
        viewers: viewerCount,
        pending: pendingCount
      }
    });
  } catch (error) {
    console.error("Error fetching team:", error);
    return NextResponse.json(
      { error: "Failed to fetch team" },
      { status: 500 }
    );
  }
}

// POST - Invite a new team member
export async function POST(request: NextRequest) {
  try {
    const workspaceId = await getActiveWorkspaceId();
    const userId = await getCurrentUserId();
    
    if (!workspaceId || !userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { email, role } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Check if user is owner or admin
    const currentMember = await db
      .select()
      .from(workspaceMembers)
      .where(
        and(
          eq(workspaceMembers.workspaceId, workspaceId),
          eq(workspaceMembers.userId, userId)
        )
      )
      .limit(1);

    if (currentMember.length === 0) {
      return NextResponse.json(
        { error: "Not a member of this workspace" },
        { status: 403 }
      );
    }

    if (currentMember[0].role !== "OWNER" && currentMember[0].role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only owners and admins can invite members" },
        { status: 403 }
      );
    }

    // Check if user is already a member
    const existingMember = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingMember.length > 0) {
      // Check if already in workspace
      const existingWorkspaceMember = await db
        .select()
        .from(workspaceMembers)
        .where(
          and(
            eq(workspaceMembers.workspaceId, workspaceId),
            eq(workspaceMembers.userId, existingMember[0].id)
          )
        )
        .limit(1);

      if (existingWorkspaceMember.length > 0) {
        return NextResponse.json(
          { error: "User is already a member of this workspace" },
          { status: 400 }
        );
      }

      // Add directly as member
      const newMember = await db
        .insert(workspaceMembers)
        .values({
          workspaceId,
          userId: existingMember[0].id,
          role: role || "MEMBER",
          status: "ACTIVE"
        })
        .returning();

      return NextResponse.json({
        message: "Member added successfully",
        member: newMember[0]
      }, { status: 201 });
    }

    // Check for existing pending invitation
    const existingInvitation = await db
      .select()
      .from(teamInvitations)
      .where(
        and(
          eq(teamInvitations.workspaceId, workspaceId),
          eq(teamInvitations.email, email),
          eq(teamInvitations.status, "PENDING")
        )
      )
      .limit(1);

    if (existingInvitation.length > 0) {
      return NextResponse.json(
        { error: "Invitation already sent to this email" },
        { status: 400 }
      );
    }

    // Create invitation
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiry

    const invitation = await db
      .insert(teamInvitations)
      .values({
        id: `inv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        workspaceId,
        email,
        role: role || "MEMBER",
        status: "PENDING",
        invitedBy: userId,
        expiresAt
      })
      .returning();

    // TODO: Send invitation email

    return NextResponse.json({
      message: "Invitation sent successfully",
      invitation: invitation[0]
    }, { status: 201 });
  } catch (error) {
    console.error("Error inviting team member:", error);
    return NextResponse.json(
      { error: "Failed to invite team member" },
      { status: 500 }
    );
  }
}

// PUT - Update member role or respond to invitation
export async function PUT(request: NextRequest) {
  try {
    const workspaceId = await getActiveWorkspaceId();
    const userId = await getCurrentUserId();
    
    if (!workspaceId || !userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { action, memberId, invitationId, role, status } = body;

    // Handle invitation response (accept/cancel)
    if (action === "respondToInvitation" && invitationId) {
      const invitation = await db
        .select()
        .from(teamInvitations)
        .where(eq(teamInvitations.id, invitationId))
        .limit(1);

      if (invitation.length === 0) {
        return NextResponse.json(
          { error: "Invitation not found" },
          { status: 404 }
        );
      }

      if (invitation[0].status !== "PENDING") {
        return NextResponse.json(
          { error: "Invitation is no longer valid" },
          { status: 400 }
        );
      }

      if (new Date() > invitation[0].expiresAt) {
        await db
          .update(teamInvitations)
          .set({ status: "EXPIRED" })
          .where(eq(teamInvitations.id, invitationId));

        return NextResponse.json(
          { error: "Invitation has expired" },
          { status: 400 }
        );
      }

      // Find user by email
      const user = await db
        .select()
        .from(users)
        .where(eq(users.email, invitation[0].email))
        .limit(1);

      if (user.length === 0) {
        return NextResponse.json(
          { error: "User not found" },
          { status: 404 }
        );
      }

      if (status === "ACCEPTED") {
        // Add user as workspace member
        await db
          .insert(workspaceMembers)
          .values({
            workspaceId: invitation[0].workspaceId,
            userId: user[0].id,
            role: invitation[0].role,
            status: "ACTIVE"
          })
          .onConflictDoNothing();

        // Update invitation status
        await db
          .update(teamInvitations)
          .set({ status: "ACCEPTED" })
          .where(eq(teamInvitations.id, invitationId));

        return NextResponse.json({ message: "Invitation accepted" });
      } else {
        // Cancel invitation
        await db
          .update(teamInvitations)
          .set({ status: "CANCELLED" })
          .where(eq(teamInvitations.id, invitationId));

        return NextResponse.json({ message: "Invitation declined" });
      }
    }

    // Handle role update
    if (action === "updateRole" && memberId) {
      // Check if current user is owner or admin
      const currentMember = await db
        .select()
        .from(workspaceMembers)
        .where(
          and(
            eq(workspaceMembers.workspaceId, workspaceId),
            eq(workspaceMembers.userId, userId)
          )
        )
        .limit(1);

      if (currentMember.length === 0 || 
          (currentMember[0].role !== "OWNER" && currentMember[0].role !== "ADMIN")) {
        return NextResponse.json(
          { error: "Not authorized to update roles" },
          { status: 403 }
        );
      }

      // Cannot change owner role
      const targetMember = await db
        .select()
        .from(workspaceMembers)
        .where(
          and(
            eq(workspaceMembers.workspaceId, workspaceId),
            eq(workspaceMembers.userId, memberId)
          )
        )
        .limit(1);

      if (targetMember.length === 0) {
        return NextResponse.json(
          { error: "Member not found" },
          { status: 404 }
        );
      }

      if (targetMember[0].role === "OWNER") {
        return NextResponse.json(
          { error: "Cannot change owner role" },
          { status: 400 }
        );
      }

      // Update role
      await db
        .update(workspaceMembers)
        .set({ role })
        .where(
          and(
            eq(workspaceMembers.workspaceId, workspaceId),
            eq(workspaceMembers.userId, memberId)
          )
        );

      return NextResponse.json({ message: "Role updated successfully" });
    }

    return NextResponse.json(
      { error: "Invalid action" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error updating team:", error);
    return NextResponse.json(
      { error: "Failed to update team" },
      { status: 500 }
    );
  }
}

// DELETE - Remove a team member or cancel invitation
export async function DELETE(request: NextRequest) {
  try {
    const workspaceId = await getActiveWorkspaceId();
    const userId = await getCurrentUserId();
    
    if (!workspaceId || !userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const memberId = searchParams.get("memberId");
    const invitationId = searchParams.get("invitationId");

    // Check if current user is owner or admin
    const currentMember = await db
      .select()
      .from(workspaceMembers)
      .where(
        and(
          eq(workspaceMembers.workspaceId, workspaceId),
          eq(workspaceMembers.userId, userId)
        )
      )
      .limit(1);

    if (currentMember.length === 0 || 
        (currentMember[0].role !== "OWNER" && currentMember[0].role !== "ADMIN")) {
      return NextResponse.json(
        { error: "Not authorized to remove members" },
        { status: 403 }
      );
    }

    // Remove member
    if (memberId) {
      // Cannot remove owner
      const targetMember = await db
        .select()
        .from(workspaceMembers)
        .where(
          and(
            eq(workspaceMembers.workspaceId, workspaceId),
            eq(workspaceMembers.userId, memberId)
          )
        )
        .limit(1);

      if (targetMember.length > 0 && targetMember[0].role === "OWNER") {
        return NextResponse.json(
          { error: "Cannot remove owner" },
          { status: 400 }
        );
      }

      await db
        .delete(workspaceMembers)
        .where(
          and(
            eq(workspaceMembers.workspaceId, workspaceId),
            eq(workspaceMembers.userId, memberId)
          )
        );

      return NextResponse.json({ message: "Member removed successfully" });
    }

    // Cancel invitation
    if (invitationId) {
      await db
        .delete(teamInvitations)
        .where(eq(teamInvitations.id, invitationId));

      return NextResponse.json({ message: "Invitation cancelled successfully" });
    }

    return NextResponse.json(
      { error: "Member ID or Invitation ID required" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error removing team member:", error);
    return NextResponse.json(
      { error: "Failed to remove team member" },
      { status: 500 }
    );
  }
}
