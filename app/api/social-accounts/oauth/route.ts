import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { socialAccounts } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { getActiveWorkspaceId } from "@/lib/auth";

// OAuth configuration for each platform
const OAUTH_CONFIG = {
  YOUTUBE: {
    authUrl: "https://accounts.google.com/o/oauth2/v2/auth",
    tokenUrl: "https://oauth2.googleapis.com/token",
    scopes: ["https://www.googleapis.com/auth/youtube.readonly"],
    apiBaseUrl: "https://www.googleapis.com/youtube/v3"
  },
  TIKTOK: {
    authUrl: "https://www.tiktok.com/v2/auth/authorize/",
    tokenUrl: "https://open.tiktokapis.com/v2/oauth/token/",
    scopes: ["user.info.basic", "video.upload", "video.list"]
  },
  FACEBOOK: {
    authUrl: "https://www.facebook.com/v18.0/dialog/oauth",
    tokenUrl: "https://graph.facebook.com/v18.0/oauth/access_token",
    scopes: ["pages_manage_posts", "pages_read_engagement"]
  },
  INSTAGRAM: {
    authUrl: "https://api.instagram.com/oauth/authorize",
    tokenUrl: "https://api.instagram.com/oauth/access_token",
    scopes: ["user_profile", "user_media"]
  },
  LINKEDIN: {
    authUrl: "https://www.linkedin.com/oauth/v2/authorization",
    tokenUrl: "https://www.linkedin.com/oauth/v2/accessToken",
    scopes: ["r_liteprofile", "w_member_social"]
  },
  TWITTER: {
    authUrl: "https://twitter.com/i/oauth2/authorize",
    tokenUrl: "https://api.twitter.com/2/oauth2/token",
    scopes: ["tweet.read", "tweet.write", "users.read"]
  }
};

type Platform = keyof typeof OAUTH_CONFIG;

// GET - Initiate OAuth flow (redirect user to platform)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const platform = searchParams.get("platform") as Platform;
    const action = searchParams.get("action");

    // For callback, handle the OAuth response
    if (action === "callback") {
      return handleOAuthCallback(request);
    }

    // Validate platform
    if (!platform || !OAUTH_CONFIG[platform]) {
      return NextResponse.json(
        { error: "Invalid platform" },
        { status: 400 }
      );
    }

    // Get workspace ID
    const workspaceId = await getActiveWorkspaceId();
    const queryWorkspaceId = searchParams.get("workspaceId");
    const useWorkspaceId = workspaceId || queryWorkspaceId;

    if (!useWorkspaceId) {
      return NextResponse.json(
        { error: "Workspace ID required" },
        { status: 400 }
      );
    }

    const config = OAUTH_CONFIG[platform];
    const clientId = getClientId(platform);
    const redirectUri = getRedirectUri(platform);

    if (!clientId) {
      return NextResponse.json(
        { error: `${platform} OAuth not configured. Please add OAuth credentials.` },
        { status: 500 }
      );
    }

    // Generate state for security
    const state = Buffer.from(JSON.stringify({
      workspaceId: useWorkspaceId,
      platform,
      timestamp: Date.now()
    })).toString("base64");

    // Build OAuth URL based on platform
    let authUrl: string;
    
    switch (platform) {
      case "YOUTUBE":
        authUrl = `${config.authUrl}?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(config.scopes.join(" "))}&access_type=offline&state=${state}`;
        break;
      case "TIKTOK":
        authUrl = `${config.authUrl}?client_key=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(config.scopes.join(","))}&state=${state}`;
        break;
      case "FACEBOOK":
      case "INSTAGRAM":
        authUrl = `${config.authUrl}?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(config.scopes.join(","))}&state=${state}`;
        break;
      case "LINKEDIN":
        authUrl = `${config.authUrl}?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(config.scopes.join(" "))}&state=${state}`;
        break;
      case "TWITTER":
        authUrl = `${config.authUrl}?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(config.scopes.join(" "))}&state=${state}&code_challenge=challenge&code_challenge_method=plain`;
        break;
      default:
        authUrl = `${config.authUrl}?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&state=${state}`;
    }

    console.log(`[OAUTH] Initiating ${platform} OAuth for workspace ${useWorkspaceId}`);
    
    // Redirect to platform's OAuth page
    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error("OAuth initiation error:", error);
    return NextResponse.json(
      { error: "Failed to initiate OAuth" },
      { status: 500 }
    );
  }
}

