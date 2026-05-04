import { google } from "googleapis";
import { db } from "@/db";
import { googleDriveTokens } from "@/db/schema";
import { eq } from "drizzle-orm";

// Google Drive OAuth2 configuration
const DRIVE_SCOPES = [
  "https://www.googleapis.com/auth/drive.readonly",
  "https://www.googleapis.com/auth/drive.file",
];

const getOAuth2Client = (clientId: string, clientSecret: string) => {
  return new google.auth.OAuth2(clientId, clientSecret);
};

// Generate authorization URL for Google Drive OAuth
export function getAuthorizationUrl(
  clientId: string,
  clientSecret: string,
  redirectUri: string,
  state: string
): string {
  const oauth2Client = getOAuth2Client(clientId, clientSecret);
  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: DRIVE_SCOPES,
    state,
    redirect_uri: redirectUri,
  });
}

// Exchange authorization code for tokens
export async function exchangeCodeForTokens(
  clientId: string,
  clientSecret: string,
  redirectUri: string,
  code: string
): Promise<{
  accessToken: string;
  refreshToken: string | null;
  tokenType: string;
  expiresAt?: Date;
  scope: string;
}> {
  const oauth2Client = getOAuth2Client(clientId, clientSecret);
  
  const { tokens } = await oauth2Client.exchangeCodeForToken({
    code,
    redirect_uri: redirectUri,
  });

  if (!tokens.access_token) {
    throw new Error("No access token received");
  }

  return {
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token || null,
    tokenType: tokens.token_type || "Bearer",
    expiresAt: tokens.expiry_date ? new Date(tokens.expiry_date) : undefined,
    scope: tokens.scope || "",
  };
}

// Store OAuth tokens in database
export async function storeGoogleDriveTokens(
  userId: string,
  workspaceId: string,
  accessToken: string,
  refreshToken: string | null,
  tokenType: string,
  expiresAt?: Date,
  scope?: string
) {
  const id = `gdt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  await db.insert(googleDriveTokens).values({
    id,
    userId,
    workspaceId,
    accessToken,
    refreshToken: refreshToken,
    tokenType,
    expiresAt: expiresAt || null,
    scope: scope || "",
  }).onConflictDoUpdate({
    target: googleDriveTokens.userId,
    set: {
      accessToken,
      refreshToken: refreshToken,
      tokenType,
      expiresAt: expiresAt || null,
      scope: scope || "",
      updatedAt: new Date(),
    },
  });
}

// Get Google Drive tokens for a user
export async function getGoogleDriveTokens(userId: string) {
  const [tokens] = await db
    .select()
    .from(googleDriveTokens)
    .where(eq(googleDriveTokens.userId, userId))
    .limit(1);
  
  return tokens;
}

// Refresh access token if expired
export async function refreshAccessToken(
  clientId: string,
  clientSecret: string,
  currentTokens: typeof googleDriveTokens.$inferSelect
): Promise<string> {
  if (!currentTokens.refreshToken) {
    throw new Error("No refresh token available");
  }

  const oauth2Client = getOAuth2Client(clientId, clientSecret);
  oauth2Client.setCredentials({
    refresh_token: currentTokens.refreshToken,
  });

  const { credentials } = await oauth2Client.refreshAccessToken();
  
  if (!credentials.access_token) {
    throw new Error("Failed to refresh access token");
  }

  // Update tokens in database
  await db
    .update(googleDriveTokens)
    .set({
      accessToken: credentials.access_token,
      tokenType: credentials.token_type || "Bearer",
      expiresAt: credentials.expiry_date ? new Date(credentials.expiry_date) : null,
      updatedAt: new Date(),
    })
    .where(eq(googleDriveTokens.userId, currentTokens.userId));

  return credentials.access_token;
}

// Get valid access token (refresh if needed)
export async function getValidAccessToken(
  clientId: string,
  clientSecret: string,
  userId: string
): Promise<string> {
  const tokens = await getGoogleDriveTokens(userId);
  
  if (!tokens) {
    throw new Error("Google Drive not connected");
  }

  // Check if token is expired (with 5-minute buffer)
  const now = new Date();
  const expiresAt = tokens.expiresAt ? new Date(tokens.expiresAt) : null;
  
  if (expiresAt && expiresAt <= now) {
    // Token expired, refresh it
    return await refreshAccessToken(clientId, clientSecret, tokens);
  }

  return tokens.accessToken;
}

// List files from Google Drive
export async function listGoogleDriveFiles(
  clientId: string,
  clientSecret: string,
  userId: string,
  folderId?: string
): Promise<{
  id: string;
  name: string;
  mimeType: string;
  thumbnailLink?: string;
  size?: number;
  modifiedTime: string;
  parents?: string[];
}[]> {
  const accessToken = await getValidAccessToken(clientId, clientSecret, userId);
  
  const drive = google.drive({
    version: "v3",
    auth: accessToken,
  });

  const params: any = {
    pageSize: 50,
    fields: "nextPageToken, files(id, name, mimeType, thumbnailLink, size, modifiedTime, parents)",
    orderBy: "modifiedTime desc",
  };

  if (folderId) {
    params.q = `'${folderId}' in parents`;
  } else {
    params.q = "trashed = false";
  }

  const response = await drive.files.list(params);
  return response.data.files || [];
}

// Get file metadata from Google Drive
export async function getGoogleDriveFile(
  clientId: string,
  clientSecret: string,
  userId: string,
  fileId: string
) {
  const accessToken = await getValidAccessToken(clientId, clientSecret, userId);
  
  const drive = google.drive({
    version: "v3",
    auth: accessToken,
  });

  const response = await drive.files.get({
    fileId,
    fields: "id, name, mimeType, size, thumbnailLink, modifiedTime, parents",
  });

  return response.data;
}

// Download file from Google Drive
export async function downloadGoogleDriveFile(
  clientId: string,
  clientSecret: string,
  userId: string,
  fileId: string
): Promise<Buffer> {
  const accessToken = await getValidAccessToken(clientId, clientSecret, userId);
  
  const drive = google.drive({
    version: "v3",
    auth: accessToken,
  });

  const response = await drive.files.get(
    {
      fileId,
      alt: "media",
    },
    { responseType: "arraybuffer" }
  );

  return Buffer.from(response.data as ArrayBuffer);
}

// Disconnect Google Drive
export async function disconnectGoogleDrive(userId: string) {
  await db
    .delete(googleDriveTokens)
    .where(eq(googleDriveTokens.userId, userId));
}

// Check if user has connected Google Drive
export async function isGoogleDriveConnected(userId: string): Promise<boolean> {
  const tokens = await getGoogleDriveTokens(userId);
  return !!tokens;
}
