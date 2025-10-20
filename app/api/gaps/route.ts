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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch ALL gap analysis reports from ALL users
    const { data: reports, error: reportsError } = await supabase
      .from("gap_analysis_reports")
      .select("*")
      .order("createdAt", { ascending: false });

    if (reportsError) {
      console.error("Error fetching gap analysis reports:", reportsError);
      return NextResponse.json(
        { error: "Failed to fetch gap analysis reports" },
        { status: 500 }
      );
    }

    return NextResponse.json(reports || []);
  } catch (error) {
    console.error("Gap analysis reports fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch gap analysis reports" },
      { status: 500 }
    );
  }
}
