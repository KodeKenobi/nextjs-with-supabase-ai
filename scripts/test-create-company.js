// Usage:
//   COOKIE="<paste your browser cookie string>" node scripts/test-create-company.js "Acme Inc"

const { getAuthCookieFromEnv } = require("./_auth");
const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
async function getCookie() {
  if (process.env.COOKIE) return process.env.COOKIE;
  return await getAuthCookieFromEnv();
}

const nameArg = process.argv[2] || `Script Co ${Date.now()}`;

async function run() {
  const payload = {
    name: nameArg,
    description: "Created via test script",
    industry: "Software",
    country: "US",
    size: "Small",
    type: "TARGET",
  };

  const cookie = await getCookie();
  const res = await fetch(`${BASE_URL}/api/companies`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookie,
    },
    body: JSON.stringify(payload),
  });

  const text = await res.text();
  if (!res.ok) {
    console.error("❌ Create company failed:", res.status, text);
    process.exit(1);
  }
  console.log("✅ Company created:", text);
}

run().catch((e) => {
  console.error("💥 Script error:", e);
  process.exit(1);
});
