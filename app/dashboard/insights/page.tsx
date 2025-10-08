import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DashboardNavigation from "@/components/dashboard/navigation";
import InsightsPage from "@/components/insights/insights-page";

export default async function InsightsPageRoute() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavigation user={user} />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Business Insights
            </h1>
            <p className="mt-2 text-gray-600">
              View and analyze business insights from your content
            </p>
          </div>
          <InsightsPage />
        </div>
      </main>
    </div>
  );
}
