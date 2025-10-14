import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id: companyId } = await params;

    // Fetch company details
    const { data: company, error: companyError } = await supabase
      .from("companies")
      .select("*")
      .eq("id", companyId)
      .single();

    if (companyError) {
      console.error("Error fetching company:", companyError);
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    // Fetch related content for this company
    const { data: contentItems, error: contentError } = await supabase
      .from("content_items")
      .select(
        `
        *,
        transcriptions(*),
        business_insights(*)
      `
      )
      .eq("companyid", companyId)
      .eq("userid", user.id)
      .order("createdat", { ascending: false });

    if (contentError) {
      console.error("Error fetching content:", contentError);
      // Don't fail the request if content fetch fails, just return empty array
    }

    return NextResponse.json({
      company,
      contentItems: contentItems || [],
    });
  } catch (error) {
    console.error("Company details error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
