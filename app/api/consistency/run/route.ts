import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(_request: NextRequest) {
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

    // Fetch all user's content for consistency analysis
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

    if (!contentItems || contentItems.length < 2) {
      return NextResponse.json(
        { error: "Need at least 2 content items for consistency analysis" },
        { status: 400 }
      );
    }

    // Run consistency analysis
    const contradictions = await analyzeConsistency(contentItems);

    // Create consistency report
    const { data: report, error: reportError } = await supabaseAdmin
      .from("consistency_reports")
      .insert({
        title: `Consistency Check - ${new Date().toLocaleDateString()}`,
        description: "Automated consistency analysis of all content",
        contradictions: contradictions,
        total_contradictions: contradictions.length,
        user_id: user.id,
      })
      .select()
      .single();

    if (reportError) {
      console.error("Error creating report:", reportError);
      return NextResponse.json(
        { error: "Failed to create consistency report" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      report,
      message: "Consistency analysis completed",
    });
  } catch (error) {
    console.error("Consistency analysis error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function analyzeConsistency(contentItems: unknown[]) {
  // This would integrate with AI for actual consistency analysis
  // For now, return mock contradictions
  const contradictions: unknown[] = [];

  // Simple keyword-based contradiction detection
  const allText = contentItems
    .map((item) => {
      const typedItem = item as {
        title: string;
        description?: string;
        transcriptions?: Array<{ content: string }>;
        business_insights?: Array<{ content: string }>;
      };
      const transcription = typedItem.transcriptions?.[0]?.content || "";
      const insights =
        typedItem.business_insights?.map((i) => i.content).join(" ") || "";
      return `${typedItem.title} ${typedItem.description || ""} ${transcription} ${insights}`.toLowerCase();
    })
    .join(" ");

  // Check for common contradictions
  const contradictionPatterns = [
    {
      positive: ["increase", "grow", "expand"],
      negative: ["decrease", "shrink", "reduce"],
    },
    {
      positive: ["profitable", "successful"],
      negative: ["loss", "failing", "struggling"],
    },
    {
      positive: ["modern", "new", "latest"],
      negative: ["old", "outdated", "traditional"],
    },
  ];

  contradictionPatterns.forEach((pattern) => {
    const hasPositive = pattern.positive.some((word) => allText.includes(word));
    const hasNegative = pattern.negative.some((word) => allText.includes(word));

    if (hasPositive && hasNegative) {
      contradictions.push({
        id: Date.now().toString(),
        title: `Contradiction: ${pattern.positive[0]} vs ${pattern.negative[0]}`,
        description: `Content contains both positive and negative statements about ${pattern.positive[0]}`,
        severity: "MEDIUM",
        related_content: contentItems
          .filter((item) => {
            const typedItem = item as {
              title: string;
              description?: string;
            };
            const text = `${typedItem.title} ${typedItem.description || ""}`.toLowerCase();
            return (
              pattern.positive.some((word) => text.includes(word)) ||
              pattern.negative.some((word) => text.includes(word))
            );
          })
           .map((item) => ({ id: (item as { id: string }).id, title: (item as { title: string }).title })),
      });
    }
  });

  return contradictions;
}
