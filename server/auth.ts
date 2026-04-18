import NextAuth, { NextAuthOptions } from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/db";
import { neon } from "@neondatabase/serverless";
import { users, workspaces, workspaceMembers, adminUsersTable, accounts } from "@/db/schema";
import { eq, and } from "drizzle-orm";

// Create a separate SQL connection for raw queries
// We'll create the SQL connection lazily to avoid issues at module load time
let sql: any = null;

function getSql() {
  if (!sql) {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      console.error("❌ DATABASE_URL is not defined in auth.ts");
      throw new Error("DATABASE_URL is required for authentication");
    }
    sql = neon(databaseUrl);
  }
  return sql;
}

// Helper function to create a default workspace for new users
export async function ensureDefaultWorkspaceForUser(userId: string, name: string) {
  const workspaceId = `ws_${crypto.randomUUID()}`;
  const workspaceName = `${name}'s Workspace`;
  const slug = `workspace-${Date.now()}`;

  // Create the workspace
  await db.insert(workspaces).values({
    id: workspaceId,
    name: workspaceName,
    slug,
    createdBy: userId,
  });

  // Add the user as owner of the workspace
  await db.insert(workspaceMembers).values({
    workspaceId,
    userId,
    role: "OWNER",
    status: "ACTIVE",
  });

  return workspaceId;
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  
  // Use JWT sessions (no database adapter needed)
  session: {
    strategy: "jwt",
  },

  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: "openid email profile",
        },
      },
    }),
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        // Find user in database
        const existingUser = await db
          .select()
          .from(users)
          .where(eq(users.email, credentials.email))
          .limit(1)
          .then((rows) => rows[0] || null);

        if (!existingUser || !existingUser.password) {
          throw new Error("Invalid email or password");
        }

        // Import bcrypt for password comparison
        const { compare } = await import("bcryptjs");
        const isValidPassword = await compare(credentials.password, existingUser.password);

        if (!isValidPassword) {
          throw new Error("Invalid email or password");
        }

        return {
          id: existingUser.id,
          email: existingUser.email,
          name: existingUser.name,
          image: existingUser.image,
        };
      }
    }),
  ],

  callbacks: {
    async signIn({ user, account, profile }) {
      console.log("[AUTH DEBUG] signIn callback triggered:", { 
        provider: account?.provider, 
        email: user.email,
        name: user.name,
        image: user.image,
        hasProfile: !!profile,
        accountId: account?.id,
        accountEmail: account?.email
      });
      
      try {
        if (account?.provider === "credentials") {
          console.log("[AUTH DEBUG] Processing credentials login");
          // For credentials login, verify user exists in database
          const existingUser = await db
            .select()
            .from(users)
            .where(eq(users.email, user.email!))
            .limit(1)
            .then((rows) => rows[0] || null);
          
          if (!existingUser) {
            console.log("[AUTH DEBUG] Credentials login failed: user not found");
            return false; // Deny login if user not found
          }
          
          // Check if user has a workspace, if not create one
          const userWorkspaces = await db
            .select()
            .from(workspaceMembers)
            .where(eq(workspaceMembers.userId, existingUser.id))
            .limit(1);
          
          if (userWorkspaces.length === 0) {
            console.log("[AUTH DEBUG] Creating workspace for credentials user:", existingUser.id);
            const userName = existingUser.name || existingUser.email || 'User';
            await ensureDefaultWorkspaceForUser(existingUser.id, userName);
          }
          
          // Update user object with actual ID from database
          user.id = existingUser.id;
          console.log("[AUTH DEBUG] Credentials login success:", existingUser.id);
          return true;
        }

        // For OAuth providers (Google, GitHub), create or update user in database
        // Get email from any available source
        const userEmail = user.email || account?.email || profile?.email;
        
        if (userEmail) {
          console.log("[AUTH DEBUG] Processing OAuth user:", userEmail, "provider:", account?.provider);
          
          // Query the user - use a simple raw query to avoid drizzle ORM issues
          console.log("[AUTH DEBUG] Querying users table for:", userEmail);
          
          // Use raw SQL to avoid any ORM column mapping issues
          const result = await getSql()`SELECT id, email, name, avatar_url 
             FROM users 
             WHERE email = ${userEmail} 
             LIMIT 1`;
          
          const existingUser = result[0] || null;
          console.log("[AUTH DEBUG] Existing user found:", !!existingUser);

          let dbUserId: string;

          if (!existingUser) {
            // Create new user
            const newUserId: string = `user_${crypto.randomUUID()}`;
            console.log("[AUTH DEBUG] Creating new user:", newUserId);
            
            await getSql()`INSERT INTO users (id, email, name) VALUES (${newUserId}, ${userEmail}, ${user.name || null})`;

            // Create default workspace for new user
            console.log("[AUTH DEBUG] Creating workspace for user:", newUserId);
            const userName = typeof user.name === "string" ? user.name : null;
            const email = typeof userEmail === "string" ? userEmail : null;
            const workspaceName = userName || email || "User";
            await ensureDefaultWorkspaceForUser(newUserId, workspaceName);

            // Update user.id for session
            dbUserId = newUserId;
            console.log("[AUTH DEBUG] New user created successfully:", newUserId);
          } else {
            // Update existing user info
            console.log("[AUTH DEBUG] Updating existing user:", existingUser.id as string);
            await getSql()`UPDATE users SET name = ${user.name || null} WHERE id = ${existingUser.id as string}`;
            
            // Update user.id for session
            dbUserId = existingUser.id as string;
            console.log("[AUTH DEBUG] User updated successfully:", existingUser.id as string);
          }

          // Store the OAuth account in the accounts table
          if (account && dbUserId) {
            console.log("[AUTH DEBUG] Storing OAuth account:", account.provider, account.providerAccountId);
            
            // Use raw SQL to insert/update the accounts table
            await getSql()`
              INSERT INTO accounts (
                user_id, 
                type, 
                provider, 
                provider_account_id, 
                refresh_token, 
                access_token, 
                expires_at, 
                token_type, 
                scope, 
                id_token, 
                session_state
              ) VALUES (
                ${dbUserId}, 
                ${account.type || 'oauth'}, 
                ${account.provider}, 
                ${account.providerAccountId}, 
                ${account.refresh_token || null}, 
                ${account.access_token || null}, 
                ${account.expires_at || null}, 
                ${account.token_type || null}, 
                ${account.scope || null}, 
                ${account.id_token || null}, 
                ${account.session_state || null}
              )
              ON CONFLICT (provider, provider_account_id) DO UPDATE SET
                refresh_token = EXCLUDED.refresh_token,
                access_token = EXCLUDED.access_token,
                expires_at = EXCLUDED.expires_at,
                token_type = EXCLUDED.token_type,
                scope = EXCLUDED.scope,
                id_token = EXCLUDED.id_token,
                session_state = EXCLUDED.session_state
            `;
            console.log("[AUTH DEBUG] OAuth account stored successfully");
          }

          // Update user.id for session
          user.id = dbUserId;
        } else {
          console.log("[AUTH DEBUG] No email available from any source!");
          console.log("[AUTH DEBUG] user.email:", user.email);
          console.log("[AUTH DEBUG] account?.email:", account?.email);
          console.log("[AUTH DEBUG] profile?.email:", profile?.email);
          // Return false to deny login if no email
          return false;
        }

        return true;
      } catch (error) {
        console.error("[AUTH DEBUG] Error in signIn callback:", error);
        throw error; // Re-throw to see the actual error
      }
    },
    async session({ session, token }) {
      // Attach userId for your guards
      if (session.user && token.sub) {
        (session.user as any).id = token.sub;
        
        // Get the user's active workspace
        try {
          const userWorkspaces = await db
            .select()
            .from(workspaceMembers)
            .where(eq(workspaceMembers.userId, token.sub))
            .limit(1);
          
          if (userWorkspaces.length > 0) {
            (session.user as any).activeWorkspaceId = userWorkspaces[0].workspaceId;
            console.log("[AUTH DEBUG] Workspace found for user:", token.sub, userWorkspaces[0].workspaceId);
          } else {
            // No workspace found - create one for the user
            console.log("[AUTH DEBUG] No workspace found for user, creating one:", token.sub);
            try {
              const user = await db.select().from(users).where(eq(users.id, token.sub)).limit(1);
              const userName = user[0]?.name || user[0]?.email || 'User';
              const newWorkspaceId = await ensureDefaultWorkspaceForUser(token.sub, userName);
              (session.user as any).activeWorkspaceId = newWorkspaceId;
              console.log("[AUTH DEBUG] Workspace created for user:", token.sub, newWorkspaceId);
            } catch (wsError) {
              console.error("[AUTH DEBUG] Error creating workspace:", wsError);
            }
          }
        } catch (error) {
          console.error("[AUTH DEBUG] Error fetching workspace:", error);
        }
      }
      // Attach admin flags from token
      if (token.isAdmin !== undefined) {
        (session.user as any).isAdmin = token.isAdmin;
      }
      if (token.isSuperAdmin !== undefined) {
        (session.user as any).isSuperAdmin = token.isSuperAdmin;
      }
      if (token.adminRole) {
        (session.user as any).adminRole = token.adminRole;
      }
      return session;
    },
    async jwt({ token, user, trigger, session }) {
      console.log("[AUTH DEBUG] jwt callback triggered:", { userId: user?.id, trigger, hasTokenSub: !!token.sub });
      
      try {
        if (user) {
          token.sub = user.id;
          
          // Check if user is an admin
          const adminUser = await db
            .select()
            .from(adminUsersTable)
            .where(eq(adminUsersTable.userId, user.id))
            .limit(1)
            .then((rows) => rows[0] || null);
          
          if (adminUser) {
            token.isAdmin = true;
            token.isSuperAdmin = adminUser.role === "SUPER_ADMIN";
            token.adminRole = adminUser.role;
          }
        }
        
        // If no user but token.sub exists (session refresh), keep the existing token.sub
        // This ensures the user ID persists across session refreshes
        if (!token.sub && user?.id) {
          token.sub = user.id;
        }
        
        // Handle session updates (e.g., after admin role is granted)
        if (trigger === "update" && session) {
          token.isAdmin = session.isAdmin;
          token.isSuperAdmin = session.isSuperAdmin;
          token.adminRole = session.adminRole;
        }
        
        return token;
      } catch (error) {
        console.error("[AUTH DEBUG] Error in jwt callback:", error);
        throw error;
      }
    },
  },

  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
};

export const auth = NextAuth(authOptions);
