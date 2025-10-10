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

    // Try simple content fetch first (without joins)
    const { data: contentItems, error: contentError } = await supabase
      .from("content_items")
      .select("*")
      .eq("userId", user.id)
      .order("createdAt", { ascending: false });

    if (contentError) {
      console.error("Error fetching content:", contentError);
      return NextResponse.json(
        { 
          error: "Failed to fetch content", 
          details: contentError.message,
          code: contentError.code
        },
        { status: 500 }
      );
    }

    // If successful, try to get related data separately
    const contentWithRelations = await Promise.all(
      (contentItems || []).map(async (item) => {
        // Get transcriptions
        const { data: transcriptions } = await supabase
          .from("transcriptions")
          .select("*")
          .eq("contentItemId", item.id);

        // Get business insights
        const { data: insights } = await supabase
          .from("business_insights")
          .select("*")
          .eq("contentItemId", item.id);

        // Get company info if company_id exists
        let company = null;
        if (item.companyId) {
          const { data: companyData } = await supabase
            .from("companies")
            .select("id, name, industry")
            .eq("id", item.companyId)
            .single();
          company = companyData;
        }

        return {
          ...item,
          transcriptions: transcriptions || [],
          business_insights: insights || [],
          companies: company
        };
      })
    );

    return NextResponse.json(contentWithRelations);
  } catch (error) {
    console.error("Content fetch error:", error);
    return NextResponse.json(
      { 
        error: "Failed to fetch content", 
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
