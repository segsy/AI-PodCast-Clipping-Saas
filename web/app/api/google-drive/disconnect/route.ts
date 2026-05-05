import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/auth";
import { disconnectGoogleDrive } from "@/lib/google-drive";

export async function POST(request: NextRequest) {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    await disconnectGoogleDrive(userId);

    return NextResponse.json({ 
      success: true,
      message: "Google Drive disconnected successfully"
    });
  } catch (error) {
    console.error("Error disconnecting Google Drive:", error);
    return NextResponse.json(
      { error: "Failed to disconnect Google Drive" },
      { status: 500 }
    );
  }
}
