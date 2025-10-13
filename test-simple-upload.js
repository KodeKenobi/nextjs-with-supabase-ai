const fetch = require("node-fetch");

async function testSimpleUpload() {
  try {
    console.log("🧪 Testing simple upload...");

    const response = await fetch("http://localhost:3002/api/upload", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: "Test Content",
        description: "Test Description",
        companyName: "Kode Kenobi",
        contentType: "TEXT",
        source: "DIRECT_INPUT",
        hasFile: false,
        hasText: true,
        textContent: "This is test content",
      }),
    });

    const result = await response.text();
    console.log("📊 Status:", response.status);
    console.log("📄 Response:", result);
  } catch (error) {
    console.error("💥 Error:", error.message);
  }
}

testSimpleUpload();
