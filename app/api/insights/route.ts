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
      console.log("❌ Insights API: User not authenticated", {
        userError: userError?.message,
      });
      return NextResponse.json(
        {
          error: "Authentication required",
          message: "Please log in to access insights",
          code: "UNAUTHORIZED",
        },
        { status: 401 }
      );
    }

    // Fetch ALL business insights from ALL users
    const { data: insights, error: insightsError } = await supabase
      .from("business_insights")
      .select(
        `
        *,
        content_items!inner(
          id,
          title,
          contenttype
        )
      `
      )
      .order("createdAt", { ascending: false });

    if (insightsError) {
      console.error("Error fetching insights:", insightsError);
      return NextResponse.json(
        { error: "Failed to fetch insights" },
        { status: 500 }
      );
    }

    return NextResponse.json(insights || []);
  } catch (error) {
    console.error("Insights fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch insights" },
      { status: 500 }
    );
  }
}
