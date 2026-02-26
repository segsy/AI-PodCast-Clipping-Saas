import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { db } from "@/db";
import { adminUsersTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if current user is a super admin
    const isSuperAdmin = (session.user as any).isSuperAdmin === true;
    const isAdmin = (session.user as any).isAdmin === true;
    
    if (!isSuperAdmin && !isAdmin) {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { userId, role } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    // Validate role
    const validRoles = ["SUPER_ADMIN", "ADMIN", "SUPPORT", "ANALYST"];
    const userRole = validRoles.includes(role) ? role : "ADMIN";

    // Grant admin role to user
    await db
      .insert(adminUsersTable)
      .values({
        userId,
        role: userRole as any,
      })
      .onConflictDoUpdate({
        target: adminUsersTable.userId,
        set: { role: userRole as any },
      });

    return NextResponse.json({
      success: true,
      message: `Admin role '${userRole}' granted to user ${userId}`,
    });
  } catch (error) {
    console.error("[GRANT ROLE ERROR]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Return instructions for using this endpoint
  return NextResponse.json({
    message: "POST to this endpoint to grant admin role",
    body: {
      userId: "The user ID to grant admin access to",
      role: "SUPER_ADMIN | ADMIN | SUPPORT | ANALYST (default: ADMIN)",
    },
    example: {
      userId: "user_abc123",
      role: "SUPER_ADMIN",
    },
  });
}
