import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id } = await params;

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch content item for the user
    const { data: contentItem, error: contentError } = await supabase
      .from("content_items")
      .select(
        `
        *,
        transcriptions(*),
        business_insights(*),
        companies(id, name, industry, description, country, size, type)
      `
      )
      .eq("id", id)
      .eq("userid", user.id)
      .single();

    if (contentError) {
      console.error("Error fetching content item:", contentError);
      return NextResponse.json(
        {
          error: "Content not found",
          details: contentError.message,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(contentItem);
  } catch (error) {
    console.error("Content fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

