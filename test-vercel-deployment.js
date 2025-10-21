const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

async function testVercelDeployment() {
  console.log("🔍 Testing Vercel deployment...");

  const baseUrl = "https://nextjs-with-supabase-ai.vercel.app";

  try {
    // Test env-check with timestamp to avoid cache
    const timestamp = Date.now();
    const envResponse = await fetch(`${baseUrl}/api/env-check?t=${timestamp}`);
    const envData = await envResponse.json();

    console.log("📋 Environment Variables:");
    console.log(JSON.stringify(envData, null, 2));

    // Test if we can see the actual Supabase URL
    if (
      envData.supabaseUrl &&
      envData.supabaseUrl !== "Set" &&
      envData.supabaseUrl !== "Missing"
    ) {
      console.log("\n🔍 Supabase URL found:", envData.supabaseUrl);

      // Extract the project ID from the URL
      const urlMatch = envData.supabaseUrl.match(
        /https:\/\/([^.]+)\.supabase\.co/
      );
      if (urlMatch) {
        console.log("Project ID:", urlMatch[1]);
      }
    }

    // Test database connection
    console.log("\n🧪 Testing database connection...");
    const dbResponse = await fetch(`${baseUrl}/api/test-db?t=${timestamp}`);
    const dbData = await dbResponse.json();

    console.log("Database test status:", dbResponse.status);
    console.log("Database test response:", JSON.stringify(dbData, null, 2));
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

testVercelDeployment().catch(console.error);
