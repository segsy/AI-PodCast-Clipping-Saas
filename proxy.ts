import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Get the token from the request
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;
    
    // Check if user is trying to access admin routes
    if (pathname.startsWith("/admin")) {
      // Check if user has admin role
      const isAdmin = token?.isAdmin === true;
      
      if (!isAdmin) {
        // Redirect non-admin users away from admin routes
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }
    
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to auth pages
        const pathname = req.nextUrl.pathname;
        if (pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up")) {
          return true;
        }
        
        // Allow access to API sign-up endpoint
        if (pathname.startsWith("/api/sign-up")) {
          return true;
        }
        
        // Allow access to public pages
        if (
          pathname === "/" ||
          pathname.startsWith("/api/auth") ||
          pathname.startsWith("/resources") ||
          pathname.startsWith("/features") ||
          pathname.startsWith("/solutions")
        ) {
          return true;
        }
        
        // For other pages, require authentication
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api/auth (auth routes - handled by NextAuth directly)
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
