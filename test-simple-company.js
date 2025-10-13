const fetch = require("node-fetch");

async function testSimpleCompany() {
  try {
    console.log("🧪 Testing simple company creation...");

    // Test with just the absolute minimum fields
    const response = await fetch("http://localhost:3002/api/companies", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "Test Company Simple",
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

testSimpleCompany();
