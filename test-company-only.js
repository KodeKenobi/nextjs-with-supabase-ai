const fetch = require("node-fetch");

async function testCompanyOnly() {
  try {
    console.log("🧪 Testing company creation only...");

    // Test just the company creation part
    const response = await fetch("http://localhost:3002/api/companies", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "Test Company Direct",
        description: "Test Description",
        industry: "Test Industry",
        country: "Test Country",
        size: "Small",
        type: "TARGET",
      }),
    });

    const result = await response.text();
    console.log("📊 Status:", response.status);
    console.log("📄 Response:", result);
  } catch (error) {
    console.error("💥 Error:", error.message);
  }
}

testCompanyOnly();
