import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  console.log("🚀 Ghost User Debug API called");

  try {
    const supabase = await createClient();

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    console.log("👤 User check:", {
      hasUser: !!user,
      userId: user?.id,
      userEmail: user?.email,
      error: userError?.message,
    });

    if (!user) {
      return NextResponse.json({ error: "No user found" }, { status: 401 });
    }

    // Test if we can query content_items for this specific user
    const { data: userContent, error: contentError } = await supabaseAdmin
      .from("content_items")
      .select("id, title, userId")
      .eq("userId", user.id)
      .limit(5);

    console.log("📄 User content query:", {
      success: !contentError,
      error: contentError?.message,
      contentCount: userContent?.length || 0,
      userId: user.id,
    });

    // Test if we can insert content for this user
    const testContent = {
      title: "Test Content for Ghost User",
      description: "Testing if ghost user can create content",
      contentType: "TEXT",
      source: "DIRECT_INPUT",
      status: "PENDING",
      userId: user.id,
      companyId: null,
    };

    const { data: insertedContent, error: insertError } = await supabaseAdmin
      .from("content_items")
      .insert(testContent)
      .select("id")
      .single();

    console.log("📝 Content insert test:", {
      success: !insertError,
      error: insertError?.message,
      insertedId: insertedContent?.id,
    });

    // Clean up test content
    if (insertedContent?.id) {
      await supabaseAdmin
        .from("content_items")
        .delete()
        .eq("id", insertedContent.id);
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
      },
      tests: {
        contentQuery: {
          success: !contentError,
          error: contentError?.message,
          count: userContent?.length || 0,
        },
        contentInsert: {
          success: !insertError,
          error: insertError?.message,
          insertedId: insertedContent?.id,
        },
      },
    });
  } catch (error) {
    console.error("❌ Ghost user debug error:", error);
    return NextResponse.json(
      {
        error: "Ghost user debug failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
