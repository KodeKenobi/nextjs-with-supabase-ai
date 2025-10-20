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

    // First, check if company exists
    const { data: company, error: companyError } = await supabase
      .from("companies")
      .select(
        `
        id,
        name,
        description,
        industry,
        country,
        size,
        type,
        createdat,
        updatedat
      `
      )
      .eq("id", companyId)
      .single();

    if (companyError || !company) {
      console.error("Error fetching company:", companyError);
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    // Fetch ALL content items for this company (from all users)
    const { data: contentItems, error: contentError } = await supabase
      .from("content_items")
      .select(
        `
        id,
        title,
        description,
        contenttype,
        status,
        createdat,
        companyid,
        userid,
        transcriptions(*),
        business_insights(*)
      `
      )
      .eq("companyid", companyId)
      .order("createdat", { ascending: false });

    if (contentError) {
      console.error("Error fetching content:", contentError);
      return NextResponse.json(
        { error: "Failed to fetch content" },
        { status: 500 }
      );
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
