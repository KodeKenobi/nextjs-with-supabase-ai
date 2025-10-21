const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

async function testLocalhostEndpoints() {
  console.log("🔍 Testing localhost endpoints...");
  
  const baseUrl = "http://localhost:3000";
  
  try {
    // Test 1: Environment check
    console.log("\n🧪 Test 1: Environment check");
    const envResponse = await fetch(`${baseUrl}/api/env-check`);
    const envData = await envResponse.json();
    console.log("Environment check:", envData);
    
    // Test 2: Database test
    console.log("\n🧪 Test 2: Database test");
    const dbResponse = await fetch(`${baseUrl}/api/test-db`);
    console.log("Database status:", dbResponse.status);
    if (dbResponse.ok) {
      const dbData = await dbResponse.json();
      console.log("✅ Database working:", dbData);
    } else {
      const dbError = await dbResponse.json();
      console.log("❌ Database error:", dbError);
    }
    
    // Test 3: Content API
    console.log("\n🧪 Test 3: Content API");
    const contentResponse = await fetch(`${baseUrl}/api/content`);
    console.log("Content API status:", contentResponse.status);
    if (contentResponse.status === 401) {
      console.log("✅ Content API working (401 as expected for unauthenticated)");
    } else if (contentResponse.status === 500) {
      const contentError = await contentResponse.json();
      console.log("❌ Content API has 500 error:", contentError);
    }
    
    // Test 4: Companies API
    console.log("\n🧪 Test 4: Companies API");
    const companiesResponse = await fetch(`${baseUrl}/api/companies`);
    console.log("Companies API status:", companiesResponse.status);
    if (companiesResponse.status === 401) {
      console.log("✅ Companies API working (401 as expected for unauthenticated)");
    } else if (companiesResponse.status === 500) {
      const companiesError = await companiesResponse.json();
      console.log("❌ Companies API has 500 error:", companiesError);
    }
    
    // Test 5: Upload API
    console.log("\n🧪 Test 5: Upload API");
    const uploadResponse = await fetch(`${baseUrl}/api/upload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: 'Test',
        description: 'Test',
        companyName: 'Test Company',
        contentType: 'TEXT',
        source: 'FILE_UPLOAD'
      })
    });
    console.log("Upload API status:", uploadResponse.status);
    if (uploadResponse.status === 401) {
      console.log("✅ Upload API working (401 as expected for unauthenticated)");
    } else if (uploadResponse.status === 500) {
      const uploadError = await uploadResponse.json();
      console.log("❌ Upload API has 500 error:", uploadError);
    }
    
  } catch (error) {
    console.error("❌ Error testing localhost endpoints:", error.message);
  }
}

testLocalhostEndpoints().catch(console.error);
