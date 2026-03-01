import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { hash } from "bcryptjs";
import { ensureDefaultWorkspaceForUser } from "@/server/auth";

export async function POST(req: Request) {
  try {
    console.log("[SIGNUP] Starting sign-up process...");
    const { email, password, name } = await req.json();
    console.log("[SIGNUP] Received data:", { email, name: name || "(not provided)" });

    if (!email || !password) {
      console.log("[SIGNUP] Validation failed: missing email or password");
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    console.log("[SIGNUP] Checking for existing user...");
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    console.log("[SIGNUP] Existing user check result:", existingUser.length > 0 ? "User found" : "No user found");

    if (existingUser.length > 0) {
      console.log("[SIGNUP] User already exists, returning 400");
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Hash password
    console.log("[SIGNUP] Hashing password...");
    const hashedPassword = await hash(password, 12);
    console.log("[SIGNUP] Password hashed successfully");
    const userId = `user_${crypto.randomUUID()}`;
    console.log("[SIGNUP] Generated user ID:", userId);

    // Create user
    console.log("[SIGNUP] Inserting user into database...");
    await db.insert(users).values({
      id: userId,
      email,
      name: name || null,
      password: hashedPassword,
    });
    console.log("[SIGNUP] User inserted successfully");

    // Try to create default workspace for the user (optional - don't fail if this errors)
    try {
      console.log("[SIGNUP] Creating default workspace...");
      await ensureDefaultWorkspaceForUser(userId, name || email);
      console.log("[SIGNUP] Default workspace created successfully");
    } catch (workspaceError) {
      console.error("[SIGNUP] Workspace creation failed:", workspaceError);
    }

    console.log("[SIGNUP] Sign-up completed successfully for:", email);
    return NextResponse.json(
      { message: "User created successfully", userId },
      { status: 201 }
    );
  } catch (error) {
    console.error("[SIGNUP] Sign-up error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: String(error) },
      { status: 500 }
    );
  }
}
