const fetch = require("node-fetch");

async function testDebugUpload() {
  try {
    console.log("🧪 Testing debug upload...");

    // Test with curl-like approach
    const formData = new URLSearchParams();
    formData.append("title", "Debug Test");
    formData.append("description", "Debug Description");
    formData.append("companyName", "Kode Kenobi");
    formData.append("contentType", "TEXT");
    formData.append("source", "DIRECT_INPUT");
    formData.append("hasFile", "false");
    formData.append("hasText", "true");
    formData.append("textContent", "Debug test content");

    const response = await fetch("http://localhost:3002/api/upload", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData,
    });

    const result = await response.text();
    console.log("📊 Status:", response.status);
    console.log("📄 Response:", result);

    // Also try to get more details
    if (!response.ok) {
      console.log(
        "🔍 Response headers:",
        Object.fromEntries(response.headers.entries())
      );
    }
  } catch (error) {
    console.error("💥 Error:", error.message);
  }
}

testDebugUpload();
