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

    // Get all companies with debug info
    const { data: companies, error: companiesError } = await supabase
      .from("companies")
      .select("*")
      .order("createdat", { ascending: false })
      .limit(10);

    if (companiesError) {
      return NextResponse.json(
        {
          error: "Failed to fetch companies",
          details: companiesError.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      companies: companies || [],
      count: companies?.length || 0,
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Debug companies error:", error);
    return NextResponse.json(
      {
        error: "Failed to debug companies",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
