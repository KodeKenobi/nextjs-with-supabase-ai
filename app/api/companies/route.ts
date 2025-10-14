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

    // Fetch content items for the user and group by company
    const { data: contentItems, error: contentError } = await supabase
      .from("content_items")
      .select(`
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
        business_insights(
          id,
          category,
          title,
          content,
          priority,
          confidence
        )
      `)
      .eq("userid", user.id)
      .order("createdat", { ascending: false });

    if (contentError) {
      console.error("Error fetching content items:", contentError);
      return NextResponse.json(
        { error: "Failed to fetch content items" },
        { status: 500 }
      );
    }

    // Group content items by company
    const companiesMap = new Map();
    
    contentItems?.forEach((item: any) => {
      const companyId = item.companyid;
      const company = item.companies;
      
      if (!companiesMap.has(companyId)) {
        companiesMap.set(companyId, {
          id: company.id,
          name: company.name,
          description: company.description,
          industry: company.industry,
          country: company.country,
          size: company.size,
          type: company.type,
          content_items: [],
          insights: [],
          contentTypes: {},
          totalContent: 0,
          totalInsights: 0
        });
      }
      
      const companyData = companiesMap.get(companyId);
      companyData.content_items.push(item);
      companyData.totalContent++;
      
      // Add insights
      if (item.business_insights) {
        companyData.insights.push(...item.business_insights);
        companyData.totalInsights += item.business_insights.length;
      }
      
      // Count content types
      companyData.contentTypes[item.contenttype] = (companyData.contentTypes[item.contenttype] || 0) + 1;
    });

    // Process each company's insights
    const processedCompanies = Array.from(companiesMap.values()).map((company) => {
      // Get top insights by priority and confidence
      const topInsights = company.insights
        .sort((a: any, b: any) => {
          const priorityOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 };
          const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder] || 0;
          const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder] || 0;
          if (aPriority !== bPriority) return bPriority - aPriority;
          return (b.confidence || 0) - (a.confidence || 0);
        })
        .slice(0, 3);

      return {
        ...company,
        insights: topInsights
      };
    });

    return NextResponse.json(processedCompanies);
  } catch (error) {
    console.error("Companies fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
