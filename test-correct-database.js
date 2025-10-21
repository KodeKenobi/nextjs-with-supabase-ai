const { createClient } = require("@supabase/supabase-js");

async function testCorrectDatabase() {
  console.log("🔍 Testing the CORRECT database that should be used...");

  // Use the correct Supabase credentials you provided
  const supabaseUrl = "https://gtmoekjobnpspvvqpngw.supabase.co";
  const supabaseKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0bW9la2pvYm5wc3B2dnFwbmd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk3NjkxOTcsImV4cCI6MjA3NTM0NTE5N30.zokfwtPV8Mupw0aTDz4s3H2_eVT_06hlqHOisHru7uU";

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // Test 1: Check if companies table exists
    console.log("\n🧪 Test 1: Companies table");
    const { data: companies, error: companiesError } = await supabase
      .from("companies")
      .select("*")
      .limit(1);

    if (companiesError) {
      console.error("❌ Companies table error:", companiesError.message);
      console.error("Error code:", companiesError.code);
      console.error("Error details:", companiesError.details);
    } else {
      console.log("✅ Companies table accessible");
      console.log("Companies count:", companies?.length || 0);
    }

    // Test 2: Check if content_items table exists
    console.log("\n🧪 Test 2: Content items table");
    const { data: contentItems, error: contentError } = await supabase
      .from("content_items")
      .select("*")
      .limit(1);

    if (contentError) {
      console.error("❌ Content items table error:", contentError.message);
      console.error("Error code:", contentError.code);
      console.error("Error details:", contentError.details);
    } else {
      console.log("✅ Content items table accessible");
      console.log("Content items count:", contentItems?.length || 0);
    }

    // Test 3: Check if transcriptions table exists
    console.log("\n🧪 Test 3: Transcriptions table");
    const { data: transcriptions, error: transcriptionsError } = await supabase
      .from("transcriptions")
      .select("*")
      .limit(1);

    if (transcriptionsError) {
      console.error(
        "❌ Transcriptions table error:",
        transcriptionsError.message
      );
      console.error("Error code:", transcriptionsError.code);
      console.error("Error details:", transcriptionsError.details);
    } else {
      console.log("✅ Transcriptions table accessible");
      console.log("Transcriptions count:", transcriptions?.length || 0);
    }

    // Test 4: Check if business_insights table exists
    console.log("\n🧪 Test 4: Business insights table");
    const { data: insights, error: insightsError } = await supabase
      .from("business_insights")
      .select("*")
      .limit(1);

    if (insightsError) {
      console.error("❌ Business insights table error:", insightsError.message);
      console.error("Error code:", insightsError.code);
      console.error("Error details:", insightsError.details);
    } else {
      console.log("✅ Business insights table accessible");
      console.log("Insights count:", insights?.length || 0);
    }
  } catch (error) {
    console.error("❌ General error:", error.message);
  }
}

testCorrectDatabase().catch(console.error);
