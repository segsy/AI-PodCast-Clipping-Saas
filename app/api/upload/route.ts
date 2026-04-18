import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { assetLibrary, uploads } from "@/db/schema";
import { getActiveWorkspaceId, getCurrentUserId } from "@/lib/auth";

// Simple ID generator
const generateId = () => `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Supported video platforms
const VIDEO_PLATFORMS = {
  youtube: { regex: /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/, name: "YouTube", color: "#FF0000" },
  twitch: { regex: /(?:twitch\.tv\/)([a-zA-Z0-9_]+)/, name: "Twitch", color: "#9146FF" },
  vimeo: { regex: /(?:vimeo\.com\/)(\d+)/, name: "Vimeo", color: "#1AB7EA" },
  zoom: { regex: /(?:zoom\.us\/)/, name: "Zoom", color: "#2D8CFF" },
  rumble: { regex: /(?:rumble\.com\/)([a-zA-Z0-9_-]+)/, name: "Rumble", color: "#85C742" },
  tiktok: { regex: /(?:tiktok\.com\/@[a-zA-Z0-9_]+\/video\/\d+)/, name: "TikTok", color: "#000000" },
  instagram: { regex: /(?:instagram\.com\/(?:reel|p)\/)(\w+)/, name: "Instagram", color: "#E1306C" },
  facebook: { regex: /(?:facebook\.com\/(?:watch\?v=|video\.php\?v=))(\d+)/, name: "Facebook", color: "#1877F2" },
};

// Detect video platform from URL
function detectPlatform(url: string): { platform: string; name: string; color: string; videoId: string } | null {
  for (const [key, platform] of Object.entries(VIDEO_PLATFORMS)) {
    const match = url.match(platform.regex);
    if (match) {
      return {
        platform: key,
        name: platform.name,
        color: platform.color,
        videoId: match[1] || ""
      };
    }
  }
  return null;
}

// GET - Get upload status or list
export async function GET(request: NextRequest) {
  try {
    const workspaceId = await getActiveWorkspaceId();
    if (!workspaceId) {
      return NextResponse.json(
        { error: "Workspace ID is required" },
        { status: 400 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get("type");
    
    if (type === "link-detect") {
      const url = searchParams.get("url");
      if (!url) {
        return NextResponse.json({ error: "URL is required" }, { status: 400 });
      }
      
      const platformInfo = detectPlatform(url);
      return NextResponse.json({ 
        platform: platformInfo,
        supported: platformInfo !== null
      });
    }

    return NextResponse.json({ message: "Upload API ready" });
  } catch (error) {
    console.error("Error in upload GET:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST - Handle file upload or video link import
export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") || "";
    
    // Handle JSON body (video link import)
    if (contentType.includes("application/json")) {
      const body = await request.json();
      const { videoUrl, platform, projectId, workspaceId: bodyWorkspaceId, userId: bodyUserId } = body;

      if (!videoUrl) {
        return NextResponse.json(
          { error: "Video URL is required" },
          { status: 400 }
        );
      }

      // Try to get workspace from body first, then from session
      let workspaceId = bodyWorkspaceId;
      if (!workspaceId) {
        workspaceId = await getActiveWorkspaceId();
      }
      
      let userId = bodyUserId;
      if (!userId) {
        userId = await getCurrentUserId();
      }

      if (!workspaceId) {
        return NextResponse.json(
          { error: "Unauthorized - No workspace" },
          { status: 401 }
        );
      }

      // Detect platform if not provided
      const detectedPlatform = platform || detectPlatform(videoUrl);
      
      // Create a link-based upload entry
      const linkId = generateId();
      const fileName = `${detectedPlatform?.name || "video"}_link_${Date.now()}.mp4`;
      
      const [newUpload] = await db
        .insert(uploads)
        .values({
          id: linkId,
          workspaceId,
          projectId: projectId || null,
          filename: fileName,
          contentType: "video/link",
          bytes: 0,
          s3Key: `links/${workspaceId}/${linkId}/${detectedPlatform?.platform || "unknown"}`,
          status: "UPLOAD_COMPLETE",
          durationSec: null,
          createdBy: userId || "unknown",
        })
        .returning();

      return NextResponse.json({
        success: true,
        upload: newUpload,
        platform: detectedPlatform,
        message: detectedPlatform 
          ? `Successfully imported ${detectedPlatform.name} video link`
          : "Successfully imported video link"
      }, { status: 201 });
    }

    // Handle multipart form data (file upload)
    const formData = await request.formData();
    const file = formData.get("file") as File;
    let workspaceId = formData.get("workspaceId") as string;
    const projectId = formData.get("projectId") as string;
    let userId = formData.get("userId") as string;

    // If workspaceId not in form data, try to get from session
    if (!workspaceId) {
      workspaceId = await getActiveWorkspaceId() || "";
    }
    
    // If userId not in form data, try to get from session
    if (!userId) {
      userId = await getCurrentUserId() || "";
    }

    if (!file || !workspaceId) {
      return NextResponse.json(
        { error: "File and workspace ID are required" },
        { status: 400 }
      );
    }

    // If userId is still empty, we cannot proceed as createdBy is required
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required. Please log in again." },
        { status: 401 }
      );
    }

    // In production, this would upload to S3 and return the URL
    // For now, we'll store a reference and create an asset library entry
    const fileId = generateId();
    const fileType = file.type.startsWith("video") ? "video" : 
                     file.type.startsWith("image") ? "image" : "document";

    // Create asset library entry
    const [newAsset] = await db
      .insert(assetLibrary)
      .values({
        id: fileId,
        workspaceId,
        name: file.name,
        type: fileType,
        s3Key: `uploads/${workspaceId}/${fileId}/${file.name}`,
        contentType: file.type,
        bytes: file.size,
        folder: "calendar-uploads",
        createdBy: userId,
      })
      .returning();

    // Also create an upload record for tracking
    const [uploadRecord] = await db
      .insert(uploads)
      .values({
        id: fileId,
        workspaceId,
        projectId: projectId || null,
        filename: file.name,
        contentType: file.type,
        bytes: file.size,
        s3Key: `uploads/${workspaceId}/${fileId}/${file.name}`,
        status: "UPLOAD_COMPLETE",
        createdBy: userId,
      })
      .returning();

    // Return success with message
    return NextResponse.json({
      success: true,
      asset: newAsset,
      upload: uploadRecord,
      fileId,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      message: `Successfully uploaded "${file.name}"`
    }, { status: 201 });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
}
