const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

async function debugVercelSupabase() {
  console.log("🔍 Debugging Vercel Supabase connection...");

  const baseUrl = "https://nextjs-with-supabase-ai.vercel.app";

  try {
    // Get the actual environment variables
    const envResponse = await fetch(`${baseUrl}/api/env-check`);
    const envData = await envResponse.json();

    console.log("📋 Vercel Environment Variables:");
    console.log("SUPABASE_URL:", envData.supabaseUrl);
    console.log(
      "SUPABASE_ANON_KEY:",
      envData.supabaseAnonKey?.substring(0, 50) + "..."
    );
    console.log(
      "SUPABASE_SERVICE_KEY:",
      envData.supabaseServiceKey?.substring(0, 50) + "..."
    );

    // Test the actual Supabase connection that Vercel is using
    console.log(
      "\n🧪 Testing Supabase connection with Vercel's credentials..."
    );

    // We need to make a request that will show us the actual Supabase URL being used
    const testResponse = await fetch(`${baseUrl}/api/test-db`);
    const testData = await testResponse.json();

    console.log("Test response:", testData);

    // Let's also check if there are any other API endpoints that might give us more info
    console.log("\n🧪 Testing other endpoints...");

    const contentResponse = await fetch(`${baseUrl}/api/content`);
    console.log("Content API status:", contentResponse.status);

    if (!contentResponse.ok) {
      const contentData = await contentResponse.json();
      console.log("Content API error:", contentData);
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

debugVercelSupabase().catch(console.error);
