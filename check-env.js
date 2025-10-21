// Environment check script
console.log("🔍 Checking environment variables...\n");

const requiredVars = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "OPENAI_API_KEY",
  "NEXTAUTH_URL",
  "NEXTAUTH_SECRET",
];

let allPresent = true;

console.log("📋 Environment Variables Status:");
console.log("================================");

requiredVars.forEach((varName) => {
  const value = process.env[varName];
  const status = value ? "✅ Set" : "❌ Missing";
  const displayValue = value
    ? value.length > 20
      ? value.substring(0, 20) + "..."
      : value
    : "Not set";

  console.log(`${varName}: ${status}`);
  if (value) {
    console.log(`  Value: ${displayValue}`);
  }
  console.log("");

  if (!value) {
    allPresent = false;
  }
});

if (allPresent) {
  console.log("🎉 All required environment variables are set!");
} else {
  console.log("⚠️  Some environment variables are missing.");
  console.log(
    "📝 Please create a .env.local file with the required variables."
  );
  console.log("📄 See env-template.txt for reference.");
}
