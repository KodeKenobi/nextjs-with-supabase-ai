const { createClient } = require("@supabase/supabase-js");

async function testWithSupabaseAuth() {
  console.log("🔍 Testing with Supabase authentication using your account...");

  // Use the production Supabase credentials
  const supabaseUrl = "https://xazhkbgjanwakrmvpqie.supabase.co";
  const supabaseKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhemhrYmdqYW53YWtybXZwcWllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxNjQ3NzUsImV4cCI6MjA3NDc0MDc3NX0.X6G5YtNr5XPQcEwrm_rx41e1X0z42lRIVEV8MW9b02w";

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
    console.log("Email:", authData.user?.email);

    const accessToken = authData.session?.access_token;
    if (!accessToken) {
      console.log("❌ No access token received");
      return;
    }

    // Step 2: Test creating a company with authentication
    console.log("\n🏢 Step 2: Creating a company with authentication");
    const companyData = {
      name: "Test Company " + Date.now(),
      description: "Test company created via authenticated API",
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
      console.log("✅ Company created successfully:", companyResult);
    }

    // Step 3: Test uploading content with authentication
    console.log("\n📤 Step 3: Uploading content with authentication");
    const contentData = {
      title: "Test Content " + Date.now(),
      description: "Test content uploaded via authenticated API",
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
      console.log("✅ Content uploaded successfully:", contentResult);
    }

    // Step 4: Test getting companies list
    console.log("\n📋 Step 4: Getting companies list");
    const { data: companiesData, error: companiesError } = await supabase
      .from("companies")
      .select("*");

    if (companiesError) {
      console.log("❌ Companies list failed:", companiesError.message);
    } else {
      console.log(
        "✅ Companies list retrieved:",
        companiesData.length,
        "companies"
      );
      if (companiesData.length > 0) {
        console.log("First company:", companiesData[0]);
      }
    }

    // Step 5: Test getting content list
    console.log("\n📄 Step 5: Getting content list");
    const { data: contentListData, error: contentListError } = await supabase
      .from("content_items")
      .select("*");

    if (contentListError) {
      console.log("❌ Content list failed:", contentListError.message);
    } else {
      console.log(
        "✅ Content list retrieved:",
        contentListData.length,
        "items"
      );
      if (contentListData.length > 0) {
        console.log("First content item:", contentListData[0]);
      }
    }

    // Step 6: Test the actual API endpoints with the session
    console.log("\n🌐 Step 6: Testing API endpoints with session");
    const baseUrl = "https://nextjs-with-supabase-ai.vercel.app";

    // Test companies API
    const companiesApiResponse = await fetch(`${baseUrl}/api/companies`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    console.log("Companies API status:", companiesApiResponse.status);
    if (companiesApiResponse.ok) {
      const companiesApiData = await companiesApiResponse.json();
      console.log(
        "✅ Companies API working:",
        companiesApiData.length,
        "companies"
      );
    } else {
      const companiesApiError = await companiesApiResponse.json();
      console.log("❌ Companies API failed:", companiesApiError);
    }

    // Test content API
    const contentApiResponse = await fetch(`${baseUrl}/api/content`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    console.log("Content API status:", contentApiResponse.status);
    if (contentApiResponse.ok) {
      const contentApiData = await contentApiResponse.json();
      console.log("✅ Content API working:", contentApiData.length, "items");
    } else {
      const contentApiError = await contentApiResponse.json();
      console.log("❌ Content API failed:", contentApiError);
    }
  } catch (error) {
    console.error(
      "❌ Error testing with Supabase authentication:",
      error.message
    );
  }
}

testWithSupabaseAuth().catch(console.error);
