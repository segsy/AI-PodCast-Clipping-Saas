import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/auth";
import { listGoogleDriveFiles } from "@/lib/google-drive";

export async function GET(request: NextRequest) {
  try {
    const userId = await getCurrentUserId();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const clientId = process.env.GOOGLE_DRIVE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_DRIVE_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return NextResponse.json(
        { error: "Google Drive OAuth not configured" },
        { status: 500 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const folderId = searchParams.get("folderId");

    const files = await listGoogleDriveFiles(
      clientId,
      clientSecret,
      userId,
      folderId || undefined
    );

    // Filter to only show video and audio files that are supported
    const supportedMimeTypes = [
      "video/mp4",
      "video/quicktime",
      "video/x-msvideo",
      "video/x-matroska",
      "video/webm",
      "audio/mpeg",
      "audio/wav",
      "audio/ogg",
      "audio/x-m4a",
    ];

    const filteredFiles = files.filter((file) => {
      // If it's a folder, include it
      if (file.mimeType === "application/vnd.google-apps.folder") {
        return true;
      }
      // Include supported video/audio files
      return supportedMimeTypes.some((type) => file.mimeType?.startsWith(type));
    });

    return NextResponse.json({ 
      files: filteredFiles,
      total: filteredFiles.length,
    });
  } catch (error: any) {
    console.error("Error listing Google Drive files:", error);
    
    if (error.message === "Google Drive not connected") {
      return NextResponse.json(
        { error: "Google Drive not connected", connected: false },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to list Google Drive files", details: error.message },
      { status: 500 }
    );
  }
}
