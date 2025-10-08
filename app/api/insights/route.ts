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

    // Fetch business insights for the user
    const { data: insights, error: insightsError } = await supabase
      .from("business_insights")
      .select(`
        *,
        content_items!inner(
          id,
          title,
          content_type
        )
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

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
