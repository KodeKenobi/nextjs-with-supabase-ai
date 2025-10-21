const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

async function testWithAuthentication() {
  console.log("🔍 Testing with authentication using your account...");

  const baseUrl = "https://nextjs-with-supabase-ai.vercel.app";

  try {
    // Step 1: Login with your credentials
    console.log("\n🔐 Step 1: Logging in with your account");
    const loginData = {
      email: "kodekenobi@gmail.com",
      password: "Kopenikus0218!",
    };

    const loginResponse = await fetch(`${baseUrl}/api/auth/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    });

    console.log("Login status:", loginResponse.status);

    if (loginResponse.ok) {
      const loginResult = await loginResponse.json();
      console.log("✅ Login successful");

      // Extract session token from response
      const sessionToken = loginResult.session?.access_token;
      if (!sessionToken) {
        console.log("❌ No session token received");
        return;
      }

      // Step 2: Test creating a company with authentication
      console.log("\n🏢 Step 2: Creating a company with authentication");
      const companyData = {
        name: "Test Company " + Date.now(),
        description: "Test company created via authenticated API",
        industry: "Technology",
        website: "https://testcompany.com",
        size: "1-10",
        location: "Test City",
      };

      const companyResponse = await fetch(`${baseUrl}/api/companies`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionToken}`,
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

      // Step 3: Test uploading content with authentication
      console.log("\n📤 Step 3: Uploading content with authentication");
      const formData = new FormData();
      formData.append("title", "Test Content " + Date.now());
      formData.append(
        "description",
        "Test content uploaded via authenticated API"
      );
      formData.append("companyName", "Test Company");
      formData.append("contentType", "TEXT");
      formData.append("source", "FILE_UPLOAD");

      const uploadResponse = await fetch(`${baseUrl}/api/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
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

      // Step 4: Test getting companies list with authentication
      console.log("\n📋 Step 4: Getting companies list with authentication");
      const companiesResponse = await fetch(`${baseUrl}/api/companies`, {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      });

      console.log("Companies list status:", companiesResponse.status);
      if (companiesResponse.ok) {
        const companiesData = await companiesResponse.json();
        console.log(
          "✅ Companies list retrieved:",
          companiesData.length,
          "companies"
        );
        if (companiesData.length > 0) {
          console.log("First company:", companiesData[0]);
        }
      } else {
        const companiesError = await companiesResponse.json();
        console.log("❌ Companies list failed:", companiesError);
      }

      // Step 5: Test getting content list with authentication
      console.log("\n📄 Step 5: Getting content list with authentication");
      const contentResponse = await fetch(`${baseUrl}/api/content`, {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      });

      console.log("Content list status:", contentResponse.status);
      if (contentResponse.ok) {
        const contentData = await contentResponse.json();
        console.log("✅ Content list retrieved:", contentData.length, "items");
        if (contentData.length > 0) {
          console.log("First content item:", contentData[0]);
        }
      } else {
        const contentError = await contentResponse.json();
        console.log("❌ Content list failed:", contentError);
      }
    } else {
      const loginError = await loginResponse.json();
      console.log("❌ Login failed:", loginError);
    }
  } catch (error) {
    console.error("❌ Error testing with authentication:", error.message);
  }
}

testWithAuthentication().catch(console.error);
