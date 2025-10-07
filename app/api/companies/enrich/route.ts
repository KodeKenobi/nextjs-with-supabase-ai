import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
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

    const { companyId, enrichmentData } = await request.json();

    if (!companyId || !enrichmentData) {
      return NextResponse.json(
        { error: "Company ID and enrichment data are required" },
        { status: 400 }
      );
    }

    // Update the company with enrichment data
    const { data: updatedCompany, error: updateError } = await supabase
      .from("companies")
      .update(enrichmentData)
      .eq("id", companyId)
      .select()
      .single();

    if (updateError) {
      console.error("Error enriching company:", updateError);
      return NextResponse.json(
        { error: "Failed to enrich company: " + updateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Company enriched successfully",
      company: updatedCompany,
    });
  } catch (error) {
    console.error("Company enrichment error:", error);
    return NextResponse.json(
      { error: "Failed to enrich company" },
      { status: 500 }
    );
  }
}
