"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Building2,
  FileText,
  BarChart3,
  Upload,
  Search,
  AlertTriangle,
  Plus,
  TrendingUp,
  Users,
  Database,
} from "lucide-react";
import Link from "next/link";

interface User {
  id: string;
  email?: string;
  user_metadata?: {
    first_name?: string;
    last_name?: string;
    company_name?: string;
  };
}

interface DashboardStats {
  companies: number;
  contentItems: number;
  insights: number;
  recentActivity: any[];
}

export default function DashboardOverview({ user }: { user: User }) {
  const [stats, setStats] = useState<DashboardStats>({
    companies: 0,
    contentItems: 0,
    insights: 0,
    recentActivity: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      const supabase = createClient();

      try {
        // Fetch companies count
        const { count: companiesCount } = await supabase
          .from("companies")
          .select("*", { count: "exact", head: true });

        // Fetch content items count
        const { count: contentCount } = await supabase
          .from("content_items")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id);

        // Fetch insights count
        const { count: insightsCount } = await supabase
          .from("business_insights")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id);

        // Fetch recent activity
        const { data: recentContent } = await supabase
          .from("content_items")
          .select("id, title, created_at, content_type")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(5);

        setStats({
          companies: companiesCount || 0,
          contentItems: contentCount || 0,
          insights: insightsCount || 0,
          recentActivity: recentContent || [],
        });
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [user.id]);

  const quickActions = [
    {
      title: "Add Company",
      description: "Create a new company profile",
      icon: Building2,
      href: "/dashboard/companies",
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      title: "Upload Content",
      description: "Add new content for analysis",
      icon: Upload,
      href: "/dashboard/upload",
      color: "bg-green-500 hover:bg-green-600",
    },
    {
      title: "View Insights",
      description: "Explore business insights",
      icon: BarChart3,
      href: "/dashboard/insights",
      color: "bg-purple-500 hover:bg-purple-600",
    },
    {
      title: "Search Companies",
      description: "Find and analyze companies",
      icon: Search,
      href: "/dashboard/companies",
      color: "bg-orange-500 hover:bg-orange-600",
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome back, {user.user_metadata?.first_name || "User"}!
        </h1>
        <p className="text-gray-600">
          Here's what's happening with your AI Data Repository.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Companies</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.companies}</div>
            <p className="text-xs text-muted-foreground">
              Total companies in database
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Content Items</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.contentItems}</div>
            <p className="text-xs text-muted-foreground">
              Your uploaded content
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Insights</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.insights}</div>
            <p className="text-xs text-muted-foreground">
              Generated business insights
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Recent Activity
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.recentActivity.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Items in last 5 activities
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <Card
              key={action.title}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <div className={`p-2 rounded-lg ${action.color} text-white`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-lg">{action.title}</CardTitle>
                </div>
                <CardDescription>{action.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href={action.href}>
                  <Button className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Get Started
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Your latest content uploads and activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          {stats.recentActivity.length > 0 ? (
            <div className="space-y-4">
              {stats.recentActivity.map((item) => (
                <div key={item.id} className="flex items-center space-x-4">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <FileText className="h-4 w-4 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-xs text-gray-500">
                      {item.content_type} •{" "}
                      {new Date(item.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No recent activity</p>
              <p className="text-sm text-gray-400">
                Upload some content to get started
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
