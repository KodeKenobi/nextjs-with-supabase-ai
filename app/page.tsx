import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import LandingPage from "@/components/landing-page";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  const supabase = await createClient();
  const resolvedSearchParams = await searchParams;

  // Check if this is an email confirmation redirect
  if (resolvedSearchParams.code) {
    redirect(`/auth/confirm?code=${resolvedSearchParams.code}`);
  }

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect to dashboard if user is logged in
  if (user) {
    console.log("🏠 Home page: Redirecting authenticated user to dashboard:", {
      email: user.email,
      userId: user.id,
      timestamp: new Date().toISOString(),
      lastSignIn: user.last_sign_in_at,
      confirmedAt: user.email_confirmed_at
    });
    redirect("/dashboard");
  } else {
    console.log("🏠 Home page: No authenticated user, showing landing page", {
      timestamp: new Date().toISOString()
    });
  }

  // Show the beautiful landing page for non-authenticated users
  return <LandingPage />;
}
