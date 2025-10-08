import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DashboardNavigation from "@/components/dashboard/navigation";
import ContentDetailPage from "@/components/content/content-detail-page";

interface ContentDetailProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ContentDetail({ params }: ContentDetailProps) {
  const { id } = await params;
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
          <ContentDetailPage contentId={id} />
        </div>
      </main>
    </div>
  );
}
