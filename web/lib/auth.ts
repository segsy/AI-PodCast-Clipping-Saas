import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { adminUsersTable, users } from "@/db/schema";
import { hash } from "bcryptjs";

// Get current session
// For NextAuth v4, use getServerSession with authOptions
export async function getCurrentSession() {
  return await getServerSession(authOptions);
}

// Check if current user is authenticated
export async function isAuthenticated() {
  const session = await getServerSession(authOptions);
  return !!session?.user;
}

// Get current user
export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;
  return session.user;
}

// Get current user ID
export async function getCurrentUserId(): Promise<string | null> {
  const session = await getServerSession(authOptions) as any;
  return session?.user?.id || null;
}

// Check if current user is admin
export async function isAdmin(): Promise<boolean> {
  const session = await getServerSession(authOptions);
  if (!session?.user) return false;
  return (session.user as any).isAdmin === true;
}

// Check if current user is super admin
export async function isSuperAdmin(): Promise<boolean> {
  const session = await getServerSession(authOptions);
  if (!session?.user) return false;
  return (session.user as any).isSuperAdmin === true;
}

// Get user's admin role
export async function getUserAdminRole(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;
  return (session.user as any).adminRole || null;
}

// Get user's active workspace ID
export async function getActiveWorkspaceId(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;
  return (session.user as any).activeWorkspaceId || null;
}

// Helper to require authentication
export async function requireAuth() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  return session;
}

// Helper to require admin role
export async function requireAdmin() {
  const session = await requireAuth();
  const isUserAdmin = (session.user as any).isAdmin === true;
  if (!isUserAdmin) {
    throw new Error("Forbidden - Admin access required");
  }
  return session;
}

// Helper to require super admin role
export async function requireSuperAdmin() {
  const session = await requireAuth();
  const isUserSuperAdmin = (session.user as any).isSuperAdmin === true;
  if (!isUserSuperAdmin) {
    throw new Error("Forbidden - Super Admin access required");
  }
  return session;
}

// Grant admin role to a user (for database operations)
export async function grantAdminRole(userId: string, role: "SUPER_ADMIN" | "ADMIN" | "SUPPORT" | "ANALYST" = "ADMIN") {
  await db.insert(adminUsersTable).values({
    userId,
    role,
  }).onConflictDoUpdate({
    target: adminUsersTable.userId,
    set: { role },
  });
}

// Remove admin role from a user
export async function removeAdminRole(userId: string) {
  await db.delete(adminUsersTable).where(eq(adminUsersTable.userId, userId));
}

// Create a new user with email/password (for sign-up)
export async function createUserWithPassword(
  email: string,
  password: string,
  name?: string
) {
  const hashedPassword = await hash(password, 12);
  const userId = `user_${crypto.randomUUID()}`;
  
  await db.insert(users).values({
    id: userId,
    email,
    name,
    password: hashedPassword,
  });
  
  return { id: userId, email, name };
}
