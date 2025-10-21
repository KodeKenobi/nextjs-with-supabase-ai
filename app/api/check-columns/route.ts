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

    // Check if companies table exists and get its columns
    const { data: companiesColumns, error: companiesError } = await supabase
      .from("companies")
      .select("*")
      .limit(1);

    if (companiesError) {
      return NextResponse.json(
        {
          error: "Failed to check companies table",
          details: companiesError.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Companies table is accessible",
      hasData: companiesColumns && companiesColumns.length > 0,
    });
  } catch (error) {
    console.error("Check columns error:", error);
    return NextResponse.json(
      {
        error: "Failed to check columns",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
