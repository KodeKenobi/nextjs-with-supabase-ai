import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase";

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

    // Fetch all user's content for gap analysis
    const { data: contentItems, error: contentError } = await supabaseAdmin
      .from("content_items")
      .select(
        `
        *,
        transcriptions(content),
        business_insights(title, content, category)
      `
      )
      .eq("user_id", user.id)
      .eq("status", "COMPLETED");

    if (contentError) {
      console.error("Error fetching content:", contentError);
      return NextResponse.json(
        { error: "Failed to fetch content" },
        { status: 500 }
      );
    }

    if (!contentItems || contentItems.length === 0) {
      return NextResponse.json(
        { error: "No content available for gap analysis" },
        { status: 400 }
      );
    }

    // Run gap analysis
    const gaps = await analyzeGaps(contentItems);

    // Create gap analysis report
    const { data: report, error: reportError } = await supabaseAdmin
      .from("gap_analysis_reports")
      .insert({
        title: `Gap Analysis - ${new Date().toLocaleDateString()}`,
        description: "Automated gap analysis of content strategy",
        gaps: gaps,
        total_gaps: gaps.length,
        priority_gaps: gaps.filter(
          (gap: any) => gap.priority === "HIGH" || gap.priority === "CRITICAL"
        ).length,
        recommendations: generateRecommendations(gaps),
        user_id: user.id,
      })
      .select()
      .single();

    if (reportError) {
      console.error("Error creating report:", reportError);
      return NextResponse.json(
        { error: "Failed to create gap analysis report" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      report,
      message: "Gap analysis completed",
    });
  } catch (error) {
    console.error("Gap analysis error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function analyzeGaps(contentItems: any[]) {
  // This would integrate with AI for actual gap analysis
  // For now, return mock gaps based on content analysis

  const gaps = [];
  const allCategories = new Set();
  const allTopics = new Set();

  // Analyze existing content
  contentItems.forEach((item) => {
    if (item.business_insights) {
      item.business_insights.forEach((insight: any) => {
        allCategories.add(insight.category);
      });
    }
  });

  // Define expected categories for comprehensive business analysis
  const expectedCategories = [
    "BUSINESS_MODEL",
    "MARKETING",
    "OPERATIONS",
    "FINANCIAL",
    "STRATEGIC",
    "CUSTOMER",
    "PRODUCT",
    "COMPETITIVE",
    "RISKS",
    "OPPORTUNITIES",
  ];

  // Find missing categories
  expectedCategories.forEach((category) => {
    if (!allCategories.has(category)) {
      gaps.push({
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        title: `Missing ${category.replace("_", " ").toLowerCase()} insights`,
        description: `No content found covering ${category
          .replace("_", " ")
          .toLowerCase()} aspects of your business`,
        category: category,
        priority: getPriorityForCategory(category),
        impact: "MEDIUM",
        effort: "LOW",
        recommendations: [
          `Create content specifically addressing ${category
            .replace("_", " ")
            .toLowerCase()}`,
          `Include ${category
            .replace("_", " ")
            .toLowerCase()} questions in your content strategy`,
          `Analyze existing content for ${category
            .replace("_", " ")
            .toLowerCase()} opportunities`,
        ],
        related_content: [],
      });
    }
  });

  // Check for content diversity
  const contentTypes = new Set(contentItems.map((item) => item.content_type));
  const expectedTypes = ["AUDIO", "VIDEO", "BLOG_ARTICLE", "DOCUMENT", "TEXT"];

  expectedTypes.forEach((type) => {
    if (!contentTypes.has(type)) {
      gaps.push({
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        title: `Missing ${type.toLowerCase().replace("_", " ")} content`,
        description: `No ${type
          .toLowerCase()
          .replace("_", " ")} content found in your library`,
        category: "CONTENT_DIVERSITY",
        priority: "MEDIUM",
        impact: "MEDIUM",
        effort: "MEDIUM",
        recommendations: [
          `Consider creating ${type.toLowerCase().replace("_", " ")} content`,
          `Diversify your content strategy to include ${type
            .toLowerCase()
            .replace("_", " ")}`,
          `Upload existing ${type
            .toLowerCase()
            .replace("_", " ")} content for analysis`,
        ],
        related_content: [],
      });
    }
  });

  return gaps;
}

function getPriorityForCategory(category: string): string {
  const highPriority = ["BUSINESS_MODEL", "FINANCIAL", "CUSTOMER", "RISKS"];
  const mediumPriority = ["MARKETING", "OPERATIONS", "STRATEGIC", "PRODUCT"];

  if (highPriority.includes(category)) return "HIGH";
  if (mediumPriority.includes(category)) return "MEDIUM";
  return "LOW";
}

function generateRecommendations(gaps: any[]): string[] {
  const recommendations = [];

  if (gaps.length > 0) {
    recommendations.push("Focus on high-priority gaps first");
    recommendations.push("Create a content calendar to address missing areas");
    recommendations.push("Regularly review and update your content strategy");
  }

  return recommendations;
}
