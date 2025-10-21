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

    // Count companies
    const { count, error: countError } = await supabase
      .from("companies")
      .select("*", { count: "exact", head: true });

    if (countError) {
      return NextResponse.json(
        {
          error: "Failed to count companies",
          details: countError.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      count: count || 0,
    });
  } catch (error) {
    console.error("Count companies error:", error);
    return NextResponse.json(
      {
        error: "Failed to count companies",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
