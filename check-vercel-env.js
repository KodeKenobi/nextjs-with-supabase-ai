const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

async function checkVercelEnv() {
  console.log("🔍 Checking Vercel environment variables...");

  const baseUrl = "https://nextjs-with-supabase-ai.vercel.app";

  try {
    // Check environment variables endpoint
    const envResponse = await fetch(`${baseUrl}/api/env-check`);
    const envData = await envResponse.json();

    console.log("📋 Vercel Environment Variables:");
    console.log("SUPABASE_URL:", envData.supabaseUrl);
    console.log("SUPABASE_ANON_KEY:", envData.supabaseAnonKey);
    console.log("SUPABASE_SERVICE_KEY:", envData.supabaseServiceKey);

    // Extract the actual Supabase URL from the key
    if (envData.supabaseAnonKey) {
      try {
        const payload = JSON.parse(atob(envData.supabaseAnonKey.split(".")[1]));
        console.log("\n🔍 Decoded JWT payload:");
        console.log("Issuer (iss):", payload.iss);
        console.log("Reference (ref):", payload.ref);
        console.log("Role:", payload.role);
        console.log("Issued at:", new Date(payload.iat * 1000));
        console.log("Expires at:", new Date(payload.exp * 1000));
      } catch (e) {
        console.log("Could not decode JWT payload");
      }
    }

    // Test database connection with Vercel's credentials
    console.log("\n🧪 Testing database with Vercel credentials...");
    const dbResponse = await fetch(`${baseUrl}/api/test-db`);
    const dbData = await dbResponse.json();

    console.log("Database test status:", dbResponse.status);
    console.log("Database test response:", dbData);
  } catch (error) {
    console.error("❌ Error checking Vercel environment:", error.message);
  }
}

checkVercelEnv().catch(console.error);
