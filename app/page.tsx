import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import LandingPage from "@/components/landing-page";

export default async function Home({
  searchParams,
}: {
  searchParams: { code?: string };
}) {
  const supabase = await createClient();

  // Check if this is an email confirmation redirect
  if (searchParams.code) {
    redirect(`/auth/confirm?code=${searchParams.code}`);
  }

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect to dashboard if user is logged in
  if (user) {
    redirect("/dashboard");
  }

  // Show the beautiful landing page for non-authenticated users
  return <LandingPage />;
}
