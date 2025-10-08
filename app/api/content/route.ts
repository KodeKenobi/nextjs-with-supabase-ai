import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
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

    // Fetch content items for the user
    const { data: contentItems, error: contentError } = await supabase
      .from("content_items")
      .select(`
        *,
        transcriptions(*),
        business_insights(*)
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (contentError) {
      console.error("Error fetching content:", contentError);
      return NextResponse.json(
        { error: "Failed to fetch content" },
        { status: 500 }
      );
    }

    return NextResponse.json(contentItems || []);
  } catch (error) {
    console.error("Content fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch content" },
      { status: 500 }
    );
  }
}