// Handle OAuth callback from platform
async function handleOAuthCallback(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");

    if (error) {
      console.error("[OAUTH] Callback error:", error);
      return NextResponse.redirect(`/dashboard/social?error=${error}`);
    }

    if (!code || !state) {
      console.error("[OAUTH] Missing code or state");
      return NextResponse.redirect("/dashboard/social?error=missing_params");
    }

    // Decode state
    let stateData: { workspaceId: string; platform: string };
    try {
      stateData = JSON.parse(Buffer.from(state, "base64").toString());
    } catch {
      return NextResponse.redirect("/dashboard/social?error=invalid_state");
    }

    const { workspaceId, platform } = stateData as { workspaceId: string; platform: Platform };
    const config = OAUTH_CONFIG[platform];
    const clientId = getClientId(platform);
    const clientSecret = getClientSecret(platform);
    const redirectUri = getRedirectUri(platform);

    if (!clientId || !clientSecret) {
      return NextResponse.redirect("/dashboard/social?error=oauth_not_configured");
    }

    // Exchange code for tokens
    let tokenData: Record<string, any> | null = null;
    
    switch (platform) {
      case "YOUTUBE":
        tokenData = await exchangeYouTubeToken(config, clientId, clientSecret, redirectUri, code);
        break;
      case "TIKTOK":
        tokenData = await exchangeTikTokToken(config, clientId, clientSecret, redirectUri, code);
        break;
      case "FACEBOOK":
      case "INSTAGRAM":
        tokenData = await exchangeFacebookToken(config, clientId, clientSecret, redirectUri, code);
        break;
      case "LINKEDIN":
        tokenData = await exchangeLinkedInToken(config, clientId, clientSecret, redirectUri, code);
        break;
      case "TWITTER":
        tokenData = await exchangeTwitterToken(config, clientId, clientSecret, redirectUri, code);
        break;
      default:
        return NextResponse.redirect("/dashboard/social?error=unsupported_platform");
    }

    if (!tokenData) {
      return NextResponse.redirect("/dashboard/social?error=token_exchange_failed");
    }

    // Get user profile from platform
    const profile = await getUserProfile(platform, tokenData.access_token);

    // Store the account
    const id = `sa_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Check if account already exists
    const existing = await db
      .select()
      .from(socialAccounts)
      .where(
        and(
          eq(socialAccounts.workspaceId, workspaceId),
          eq(socialAccounts.platform, platform)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      // Update existing account
      await db
        .update(socialAccounts)
        .set({
          platformAccountId: profile.id,
          platformUsername: profile.username,
          platformProfileUrl: profile.profileUrl,
          platformProfileImage: profile.picture,
          accessToken: tokenData.access_token,
          refreshToken: tokenData.refresh_token,
          tokenExpiresAt: tokenData.expires_in ? new Date(Date.now() + tokenData.expires_in * 1000) : null,
          status: "CONNECTED",
          updatedAt: new Date(),
        })
        .where(eq(socialAccounts.id, existing[0].id));
    } else {
      // Insert new account
      await db
        .insert(socialAccounts)
        .values({
          id,
          workspaceId,
          platform,
          platformAccountId: profile.id,
          platformUsername: profile.username,
          platformProfileUrl: profile.profileUrl,
          platformProfileImage: profile.picture,
          accessToken: tokenData.access_token,
          refreshToken: tokenData.refresh_token,
          tokenExpiresAt: tokenData.expires_in ? new Date(Date.now() + tokenData.expires_in * 1000) : null,
          status: "CONNECTED",
        });
    }

    console.log(`[OAUTH] Successfully connected ${platform} account for workspace ${workspaceId}`);
    
    return NextResponse.redirect("/dashboard/social?success=connected");
  } catch (error) {
    console.error("OAuth callback error:", error);
    return NextResponse.redirect("/dashboard/social?error=callback_failed");
  }
}

// Get client ID from environment
function getClientId(platform: string): string | undefined {
  const envKeys: Record<string, string | undefined> = {
    YOUTUBE: process.env.YOUTUBE_CLIENT_ID,
    TIKTOK: process.env.TIKTOK_CLIENT_ID,
    FACEBOOK: process.env.FACEBOOK_CLIENT_ID,
    INSTAGRAM: process.env.INSTAGRAM_CLIENT_ID,
    LINKEDIN: process.env.LINKEDIN_CLIENT_ID,
    TWITTER: process.env.TWITTER_CLIENT_ID,
  };
  return envKeys[platform];
}

// Get client secret from environment
function getClientSecret(platform: string): string | undefined {
  const envKeys: Record<string, string | undefined> = {
    YOUTUBE: process.env.YOUTUBE_CLIENT_SECRET,
    TIKTOK: process.env.TIKTOK_CLIENT_SECRET,
    FACEBOOK: process.env.FACEBOOK_CLIENT_SECRET,
    INSTAGRAM: process.env.INSTAGRAM_CLIENT_SECRET,
    LINKEDIN: process.env.LINKEDIN_CLIENT_SECRET,
    TWITTER: process.env.TWITTER_CLIENT_SECRET,
  };
  return envKeys[platform];
}

// Get redirect URI
function getRedirectUri(platform: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  return `${baseUrl}/api/social-accounts/oauth?action=callback&platform=${platform}`;
}

// Exchange code for token - YouTube/Google
async function exchangeYouTubeToken(config: any, clientId: string, clientSecret: string, redirectUri: string, code: string): Promise<Record<string, any> | null> {
  const response = await fetch(config.tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      grant_type: "authorization_code",
      redirect_uri: redirectUri,
    }),
  });
  return response.ok ? await response.json() : null;
}

// Exchange code for token - TikTok
async function exchangeTikTokToken(config: any, clientKey: string, clientSecret: string, redirectUri: string, code: string): Promise<Record<string, any> | null> {
  const response = await fetch(config.tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_key: clientKey,
      client_secret: clientSecret,
      code,
      grant_type: "authorization_code",
      redirect_uri: redirectUri,
    }),
  });
  return response.ok ? await response.json() : null;
}

// Exchange code for token - Facebook/Instagram
async function exchangeFacebookToken(config: any, clientId: string, clientSecret: string, redirectUri: string, code: string): Promise<Record<string, any> | null> {
  const url = new URL(config.tokenUrl);
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("client_secret", clientSecret);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("code", code);
  
  const response = await fetch(url.toString());
  return response.ok ? await response.json() : null;
}

// Exchange code for token - LinkedIn
async function exchangeLinkedInToken(config: any, clientId: string, clientSecret: string, redirectUri: string, code: string): Promise<Record<string, any> | null> {
  const response = await fetch(config.tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });
  return response.ok ? await response.json() : null;
}

// Exchange code for token - Twitter
async function exchangeTwitterToken(config: any, clientId: string, clientSecret: string, redirectUri: string, code: string): Promise<Record<string, any> | null> {
  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const response = await fetch(config.tokenUrl, {
    method: "POST",
    headers: { 
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": `Basic ${credentials}`
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
      code_verifier: "challenge",
    }),
  });
  return response.ok ? await response.json() : null;
}

// Get user profile from platform
async function getUserProfile(platform: string, accessToken: string): Promise<{
  id: string;
  username: string;
  profileUrl: string;
  picture: string | null;
}> {
  switch (platform) {
    case "YOUTUBE": {
      const response = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await response.json();
      return {
        id: data.id,
        username: data.name,
        profileUrl: `https://www.youtube.com/channel/${data.id}`,
        picture: data.picture,
      };
    }
    case "TIKTOK": {
      const response = await fetch("https://open.tiktokapis.com/v2/user/info/?fields=display_name,avatar_url,open_id", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await response.json();
      return {
        id: data.data?.open_id || "unknown",
        username: data.data?.display_name || "TikTok User",
        profileUrl: "",
        picture: data.data?.avatar_url || null,
      };
    }
    case "FACEBOOK": {
      const response = await fetch("https://graph.facebook.com/v18.0/me?fields=id,name,picture", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await response.json();
      return {
        id: data.id,
        username: data.name,
        profileUrl: `https://facebook.com/${data.id}`,
        picture: data.picture?.data?.url || null,
      };
    }
    case "INSTAGRAM": {
      const response = await fetch("https://graph.instagram.com/me?fields=id,username,media_count", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await response.json();
      return {
        id: data.id,
        username: data.username,
        profileUrl: `https://instagram.com/${data.username}`,
        picture: null,
      };
    }
    case "LINKEDIN": {
      const response = await fetch("https://api.linkedin.com/v2/me", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await response.json();
      return {
        id: data.id,
        username: data.localizedFirstName + " " + data.localizedLastName,
        profileUrl: "",
        picture: null,
      };
    }
    case "TWITTER": {
      const response = await fetch("https://api.twitter.com/2/users/me?user.fields=profile_image_url,username", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await response.json();
      return {
        id: data.data?.id || "unknown",
        username: data.data?.username || "Twitter User",
        profileUrl: `https://twitter.com/${data.data?.username}`,
        picture: data.data?.profile_image_url || null,
      };
    }
    default:
      return {
        id: "unknown",
        username: "Unknown User",
        profileUrl: "",
        picture: null,
      };
  }
}
