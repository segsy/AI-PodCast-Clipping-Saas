import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if current user is an admin
    const isAdmin = (session.user as any).isAdmin === true;
    
    if (!isAdmin) {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    // Get search parameter for filtering by email
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    let query = db.select({
      id: users.id,
      email: users.email,
      name: users.name,
      image: users.image,
      createdAt: users.createdAt,
    }).from(users);

    if (email) {
      query = query.where(eq(users.email, email)) as typeof query;
    }

    const userList = await query.limit(50);

    return NextResponse.json({ users: userList });
  } catch (error) {
    console.error("[LIST USERS ERROR]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
