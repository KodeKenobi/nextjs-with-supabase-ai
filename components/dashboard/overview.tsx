"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Brain,
  CheckCircle,
  Clock,
  Upload,
  BarChart3,
  Search,
  AlertTriangle,
  TrendingUp,
  Play,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  companyName?: string | null;
}

interface Stats {
  totalContent: number;
  totalInsights: number;
  processedContent: number;
  pendingContent: number;
}

interface ContentItem {
  id: string;
  title: string;
  contentType: string;
  status: string;
  createdAt: Date;
  transcription?: {
    id: string;
    content: string;
    language?: string | null;
    confidence?: number | null;
    wordCount?: number | null;
  } | null;
  insights: {
    id: string;
    priority: string;
  }[];
}

interface Insight {
  id: string;
  category: string;
  title: string;
  priority: string;
  createdAt: Date;
}

interface Report {
  id: string;
  title: string;
  totalContradictions?: number;
  totalGaps?: number;
  priorityGaps?: number;
  createdAt: Date;
}

interface DashboardOverviewProps {
  user: User;
  stats: Stats;
  recentContent: ContentItem[];
  recentInsights: Insight[];
  consistencyReport: Report | null;
  gapAnalysisReport: Report | null;
}

const getPriorityColor = (priority: string) => {
  switch (priority?.toLowerCase()) {
    case "critical":
      return "bg-red-100 text-red-800";
    case "high":
      return "bg-orange-100 text-orange-800";
    case "medium":
      return "bg-yellow-100 text-yellow-800";
    case "low":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case "completed":
      return "bg-green-100 text-green-800";
    case "processing":
    case "transcribing":
    case "analyzing":
      return "bg-blue-100 text-blue-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "failed":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function DashboardOverview({
  user,
  stats,
  recentContent,
  recentInsights,
  consistencyReport,
  gapAnalysisReport,
}: DashboardOverviewProps) {
  const displayName =
    user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : user?.name || "there";

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {displayName}!
        </h1>
        <p className="mt-2 text-gray-600">
          Here's what's happening with your content repository
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Content
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalContent}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Brain className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Insights
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalInsights}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Processed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.processedContent}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.pendingContent}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Upload className="h-5 w-5 mr-2 text-blue-600" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/dashboard/upload">
                <Button className="w-full justify-start">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Content
                </Button>
              </Link>
              <Link href="/dashboard/companies">
                <Button variant="outline" className="w-full justify-start">
                  <Search className="h-4 w-4 mr-2" />
                  Search Companies
                </Button>
              </Link>
              <Link href="/dashboard/insights">
                <Button variant="outline" className="w-full justify-start">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Insights
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Content */}
        <div>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-blue-600" />
                Recent Content
              </CardTitle>
              <Link href="/dashboard/content">
                <Button size="sm" variant="outline">
                  View All
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {recentContent.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-500 mb-4">No content yet</p>
                  <Link href="/dashboard/upload">
                    <Button size="sm">Upload Content</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentContent.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">
                          {item.title}
                        </h4>
                        <div className="flex items-center mt-1 space-x-2">
                          <Badge variant="secondary" className="text-xs">
                            {item.contentType.replace("_", " ")}
                          </Badge>
                          <Badge className={getStatusColor(item.status)}>
                            {item.status}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {formatDistanceToNow(new Date(item.createdAt), {
                              addSuffix: true,
                            })}
                          </span>
                        </div>
                      </div>
                      <Link href={`/dashboard/content/${item.id}`}>
                        <Button size="sm" variant="outline">
                          <Play className="h-3 w-3" />
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Insights */}
        <div>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-purple-600" />
                Latest Insights
              </CardTitle>
              <Link href="/dashboard/insights">
                <Button size="sm" variant="outline">
                  View All
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {recentInsights.length === 0 ? (
                <div className="text-center py-8">
                  <Brain className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-500 mb-4">No insights yet</p>
                  <Link href="/dashboard/upload">
                    <Button size="sm">Upload Content</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentInsights.map((insight) => (
                    <div
                      key={insight.id}
                      className="p-3 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">
                            {insight.title}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {insight.category.replace("_", " ")}
                          </p>
                          <div className="flex items-center mt-2 space-x-2">
                            <Badge
                              className={getPriorityColor(insight.priority)}
                            >
                              {insight.priority}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {formatDistanceToNow(
                                new Date(insight.createdAt),
                                {
                                  addSuffix: true,
                                }
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Reports Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Consistency Report */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="h-5 w-5 mr-2 text-green-600" />
              Consistency Report
            </CardTitle>
          </CardHeader>
          <CardContent>
            {consistencyReport ? (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-600">
                      Last updated:{" "}
                      {formatDistanceToNow(
                        new Date(consistencyReport.createdAt),
                        { addSuffix: true }
                      )}
                    </p>
                  </div>
                  <Link href="/dashboard/consistency">
                    <Button size="sm">View Report</Button>
                  </Link>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      Contradictions:
                    </span>
                    <span className="font-medium">
                      {consistencyReport.totalContradictions || 0}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm text-gray-500 mb-4">
                  No consistency report yet
                </p>
                <Link href="/dashboard/consistency">
                  <Button size="sm">Run Analysis</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Gap Analysis Report */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
              Gap Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            {gapAnalysisReport ? (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-600">
                      Last updated:{" "}
                      {formatDistanceToNow(
                        new Date(gapAnalysisReport.createdAt),
                        { addSuffix: true }
                      )}
                    </p>
                  </div>
                  <Link href="/dashboard/gaps">
                    <Button size="sm">View Report</Button>
                  </Link>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Gaps:</span>
                    <span className="font-medium">
                      {gapAnalysisReport.totalGaps || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      Priority Gaps:
                    </span>
                    <span className="font-medium">
                      {gapAnalysisReport.priorityGaps || 0}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm text-gray-500 mb-4">
                  No gap analysis yet
                </p>
                <Link href="/dashboard/gaps">
                  <Button size="sm">Run Analysis</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
