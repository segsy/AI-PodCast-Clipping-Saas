import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserId, getActiveWorkspaceId } from "@/lib/auth";
import { getAuthorizationUrl } from "@/lib/google-drive";

export async function GET(request: NextRequest) {
  try {
    const userId = await getCurrentUserId();
    const workspaceId = await getActiveWorkspaceId();
    
    if (!userId || !workspaceId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const clientId = process.env.GOOGLE_DRIVE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_DRIVE_CLIENT_SECRET;
    const redirectUri = process.env.GOOGLE_DRIVE_REDIRECT_URI;

    if (!clientId || !clientSecret || !redirectUri) {
      return NextResponse.json(
        { error: "Google Drive OAuth not configured" },
        { status: 500 }
      );
    }

    // Generate a state parameter to prevent CSRF
    const state = `${userId}_${workspaceId}_${Date.now()}`;
    
    const authUrl = getAuthorizationUrl(
      clientId,
      clientSecret,
      redirectUri,
      state
    );

    return NextResponse.json({ 
      authorizationUrl: authUrl,
      state 
    });
  } catch (error) {
    console.error("Error generating Google Drive auth URL:", error);
    return NextResponse.json(
      { error: "Failed to generate authorization URL" },
      { status: 500 }
    );
  }
}
