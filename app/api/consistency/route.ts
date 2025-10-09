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

    // Fetch consistency reports for the user
    const { data: reports, error: reportsError } = await supabase
      .from("consistency_reports")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (reportsError) {
      console.error("Error fetching consistency reports:", reportsError);
      return NextResponse.json(
        { error: "Failed to fetch consistency reports" },
        { status: 500 }
      );
    }

    return NextResponse.json(reports || []);
  } catch (error) {
    console.error("Consistency reports fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch consistency reports" },
      { status: 500 }
    );
  }
}
