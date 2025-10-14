import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(_request: NextRequest) {
  try {
    console.log("🔍 Checking database schema...");

    // Check companies table structure
    console.log("1️⃣ Checking companies table...");
    const { data: companiesData, error: companiesError } = await supabaseAdmin
      .from("companies")
      .select("*")
      .limit(1);

    let companiesInfo = {};
    if (companiesError) {
      console.log("❌ Companies table error:", companiesError.message);
      companiesInfo = {
        error: companiesError.message,
        code: companiesError.code,
      };
    } else {
      console.log("✅ Companies table accessible");
      if (companiesData && companiesData.length > 0) {
        companiesInfo = {
          success: true,
          columns: Object.keys(companiesData[0]),
          sampleData: companiesData[0],
        };
      } else {
        // Try a simple insert to see what columns are expected
        const testId = crypto.randomUUID();
        const { error: insertError } = await supabaseAdmin
          .from("companies")
          .insert({
            id: testId,
            name: "Test Company Schema Check",
          });

        if (insertError) {
          companiesInfo = {
            error: insertError.message,
            code: insertError.code,
            details: insertError.details,
          };
        } else {
          companiesInfo = { success: true, message: "Test insert successful" };
          // Clean up
          await supabaseAdmin.from("companies").delete().eq("id", testId);
        }
      }
    }

    // Check content_items table structure
    console.log("2️⃣ Checking content_items table...");
    const { data: contentData, error: contentError } = await supabaseAdmin
      .from("content_items")
      .select("*")
      .limit(1);

    let contentInfo = {};
    if (contentError) {
      console.log("❌ Content items table error:", contentError.message);
      contentInfo = { error: contentError.message, code: contentError.code };
    } else {
      console.log("✅ Content items table accessible");
      if (contentData && contentData.length > 0) {
        contentInfo = {
          success: true,
          columns: Object.keys(contentData[0]),
          sampleData: contentData[0],
        };
      } else {
        contentInfo = { success: true, message: "No content items found" };
      }
    }

    return NextResponse.json({
      success: true,
      companies: companiesInfo,
      content_items: contentInfo,
      message: "Schema check completed",
    });
  } catch (error) {
    console.error("❌ Schema check failed:", error);
    return NextResponse.json(
      {
        error: "Schema check failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
