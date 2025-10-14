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

    // Fetch company details and content in one query
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
        companies!inner(
          id,
          name,
          description,
          industry,
          country,
          size,
          type
        ),
        transcriptions(*),
        business_insights(*)
      `
      )
      .eq("companyid", companyId)
      .eq("userid", user.id)
      .order("createdat", { ascending: false });

    if (contentError) {
      console.error("Error fetching content:", contentError);
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    if (!contentItems || contentItems.length === 0) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    // Get company details from the first content item
    const company = contentItems[0].companies;

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
