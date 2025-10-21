const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

async function testActualFunctionality() {
  console.log(
    "🔍 Testing ACTUAL functionality after environment variable fix..."
  );

  const baseUrl = "https://nextjs-with-supabase-ai.vercel.app";

  try {
    // Test 1: Check environment variables
    console.log("\n🧪 Test 1: Environment variables");
    const envResponse = await fetch(`${baseUrl}/api/env-check`);
    const envData = await envResponse.json();
    console.log("Environment check:", envData);

    // Test 2: Test database connection
    console.log("\n🧪 Test 2: Database connection");
    const dbResponse = await fetch(`${baseUrl}/api/test-db`);
    console.log("Database status:", dbResponse.status);
    if (dbResponse.ok) {
      const dbData = await dbResponse.json();
      console.log("✅ Database working:", dbData);
    } else {
      const dbError = await dbResponse.json();
      console.log("❌ Database error:", dbError);
    }

    // Test 3: Test content API (should return 401, not 500)
    console.log("\n🧪 Test 3: Content API");
    const contentResponse = await fetch(`${baseUrl}/api/content`);
    console.log("Content API status:", contentResponse.status);
    if (contentResponse.status === 401) {
      console.log(
        "✅ Content API working (401 as expected for unauthenticated)"
      );
    } else if (contentResponse.status === 500) {
      const contentError = await contentResponse.json();
      console.log("❌ Content API still has 500 error:", contentError);
    }

    // Test 4: Test upload API (should return 401, not 500)
    console.log("\n🧪 Test 4: Upload API");
    const uploadResponse = await fetch(`${baseUrl}/api/upload`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: "Test",
        description: "Test",
        companyName: "Test Company",
        contentType: "TEXT",
        source: "FILE_UPLOAD",
      }),
    });
    console.log("Upload API status:", uploadResponse.status);
    if (uploadResponse.status === 401) {
      console.log(
        "✅ Upload API working (401 as expected for unauthenticated)"
      );
    } else if (uploadResponse.status === 500) {
      const uploadError = await uploadResponse.json();
      console.log("❌ Upload API still has 500 error:", uploadError);
    }

    // Test 5: Test insights API
    console.log("\n🧪 Test 5: Insights API");
    const insightsResponse = await fetch(`${baseUrl}/api/insights`);
    console.log("Insights API status:", insightsResponse.status);
    if (insightsResponse.status === 401) {
      console.log(
        "✅ Insights API working (401 as expected for unauthenticated)"
      );
    } else if (insightsResponse.status === 500) {
      const insightsError = await insightsResponse.json();
      console.log("❌ Insights API still has 500 error:", insightsError);
    }
  } catch (error) {
    console.error("❌ Error testing functionality:", error.message);
  }
}

testActualFunctionality().catch(console.error);
