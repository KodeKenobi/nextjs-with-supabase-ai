const { createClient } = require("@supabase/supabase-js");

// Manual environment variables from .env.local
const supabaseUrl = "https://xazhkbgjanwakrmvpqie.supabase.co";
const supabaseServiceKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhemhrYmdqYW53YWtybXZwcWllIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTE2NDc3NSwiZXhwIjoyMDc0NzQwNzc1fQ.6-hQThD69Zj5pFegUvKF-uBXFbas-aBRJsqhSgV2uSU";

console.log("🔍 Supabase URL:", supabaseUrl);
console.log(
  "🔍 Service Key (first 10 chars):",
  supabaseServiceKey?.substring(0, 10) + "..."
);

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function getAllUsers() {
  try {
    console.log("🔍 Fetching ALL users with comprehensive search...");

    // Try different approaches to get all users
    const approaches = [
      { name: "listUsers with high perPage", params: { perPage: 1000 } },
      { name: "listUsers with page 1", params: { page: 1, perPage: 1000 } },
      { name: "listUsers with page 2", params: { page: 2, perPage: 1000 } },
      { name: "listUsers with page 3", params: { page: 3, perPage: 1000 } },
      { name: "listUsers default", params: {} },
    ];

    let allUsers = [];
    let foundKodekenobi = false;

    for (const approach of approaches) {
      console.log(`\n🔍 Trying: ${approach.name}`);
      const { data: users, error } = await supabase.auth.admin.listUsers(
        approach.params
      );

      if (error) {
        console.error(`❌ Error with ${approach.name}:`, error.message);
        continue;
      }

      if (users?.users?.length > 0) {
        console.log(
          `✅ Found ${users.users.length} users with ${approach.name}`
        );

        users.users.forEach((user) => {
          if (user.email === "kodekenobi@gmail.com") {
            foundKodekenobi = true;
            console.log("🎯 FOUND KODEKENOBI:", {
              id: user.id,
              email: user.email,
              created: user.created_at,
              lastSignIn: user.last_sign_in_at,
              confirmed: user.email_confirmed_at,
            });
          }
        });

        // Add unique users to our list
        users.users.forEach((user) => {
          if (!allUsers.find((u) => u.id === user.id)) {
            allUsers.push(user);
          }
        });
      } else {
        console.log(`📭 No users found with ${approach.name}`);
      }
    }

    console.log("\n📋 FINAL RESULTS:");
    console.log("=".repeat(50));
    console.log(`Total unique users found: ${allUsers.length}`);
    console.log(
      `Found kodekenobi@gmail.com: ${foundKodekenobi ? "YES" : "NO"}`
    );
    console.log("=".repeat(50));

    if (allUsers.length > 0) {
      allUsers.forEach((user, index) => {
        console.log(`\n${index + 1}. ${user.email}`);
        console.log(`   ID: ${user.id}`);
        console.log(
          `   Created: ${new Date(user.created_at).toLocaleString()}`
        );
        console.log(
          `   Last Sign In: ${
            user.last_sign_in_at
              ? new Date(user.last_sign_in_at).toLocaleString()
              : "Never"
          }`
        );
        console.log(`   Confirmed: ${user.email_confirmed_at ? "Yes" : "No"}`);
      });
    }

    if (!foundKodekenobi) {
      console.log("\n🚨 KODEKENOBI NOT FOUND IN ANY QUERY!");
      console.log(
        "This means the user is authenticating through a different method or database."
      );
    }
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

getAllUsers();
