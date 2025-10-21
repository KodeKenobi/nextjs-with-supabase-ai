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
      console.log("❌ Consistency API: User not authenticated", {
        userError: userError?.message,
      });
      return NextResponse.json(
        {
          error: "Authentication required",
          message: "Please log in to access consistency reports",
          code: "UNAUTHORIZED",
        },
        { status: 401 }
      );
    }

    // Fetch ALL consistency reports from ALL users
    const { data: reports, error: reportsError } = await supabase
      .from("consistency_reports")
      .select("*")
      .order("createdAt", { ascending: false });

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
