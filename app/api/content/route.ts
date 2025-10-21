import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.log("❌ Content API: User not authenticated", {
        userError: userError?.message,
      });
      return NextResponse.json(
        {
          error: "Authentication required",
          message: "Please log in to access content",
          code: "UNAUTHORIZED",
        },
        { status: 401 }
      );
    }

    // Fetch ALL content items from ALL companies
    const { data: contentItems, error: contentError } = await supabase
      .from("content_items")
      .select(
        `
        *,
        transcriptions(*),
        business_insights(*),
        companies(id, name, industry, description, country, size, type)
      `
      )
      .order("createdat", { ascending: false });

    console.log("🔍 Content API Debug:", {
      contentItemsCount: contentItems?.length || 0,
      firstItem: contentItems?.[0],
      firstItemCompany: contentItems?.[0]?.companies,
      error: contentError?.message,
    });

    if (contentError) {
      console.error("Error fetching content:", contentError);
      return NextResponse.json(
        {
          error: "Failed to fetch content",
          details: contentError.message,
          code: contentError.code,
        },
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
