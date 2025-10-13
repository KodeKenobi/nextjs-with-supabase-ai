const { createClient } = require("@supabase/supabase-js");

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://localhost:3000";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseKey) {
  console.error("❌ No Supabase service key found");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testDatabase() {
  try {
    console.log("🔍 Testing database schema...");

    // Test 1: Try to create a company
    console.log("\n1️⃣ Testing company creation...");
    const companyId = "test-" + Date.now();
    const { data: company, error: companyError } = await supabase
      .from("companies")
      .insert({
        id: companyId,
        name: "Test Company",
        description: "Test Description",
        industry: "Test Industry",
        country: "Test Country",
        size: "Small",
        type: "TARGET",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .select()
      .single();

    if (companyError) {
      console.log("❌ Company creation failed:", companyError.message);
      console.log("🔍 Error code:", companyError.code);
      console.log("🔍 Error details:", companyError.details);
    } else {
      console.log("✅ Company created successfully:", company);
    }

    // Test 2: Check what columns exist
    console.log("\n2️⃣ Checking companies table columns...");
    const { data: columns, error: columnsError } = await supabase
      .from("companies")
      .select("*")
      .limit(1);

    if (columnsError) {
      console.log("❌ Column check failed:", columnsError.message);
    } else {
      console.log("✅ Available columns:", Object.keys(columns[0] || {}));
    }
  } catch (error) {
    console.error("💥 Database test error:", error.message);
  }
}

testDatabase();
