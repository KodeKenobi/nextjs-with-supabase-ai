import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();

    // Test basic connection (without requiring auth)
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      console.log(
        "Auth error (expected when not logged in):",
        userError.message
      );
    }

    // Test if companies table exists
    const { data: companies, error: companiesError } = await supabase
      .from("companies")
      .select("count")
      .limit(1);

    if (companiesError) {
      return NextResponse.json(
        {
          error: "Companies table error",
          details: companiesError.message,
          code: companiesError.code,
        },
        { status: 500 }
      );
    }

    // Test if content_items table exists
    const { data: contentItems, error: contentError } = await supabase
      .from("content_items")
      .select("count")
      .limit(1);

    if (contentError) {
      return NextResponse.json(
        {
          error: "Content items table error",
          details: contentError.message,
          code: contentError.code,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Database connection successful",
      auth: {
        hasUser: !!user,
        userEmail: user?.email || null,
        authError: userError?.message || null,
      },
      companiesCount: companies?.length || 0,
      contentItemsCount: contentItems?.length || 0,
    });
  } catch (error) {
    console.error("Database test error:", error);
    return NextResponse.json(
      {
        error: "Database test failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
