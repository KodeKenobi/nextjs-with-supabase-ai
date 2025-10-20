import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase";

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

    // Fetch ALL companies in the system
    const { data: allCompanies, error: companiesError } = await supabaseAdmin
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
      .order("createdat", { ascending: false });

    if (companiesError) {
      console.error("Error fetching companies:", companiesError);
      return NextResponse.json(
        { error: "Failed to fetch companies" },
        { status: 500 }
      );
    }

    // For each company, get content items and insights
    const processedCompanies = await Promise.all(
      (allCompanies || []).map(async (company) => {
        // Get content items for this company (from all users)
        const { data: contentItems } = await supabaseAdmin
          .from("content_items")
          .select(
            `
            id,
            title,
            description,
            contenttype,
            status,
            createdat,
            userid,
            business_insights(
              id,
              category,
              title,
              content,
              priority,
              confidence
            )
          `
          )
          .eq("companyid", company.id)
          .order("createdat", { ascending: false });

        // Calculate stats
        const totalContent = contentItems?.length || 0;
        const insights =
          contentItems?.flatMap((item) => item.business_insights || []) || [];
        const totalInsights = insights.length;

        // Count content types
        const contentTypes: Record<string, number> = {};
        contentItems?.forEach((item) => {
          contentTypes[item.contenttype] =
            (contentTypes[item.contenttype] || 0) + 1;
        });

        // Get top insights by priority and confidence
        const topInsights = insights
          .sort((a: any, b: any) => {
            const priorityOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 };
            const aPriority =
              priorityOrder[a.priority as keyof typeof priorityOrder] || 0;
            const bPriority =
              priorityOrder[b.priority as keyof typeof priorityOrder] || 0;
            if (aPriority !== bPriority) return bPriority - aPriority;
            return (b.confidence || 0) - (a.confidence || 0);
          })
          .slice(0, 3);

        return {
          ...company,
          content_items: contentItems || [],
          insights: topInsights,
          contentTypes,
          totalContent,
          totalInsights,
        };
      })
    );

    return NextResponse.json(processedCompanies);
  } catch (error) {
    console.error("Companies fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

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

    const body = await request.json();
    const { name, description, industry, country, size, type } = body;

    // Validate required fields
    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: "Company name is required" },
        { status: 400 }
      );
    }

    // Check if company already exists
    const { data: existingCompany } = await supabaseAdmin
      .from("companies")
      .select("id")
      .eq("name", name.trim())
      .single();

    if (existingCompany) {
      return NextResponse.json(
        { error: "Company with this name already exists" },
        { status: 400 }
      );
    }

    // Create new company - only use columns that exist in the database
    const companyId = crypto.randomUUID();
    const { data: newCompany, error: createError } = await supabaseAdmin
      .from("companies")
      .insert({
        id: companyId,
        name: name.trim(),
        description: description?.trim() || null,
        industry: industry?.trim() || null,
        country: country?.trim() || null,
        size: size || null,
        type: type || "TARGET",
      })
      .select()
      .single();

    if (createError) {
      console.error("Error creating company:", createError);
      return NextResponse.json(
        { error: "Failed to create company", details: createError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      company: newCompany,
      message: "Company created successfully",
    });
  } catch (error) {
    console.error("Company creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get("id");

    if (!companyId) {
      return NextResponse.json(
        { error: "Company ID is required" },
        { status: 400 }
      );
    }

    // Check if company exists and get its details
    const { data: company, error: companyError } = await supabaseAdmin
      .from("companies")
      .select("id, name")
      .eq("id", companyId)
      .single();

    if (companyError || !company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    // Get all content items associated with this company for this user
    const { data: contentItems, error: contentError } = await supabaseAdmin
      .from("content_items")
      .select("id")
      .eq("companyid", companyId)
      .eq("userid", user.id);

    if (contentError) {
      console.error("Error checking content items:", contentError);
      return NextResponse.json(
        { error: "Failed to check company content" },
        { status: 500 }
      );
    }

    // Delete all associated content items first (cascade deletion)
    if (contentItems && contentItems.length > 0) {
      const contentItemIds = contentItems.map((item) => item.id);

      // Delete business insights
      await supabaseAdmin
        .from("business_insights")
        .delete()
        .in("contentItemId", contentItemIds);

      // Delete transcriptions
      await supabaseAdmin
        .from("transcriptions")
        .delete()
        .in("contentItemId", contentItemIds);

      // Delete content items
      const { error: contentDeleteError } = await supabaseAdmin
        .from("content_items")
        .delete()
        .in("id", contentItemIds);

      if (contentDeleteError) {
        console.error("Error deleting content items:", contentDeleteError);
        return NextResponse.json(
          { error: "Failed to delete associated content" },
          { status: 500 }
        );
      }
    }

    // Delete the company
    const { error: deleteError } = await supabaseAdmin
      .from("companies")
      .delete()
      .eq("id", companyId);

    if (deleteError) {
      console.error("Error deleting company:", deleteError);
      return NextResponse.json(
        { error: "Failed to delete company" },
        { status: 500 }
      );
    }

    const deletedContentCount = contentItems ? contentItems.length : 0;

    return NextResponse.json({
      success: true,
      message: `Company deleted successfully${
        deletedContentCount > 0
          ? ` along with ${deletedContentCount} content item${
              deletedContentCount > 1 ? "s" : ""
            }`
          : ""
      }`,
      deletedContentCount,
    });
  } catch (error) {
    console.error("Company deletion error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
