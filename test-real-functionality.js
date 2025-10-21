const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

async function testRealFunctionality() {
  console.log(
    "🔍 Testing REAL functionality - adding companies and uploading content..."
  );

  const baseUrl = "https://nextjs-with-supabase-ai.vercel.app";

  try {
    // Test 1: Try to create a company
    console.log("\n🧪 Test 1: Creating a company");
    const companyData = {
      name: "Test Company " + Date.now(),
      description: "Test company created via API",
      industry: "Technology",
      website: "https://testcompany.com",
      size: "1-10",
      location: "Test City",
    };

    const companyResponse = await fetch(`${baseUrl}/api/companies`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(companyData),
    });

    console.log("Company creation status:", companyResponse.status);
    if (companyResponse.ok) {
      const companyResult = await companyResponse.json();
      console.log("✅ Company created successfully:", companyResult);
    } else {
      const companyError = await companyResponse.json();
      console.log("❌ Company creation failed:", companyError);
    }

    // Test 2: Try to upload content
    console.log("\n🧪 Test 2: Uploading content");
    const formData = new FormData();
    formData.append("title", "Test Content " + Date.now());
    formData.append("description", "Test content uploaded via API");
    formData.append("companyName", "Test Company");
    formData.append("contentType", "TEXT");
    formData.append("source", "FILE_UPLOAD");

    const uploadResponse = await fetch(`${baseUrl}/api/upload`, {
      method: "POST",
      body: formData,
    });

    console.log("Content upload status:", uploadResponse.status);
    if (uploadResponse.ok) {
      const uploadResult = await uploadResponse.json();
      console.log("✅ Content uploaded successfully:", uploadResult);
    } else {
      const uploadError = await uploadResponse.json();
      console.log("❌ Content upload failed:", uploadError);
    }

    // Test 3: Try to get companies list
    console.log("\n🧪 Test 3: Getting companies list");
    const companiesResponse = await fetch(`${baseUrl}/api/companies`);
    console.log("Companies list status:", companiesResponse.status);
    if (companiesResponse.ok) {
      const companiesData = await companiesResponse.json();
      console.log(
        "✅ Companies list retrieved:",
        companiesData.length,
        "companies"
      );
    } else {
      const companiesError = await companiesResponse.json();
      console.log("❌ Companies list failed:", companiesError);
    }

    // Test 4: Try to get content list
    console.log("\n🧪 Test 4: Getting content list");
    const contentResponse = await fetch(`${baseUrl}/api/content`);
    console.log("Content list status:", contentResponse.status);
    if (contentResponse.ok) {
      const contentData = await contentResponse.json();
      console.log("✅ Content list retrieved:", contentData.length, "items");
    } else {
      const contentError = await contentResponse.json();
      console.log("❌ Content list failed:", contentError);
    }
  } catch (error) {
    console.error("❌ Error testing real functionality:", error.message);
  }
}

testRealFunctionality().catch(console.error);
