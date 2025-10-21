// Auth helper: sign in with email/password using Supabase and return Cookie header string
// Env required: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, TEST_EMAIL, TEST_PASSWORD

const { createClient } = require("@supabase/supabase-js");

async function getAuthCookieFromEnv() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const email = process.env.TEST_EMAIL;
  const password = process.env.TEST_PASSWORD;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in env"
    );
  }
  if (!email || !password) {
    throw new Error("Missing TEST_EMAIL or TEST_PASSWORD in env");
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error || !data.session) {
    throw new Error(`Auth failed: ${error?.message || "no session"}`);
  }
  const access = data.session.access_token;
  const refresh = data.session.refresh_token;
  // Cookies expected by @supabase/ssr middleware
  const cookie = `sb-${
    supabaseUrl.split("//")[1].split(".")[0]
  }-auth-token=${access}; sb-${
    supabaseUrl.split("//")[1].split(".")[0]
  }-auth-token.${refresh}`;
  return cookie;
}

module.exports = { getAuthCookieFromEnv };
