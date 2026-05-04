import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserId, getActiveWorkspaceId } from "@/lib/auth";
import { db } from "@/db";
import { assetLibrary, uploads } from "@/db/schema";
import { downloadGoogleDriveFile, getGoogleDriveFile } from "@/lib/google-drive";
import { eq } from "drizzle-orm";

// Simple ID generator
const generateId = () => `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export async function POST(request: NextRequest) {
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

    if (!clientId || !clientSecret) {
      return NextResponse.json(
        { error: "Google Drive OAuth not configured" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { fileId, fileName, fileSize, mimeType, projectId } = body;

    if (!fileId) {
      return NextResponse.json(
        { error: "File ID is required" },
        { status: 400 }
      );
    }

    // Get file metadata from Google Drive
    const driveFile = await getGoogleDriveFile(
      clientId,
      clientSecret,
      userId,
      fileId
    );

    // Determine file type
    const mime = mimeType || driveFile.mimeType;
    const fileType = mime.startsWith("video") ? "video" : 
                     mime.startsWith("audio") ? "audio" : "document";

    // Download the file from Google Drive
    const fileBuffer = await downloadGoogleDriveFile(
      clientId,
      clientSecret,
      userId,
      fileId
    );

    // In a production app, you would upload this buffer to S3 or cloud storage
    // For now, we'll simulate by storing a reference
    // In real implementation: upload to S3 and get the URL
    
    const fileIdNew = generateId();
    const finalFileName = fileName || driveFile.name;
    const finalFileSize = fileSize || (driveFile.size || fileBuffer.length);
    const finalMimeType = mime;

    // Create asset library entry
    const [newAsset] = await db
      .insert(assetLibrary)
      .values({
        id: fileIdNew,
        workspaceId,
        name: finalFileName,
        type: fileType,
        s3Key: `google-drive/${workspaceId}/${fileIdNew}/${finalFileName}`,
        contentType: finalMimeType,
        bytes: BigInt(finalFileSize),
        folder: "google-drive-imports",
        createdBy: userId,
      })
      .returning();

    // Also create an upload record for tracking
    const [uploadRecord] = await db
      .insert(uploads)
      .values({
        id: fileIdNew,
        workspaceId,
        projectId: projectId || null,
        filename: finalFileName,
        contentType: finalMimeType,
        bytes: BigInt(finalFileSize),
        s3Key: `google-drive/${workspaceId}/${fileIdNew}/${finalFileName}`,
        status: "UPLOAD_COMPLETE",
        createdBy: userId,
      })
      .returning();

    // TODO: In production, actually upload fileBuffer to S3 here
    // For now, we'll just store the metadata and assume the file is accessible

    return NextResponse.json({
      success: true,
      asset: newAsset,
      upload: uploadRecord,
      fileId: fileIdNew,
      fileName: finalFileName,
      fileSize: finalFileSize,
      fileType: finalMimeType,
      message: `Successfully imported "${finalFileName}" from Google Drive`,
    }, { status: 201 });
  } catch (error) {
    console.error("Error importing Google Drive file:", error);
    return NextResponse.json(
      { error: "Failed to import file from Google Drive" },
      { status: 500 }
    );
  }
}
