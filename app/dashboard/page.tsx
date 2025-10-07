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
    redirect("/auth/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavigation user={user} />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <DashboardOverview user={user} />
      </main>
    </div>
  );
}
