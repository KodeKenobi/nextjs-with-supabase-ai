import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DashboardNavigation from "@/components/dashboard/navigation";
import DashboardOverview from "@/components/dashboard/overview";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    console.log("❌ No authenticated user found, redirecting to login");
    redirect("/auth/login");
  }

  console.log("✅ User signed in:", {
    id: user.id,
    email: user.email,
    firstName: user.user_metadata?.first_name,
    lastName: user.user_metadata?.last_name,
    companyName: user.user_metadata?.company_name,
    confirmedAt: user.email_confirmed_at,
    createdAt: user.created_at,
    lastSignIn: user.last_sign_in_at,
    timestamp: new Date().toISOString(),
    sessionId: user.app_metadata?.provider_id || 'unknown'
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavigation user={user} />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <DashboardOverview user={user} />
      </main>
    </div>
  );
}
