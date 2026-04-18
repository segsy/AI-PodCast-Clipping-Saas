import NextAuth from "next-auth";
import { authOptions } from "@/server/auth";

// Create the NextAuth handler
const handler = NextAuth(authOptions);

// Export the handler for all HTTP methods
export { handler as GET, handler as POST };
