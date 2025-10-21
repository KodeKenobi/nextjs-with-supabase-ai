const { createClient } = require("@supabase/supabase-js");

async function testFullFunctionality() {
  console.log(
    "🔍 Testing FULL functionality - creating companies and uploading content..."
  );

  // Use the correct Supabase credentials
  const supabaseUrl = "https://gtmoekjobnpspvvqpngw.supabase.co";
  const supabaseKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0bW9la2pvYm5wc3B2dnFwbmd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk3NjkxOTcsImV4cCI6MjA3NTM0NTE5N30.zokfwtPV8Mupw0aTDz4s3H2_eVT_06hlqHOisHru7uU";

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // Step 1: Login with your credentials
    console.log("\n🔐 Step 1: Logging in with your account");
    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email: "kodekenobi@gmail.com",
        password: "Kopenikus0218!",
      });

    if (authError) {
      console.log("❌ Login failed:", authError.message);
      return;
    }

    console.log("✅ Login successful!");
    console.log("User ID:", authData.user?.id);

    // Step 2: Create a company using the API
    console.log("\n🏢 Step 2: Creating a company via API");
    const companyData = {
      name: "API Test Company " + Date.now(),
      description: "Company created via API test",
      industry: "Technology",
      country: "Test Country",
      size: "1-10",
      type: "TARGET",
    };

    const { data: companyResult, error: companyError } = await supabase
      .from("companies")
      .insert([companyData])
      .select();

    if (companyError) {
      console.log("❌ Company creation failed:", companyError.message);
    } else {
      console.log("✅ Company created successfully:", companyResult[0]);
    }

    // Step 3: Upload content using the API
    console.log("\n📤 Step 3: Uploading content via API");
    const contentData = {
      title: "API Test Content " + Date.now(),
      description: "Content uploaded via API test",
      contenttype: "TEXT",
      source: "FILE_UPLOAD",
      userid: authData.user?.id,
      status: "PENDING",
    };

    const { data: contentResult, error: contentError } = await supabase
      .from("content_items")
      .insert([contentData])
      .select();

    if (contentError) {
      console.log("❌ Content upload failed:", contentError.message);
    } else {
      console.log("✅ Content uploaded successfully:", contentResult[0]);
    }

    // Step 4: Test the actual Vercel API endpoints
    console.log("\n🌐 Step 4: Testing Vercel API endpoints");
    const baseUrl = "https://nextjs-with-supabase-ai.vercel.app";

    // Test companies API
    const companiesResponse = await fetch(`${baseUrl}/api/companies`);
    console.log("Companies API status:", companiesResponse.status);
    if (companiesResponse.ok) {
      const companiesData = await companiesResponse.json();
      console.log(
        "✅ Companies API working:",
        companiesData.length,
        "companies"
      );
    } else {
      const companiesError = await companiesResponse.json();
      console.log("❌ Companies API failed:", companiesError);
    }

    // Test content API
    const contentResponse = await fetch(`${baseUrl}/api/content`);
    console.log("Content API status:", contentResponse.status);
    if (contentResponse.ok) {
      const contentData = await contentResponse.json();
      console.log("✅ Content API working:", contentData.length, "items");
    } else {
      const contentError = await contentResponse.json();
      console.log("❌ Content API failed:", contentError);
    }

    // Test upload API
    console.log("\n📤 Step 5: Testing upload API");
    const formData = new FormData();
    formData.append("title", "API Test Upload " + Date.now());
    formData.append("description", "Testing upload via API");
    formData.append("companyName", "Test Company");
    formData.append("contentType", "TEXT");
    formData.append("source", "FILE_UPLOAD");

    const uploadResponse = await fetch(`${baseUrl}/api/upload`, {
      method: "POST",
      body: formData,
    });

    console.log("Upload API status:", uploadResponse.status);
    if (uploadResponse.ok) {
      const uploadResult = await uploadResponse.json();
      console.log("✅ Upload API working:", uploadResult);
    } else {
      const uploadError = await uploadResponse.json();
      console.log("❌ Upload API failed:", uploadError);
    }
  } catch (error) {
    console.error("❌ Error testing functionality:", error.message);
  }
}

testFullFunctionality().catch(console.error);
