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

    // Fetch all companies
    const { data: companies, error: companiesError } = await supabase
      .from("companies")
      .select(`
        id,
        name,
        description,
        industry,
        country,
        size,
        type,
        website,
        created_at,
        updated_at
      `)
      .order("created_at", { ascending: false });

    if (companiesError) {
      console.error("Error fetching companies:", companiesError);
      return NextResponse.json(
        { error: "Failed to fetch companies" },
        { status: 500 }
      );
    }

    return NextResponse.json(companies || []);
  } catch (error) {
    console.error("Companies fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
