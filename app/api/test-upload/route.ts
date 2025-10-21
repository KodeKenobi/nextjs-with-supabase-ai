import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  try {
    const supabase = await createClient();

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Test upload functionality
    const testData = {
      message: "Test upload successful",
      timestamp: new Date().toISOString(),
      user: {
        id: user.id,
        email: user.email,
      },
    };

    return NextResponse.json(testData);
  } catch (error) {
    console.error("Test upload error:", error);
    return NextResponse.json(
      {
        error: "Test upload failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
