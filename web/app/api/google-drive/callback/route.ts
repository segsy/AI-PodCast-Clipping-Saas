import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserId, getActiveWorkspaceId } from "@/lib/auth";
import { exchangeCodeForTokens, storeGoogleDriveTokens } from "@/lib/google-drive";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");

    if (error) {
      console.error("Google Drive OAuth error:", error);
      return NextResponse.redirect(
        `/error?message=Google Drive authorization failed: ${error}`
      );
    }

    if (!code) {
      return NextResponse.json(
        { error: "Authorization code is required" },
        { status: 400 }
      );
    }

    // Verify state parameter (basic CSRF protection)
    // In production, you'd store the state in session and verify it matches
    // For now, we'll extract userId and workspaceId from state
    const stateParts = state?.split("_") || [];
    if (stateParts.length < 3) {
      return NextResponse.json(
        { error: "Invalid state parameter" },
        { status: 400 }
      );
    }

    const userId = await getCurrentUserId();
    const workspaceId = await getActiveWorkspaceId();

    if (!userId || !workspaceId) {
      return NextResponse.redirect(
        "/error?message=Authentication required. Please log in again."
      );
    }

    const clientId = process.env.GOOGLE_DRIVE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_DRIVE_CLIENT_SECRET;
    const redirectUri = process.env.GOOGLE_DRIVE_REDIRECT_URI;

    if (!clientId || !clientSecret || !redirectUri) {
      return NextResponse.redirect(
        "/error?message=Google Drive OAuth not configured"
      );
    }

    // Exchange code for tokens
    const tokens = await exchangeCodeForTokens(
      clientId,
      clientSecret,
      redirectUri,
      code
    );

    // Store tokens in database
    await storeGoogleDriveTokens(
      userId,
      workspaceId,
      tokens.accessToken,
      tokens.refreshToken,
      tokens.tokenType,
      tokens.expiresAt,
      tokens.scope
    );

    // Redirect back to the app with success message
    return NextResponse.redirect("/?google_drive_connected=true");
  } catch (error) {
    console.error("Error in Google Drive OAuth callback:", error);
    return NextResponse.redirect(
      "/error?message=Failed to connect Google Drive. Please try again."
    );
  }
}
