import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { assetLibrary } from "@/db/schema";

// Simple ID generator
const generateId = () => `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// This would be used with actual S3/upload service in production
// For now, we'll create a placeholder that stores the file reference

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const workspaceId = formData.get("workspaceId") as string;
    const projectId = formData.get("projectId") as string;
    const userId = formData.get("userId") as string;

    if (!file || !workspaceId) {
      return NextResponse.json(
        { error: "File and workspace ID are required" },
        { status: 400 }
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

    // Return the asset info for creating a scheduled post
    return NextResponse.json({
      asset: newAsset,
      fileId,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
    }, { status: 201 });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
}
