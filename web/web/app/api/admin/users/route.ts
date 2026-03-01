import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users, adminUsersTable, workspaceMembers } from "@/db/schema";
import { eq, desc, like, or, and, count, asc } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth";

// GET - List all users with pagination and search
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
          like(users.name, `%${search}%`),
          like(users.email, `%${search}%`)
        )
      );
    }
    
    // Get total count
    const totalCount = await db
      .select({ count: count() })
      .from(users)
      .where(whereClause);
    
    // Get users
    const sortColumn = sortBy === "email" ? users.email : 
                       sortBy === "name" ? users.name : 
                       users.createdAt;
    
    let allUsers;
    if (sortOrder === "asc") {
      allUsers = await db
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
        .where(whereClause)
        .orderBy(asc(sortColumn))
        .limit(limit)
        .offset(offset);
    } else {
      allUsers = await db
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
        .where(whereClause)
        .orderBy(desc(sortColumn))
        .limit(limit)
        .offset(offset);
    }
    
    // Get admin roles for users
    const adminRoles = await db.select().from(adminUsersTable);
    
    // Get workspace counts for each user
    const userWorkspaceCounts = await db
      .select({
        userId: workspaceMembers.userId,
        count: count(),
      })
      .from(workspaceMembers)
      .groupBy(workspaceMembers.userId);
    
    // Map admin roles to users
    const adminRoleMap = new Map(adminRoles.map(a => [a.userId, a.role]));
    const workspaceCountMap = new Map(userWorkspaceCounts.map(w => [w.userId, w.count]));
    
    // Format users with additional info
    const formattedUsers = allUsers.map(user => ({
      id: user.id,
      name: user.name || "Unknown",
      email: user.email,
      image: user.image || user.avatarUrl,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      role: adminRoleMap.get(user.id) || null,
      workspaceCount: workspaceCountMap.get(user.id) || 0,
      status: "Active",
    }));
    
    return NextResponse.json({
      users: formattedUsers,
      total: totalCount[0]?.count || 0,
      page,
      limit,
      totalPages: Math.ceil((totalCount[0]?.count || 0) / limit),
    });
  } catch (error: any) {
    console.error("Error fetching users:", error);
    if (error.message === "Unauthorized" || error.message.includes("Forbidden")) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST - Create a new user (admin can create users)
export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    
    const body = await request.json();
    const { email, name, password, role } = body;
    
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }
    
    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    
    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }
    
    // Hash password
    const { hash } = await import("bcryptjs");
    const hashedPassword = await hash(password, 12);
    
    // Create user
    const newUser = await db
      .insert(users)
      .values({
        id: `user_${Date.now()}`,
        email,
        name: name || email.split("@")[0],
        password: hashedPassword,
      })
      .returning();
    
    // If role is provided, grant admin role
    if (role && ["SUPER_ADMIN", "ADMIN", "SUPPORT", "ANALYST"].includes(role)) {
      await db
        .insert(adminUsersTable)
        .values({
          userId: newUser[0].id,
          role,
        });
    }
    
    return NextResponse.json({
      user: {
        ...newUser[0],
        role: role || null,
      },
    });
  } catch (error: any) {
    console.error("Error creating user:", error);
    if (error.message === "Unauthorized" || error.message.includes("Forbidden")) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
