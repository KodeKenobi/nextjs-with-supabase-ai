import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST() {
  try {
    console.log("🔍 Debug upload - Starting environment check");

    // Check environment variables
    const envCheck = {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL
        ? "✅ Set"
        : "❌ Missing",
      supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        ? "✅ Set"
        : "❌ Missing",
      supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY
        ? "✅ Set"
        : "❌ Missing",
      openaiKey: process.env.OPENAI_API_KEY ? "✅ Set" : "❌ Missing",
    };

    console.log("🔍 Environment check:", envCheck);

    // Test Supabase client creation
    let supabaseClient;
    try {
      supabaseClient = await createClient();
      console.log("✅ Supabase client created successfully");
    } catch (error) {
      console.error("❌ Supabase client creation failed:", error);
      return NextResponse.json(
        {
          error: "Supabase client creation failed",
          details: error instanceof Error ? error.message : "Unknown error",
          envCheck,
        },
        { status: 500 }
      );
    }

    // Test user authentication
    let user;
    try {
      const {
        data: { user: authUser },
        error: userError,
      } = await supabaseClient.auth.getUser();
      if (userError || !authUser) {
        console.log("❌ User authentication failed:", userError?.message);
        return NextResponse.json(
          {
            error: "User authentication failed",
            details: userError?.message || "No user found",
            envCheck,
          },
          { status: 401 }
        );
      }
      user = authUser;
      console.log("✅ User authenticated:", user.email);
    } catch (error) {
      console.error("❌ User authentication error:", error);
      return NextResponse.json(
        {
          error: "User authentication error",
          details: error instanceof Error ? error.message : "Unknown error",
          envCheck,
        },
        { status: 500 }
      );
    }

    // Test database tables
    const tableTests = [];

    // Test companies table
    try {
      const { data: companies, error: companiesError } = await supabaseAdmin
        .from("companies")
        .select("id")
        .limit(1);

      tableTests.push({
        table: "companies",
        status: companiesError ? "❌ Error" : "✅ OK",
        error: companiesError?.message,
      });
    } catch (error) {
      tableTests.push({
        table: "companies",
        status: "❌ Error",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }

    // Test content_items table
    try {
      const { data: contentItems, error: contentItemsError } =
        await supabaseAdmin.from("content_items").select("id").limit(1);

      tableTests.push({
        table: "content_items",
        status: contentItemsError ? "❌ Error" : "✅ OK",
        error: contentItemsError?.message,
      });
    } catch (error) {
      tableTests.push({
        table: "content_items",
        status: "❌ Error",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }

    // Test transcriptions table
    try {
      const { data: transcriptions, error: transcriptionsError } =
        await supabaseAdmin.from("transcriptions").select("id").limit(1);

      tableTests.push({
        table: "transcriptions",
        status: transcriptionsError ? "❌ Error" : "✅ OK",
        error: transcriptionsError?.message,
      });
    } catch (error) {
      tableTests.push({
        table: "transcriptions",
        status: "❌ Error",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }

    // Test business_insights table
    try {
      const { data: insights, error: insightsError } = await supabaseAdmin
        .from("business_insights")
        .select("id")
        .limit(1);

      tableTests.push({
        table: "business_insights",
        status: insightsError ? "❌ Error" : "✅ OK",
        error: insightsError?.message,
      });
    } catch (error) {
      tableTests.push({
        table: "business_insights",
        status: "❌ Error",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }

    // Test storage bucket
    let storageTest: { status: string; error: string | null } = {
      status: "❌ Not tested",
      error: null,
    };
    try {
      const { data: buckets, error: bucketsError } =
        await supabaseClient.storage.listBuckets();
      if (bucketsError) {
        storageTest = {
          status: "❌ Error",
          error: bucketsError.message,
        };
      } else {
        const contentFilesBucket = buckets?.find(
          (bucket) => bucket.name === "content-files"
        );
        storageTest = {
          status: contentFilesBucket ? "✅ OK" : "❌ Missing bucket",
          error: contentFilesBucket ? null : "content-files bucket not found",
        };
      }
    } catch (error) {
      storageTest = {
        status: "❌ Error",
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }

    console.log("🔍 Debug upload - All tests completed");

    return NextResponse.json({
      success: true,
      envCheck,
      user: {
        id: user.id,
        email: user.email,
      },
      tableTests,
      storageTest,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Debug upload error:", error);
    return NextResponse.json(
      {
        error: "Debug upload failed",
        details: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : "No stack trace",
      },
      { status: 500 }
    );
  }
}
