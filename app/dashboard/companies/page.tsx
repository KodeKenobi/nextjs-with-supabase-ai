import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DashboardNavigation from "@/components/dashboard/navigation";
import CompanySearch from "@/components/search/company-search";
import CompanyCreationForm from "@/components/companies/company-creation-form";

export default async function CompaniesPage() {
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
            <h1 className="text-3xl font-bold text-gray-900">Companies</h1>
            <p className="mt-2 text-gray-600">
              View all companies and manage company information
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Company Creation Form */}
            <div className="lg:col-span-1">
              <CompanyCreationForm />
            </div>

            {/* Company Search */}
            <div className="lg:col-span-2">
              <CompanySearch />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
