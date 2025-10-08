import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DashboardNavigation from "@/components/dashboard/navigation";
import GapAnalysisPage from "@/components/gaps/gap-analysis-page";

export default async function GapsPageRoute() {
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
            <h1 className="text-3xl font-bold text-gray-900">Gap Analysis</h1>
            <p className="mt-2 text-gray-600">
              Identify gaps and opportunities in your content strategy
            </p>
          </div>
          <GapAnalysisPage />
        </div>
      </main>
    </div>
  );
}
