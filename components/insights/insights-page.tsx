"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Brain,
  Search,
  Filter,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Calendar,
  BarChart3,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface BusinessInsight {
  id: string;
  category: string;
  title: string;
  content: string;
  priority: string;
  confidence?: number;
  created_at: string;
  content_item?: {
    id: string;
    title: string;
    content_type: string;
  };
}

export default function InsightsPage() {
  const [insights, setInsights] = useState<BusinessInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    try {
      const response = await fetch("/api/insights");
      if (response.ok) {
        const data = await response.json();
        setInsights(data);
      } else {
        console.error("Failed to fetch insights");
        setInsights([]);
      }
    } catch (error) {
      console.error("Error fetching insights:", error);
      setInsights([]);
    } finally {
      setLoading(false);
    }
  };

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

  const getCategoryIcon = (category: string) => {
    switch (category?.toLowerCase()) {
      case "business_model":
        return <BarChart3 className="h-4 w-4" />;
      case "marketing":
        return <TrendingUp className="h-4 w-4" />;
      case "risks":
        return <AlertTriangle className="h-4 w-4" />;
      case "opportunities":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Brain className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category?.toLowerCase()) {
      case "business_model":
        return "bg-blue-100 text-blue-800";
      case "marketing":
        return "bg-green-100 text-green-800";
      case "risks":
        return "bg-red-100 text-red-800";
      case "opportunities":
        return "bg-purple-100 text-purple-800";
      case "operations":
        return "bg-orange-100 text-orange-800";
      case "financial":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredInsights = insights.filter((insight) => {
    const matchesSearch =
      insight.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      insight.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      filterCategory === "all" ||
      insight.category.toLowerCase() === filterCategory;
    const matchesPriority =
      filterPriority === "all" ||
      insight.priority.toLowerCase() === filterPriority;
    return matchesSearch && matchesCategory && matchesPriority;
  });

  const getInsightStats = () => {
    const total = insights.length;
    const critical = insights.filter((i) => i.priority === "CRITICAL").length;
    const high = insights.filter((i) => i.priority === "HIGH").length;
    const avgConfidence =
      insights.reduce((acc, i) => acc + (i.confidence || 0), 0) / total || 0;

    return { total, critical, high, avgConfidence };
  };

  const stats = getInsightStats();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Brain className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Insights
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.total}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Critical</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.critical}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  High Priority
                </p>
                <p className="text-2xl font-bold text-gray-900">{stats.high}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Avg Confidence
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(stats.avgConfidence * 100)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search insights..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full sm:w-80"
            />
          </div>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm"
            >
              <option value="all">All Categories</option>
              <option value="business_model">Business Model</option>
              <option value="marketing">Marketing</option>
              <option value="risks">Risks</option>
              <option value="opportunities">Opportunities</option>
              <option value="operations">Operations</option>
              <option value="financial">Financial</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm"
            >
              <option value="all">All Priorities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Insights Grid */}
      {filteredInsights.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Brain className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {insights.length === 0
                ? "No insights yet"
                : "No insights match your filters"}
            </h3>
            <p className="text-gray-500 mb-6">
              {insights.length === 0
                ? "Upload content to generate business insights"
                : "Try adjusting your search or filter criteria"}
            </p>
            <Button asChild>
              <a href="/dashboard/upload">Upload Content</a>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInsights.map((insight) => (
            <Card
              key={insight.id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(insight.category)}
                    <CardTitle className="text-lg line-clamp-1">
                      {insight.title}
                    </CardTitle>
                  </div>
                  <Badge className={getPriorityColor(insight.priority)}>
                    {insight.priority}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getCategoryColor(insight.category)}>
                    {insight.category.replace("_", " ")}
                  </Badge>
                  {insight.confidence && (
                    <span className="text-xs text-gray-500">
                      {Math.round(insight.confidence * 100)}% confidence
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 line-clamp-3 mb-4">
                  {insight.content}
                </p>

                {insight.content_item && (
                  <div className="border-t pt-3">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDistanceToNow(new Date(insight.created_at), {
                          addSuffix: true,
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {insight.content_item.content_type.replace("_", " ")}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1 truncate">
                      From: {insight.content_item.title}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
