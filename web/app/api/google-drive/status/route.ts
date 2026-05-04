import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/auth";
import { isGoogleDriveConnected } from "@/lib/google-drive";

export async function GET(request: NextRequest) {
  try {
    const userId = await getCurrentUserId();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const connected = await isGoogleDriveConnected(userId);
    
    return NextResponse.json({ 
      connected,
      userId,
    });
  } catch (error) {
    console.error("Error checking Google Drive status:", error);
    return NextResponse.json(
      { error: "Failed to check Google Drive status" },
      { status: 500 }
    );
  }
}
