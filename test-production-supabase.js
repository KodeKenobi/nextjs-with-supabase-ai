const { createClient } = require("@supabase/supabase-js");

// Test production Supabase directly
async function testProductionSupabase() {
  console.log("🔍 Testing PRODUCTION Supabase connection...");

  // Use production Supabase URL and key from .env.local
  const supabaseUrl = "https://xazhkbgjanwakrmvpqie.supabase.co";
  const supabaseKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhemhrYmdqYW53YWtybXZwcWllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxNjQ3NzUsImV4cCI6MjA3NDc0MDc3NX0.X6G5YtNr5XPQcEwrm_rx41e1X0z42lRIVEV8MW9b02w";

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // Test 1: List all tables
    console.log("\n🧪 Test 1: List all tables");
    const { data: tables, error: tablesError } = await supabase
      .from("information_schema.tables")
      .select("table_name")
      .eq("table_schema", "public");

    if (tablesError) {
      console.error("❌ Tables list error:", tablesError.message);
    } else {
      console.log(
        "✅ Available tables:",
        tables?.map((t) => t.table_name) || []
      );
    }

    // Test 2: Check companies table
    console.log("\n🧪 Test 2: Companies table");
    const { data: companies, error: companiesError } = await supabase
      .from("companies")
      .select("*")
      .limit(1);

    if (companiesError) {
      console.error("❌ Companies error:", companiesError.message);
      console.error("Code:", companiesError.code);
    } else {
      console.log("✅ Companies table works");
    }

    // Test 3: Check content_items table
    console.log("\n🧪 Test 3: Content items table");
    const { data: content, error: contentError } = await supabase
      .from("content_items")
      .select("*")
      .limit(1);

    if (contentError) {
      console.error("❌ Content items error:", contentError.message);
      console.error("Code:", contentError.code);
    } else {
      console.log("✅ Content items table works");
    }
  } catch (error) {
    console.error("❌ General error:", error.message);
  }
}

testProductionSupabase().catch(console.error);
