// Direct API test using service role key
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing environment variables");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function testCompanyCreation() {
  try {
    console.log("🧪 Testing direct company creation...");

    const { data, error } = await supabase
      .from("companies")
      .insert({
        name: `Test Company ${Date.now()}`,
        description: "Created via direct API test",
        industry: "Software",
        country: "US",
        size: "Small",
        type: "TARGET",
      })
      .select()
      .single();

    if (error) {
      console.error("❌ Error:", error);
    } else {
      console.log("✅ Company created:", data);
    }
  } catch (err) {
    console.error("💥 Script error:", err);
  }
}

testCompanyCreation();
