const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

async function testAPI() {
  console.log("🔍 Testing API routes...");

  const baseUrl = "https://nextjs-with-supabase-ai.vercel.app";

  // Test 1: Environment check
  console.log("\n🧪 Test 1: Environment check");
  try {
    const envResponse = await fetch(`${baseUrl}/api/env-check`);
    const envData = await envResponse.json();
    console.log("Status:", envResponse.status);
    console.log("Response:", envData);
  } catch (error) {
    console.error("❌ Environment check failed:", error.message);
  }

  // Test 2: Database test
  console.log("\n🧪 Test 2: Database test");
  try {
    const dbResponse = await fetch(`${baseUrl}/api/test-db`);
    console.log("Status:", dbResponse.status);
    if (dbResponse.ok) {
      const dbData = await dbResponse.json();
      console.log("Response:", dbData);
    } else {
      const errorText = await dbResponse.text();
      console.log("Error response:", errorText);
    }
  } catch (error) {
    console.error("❌ Database test failed:", error.message);
  }

  // Test 3: Content API (this is failing)
  console.log("\n🧪 Test 3: Content API");
  try {
    const contentResponse = await fetch(`${baseUrl}/api/content`);
    console.log("Status:", contentResponse.status);
    if (contentResponse.ok) {
      const contentData = await contentResponse.json();
      console.log("Response:", contentData);
    } else {
      const errorText = await contentResponse.text();
      console.log("Error response:", errorText);
    }
  } catch (error) {
    console.error("❌ Content API failed:", error.message);
  }

  // Test 4: Insights API
  console.log("\n🧪 Test 4: Insights API");
  try {
    const insightsResponse = await fetch(`${baseUrl}/api/insights`);
    console.log("Status:", insightsResponse.status);
    if (insightsResponse.ok) {
      const insightsData = await insightsResponse.json();
      console.log("Response:", insightsData);
    } else {
      const errorText = await insightsResponse.text();
      console.log("Error response:", errorText);
    }
  } catch (error) {
    console.error("❌ Insights API failed:", error.message);
  }
}

testAPI().catch(console.error);
