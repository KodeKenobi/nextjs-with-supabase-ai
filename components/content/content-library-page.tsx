"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  FileText,
  Video,
  Mic,
  Upload,
  Search,
  Play,
  Eye,
  Calendar,
  Filter,
  Building2,
} from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

interface ContentItem {
  id: string;
  title: string;
  description?: string;
  content_type: string;
  status: string;
  created_at: string;
  processed_at?: string;
  company_id?: string;
  companies?: {
    id: string;
    name: string;
    industry?: string;
  };
  transcription?: {
    word_count?: number;
    language?: string;
  };
  business_insights?: {
    id: string;
    priority: string;
  }[];
}

export default function ContentLibraryPage() {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await fetch("/api/content");
      if (response.ok) {
        const data = await response.json();
        setContent(data);
      } else {
        console.error("Failed to fetch content");
        setContent([]);
      }
    } catch (error) {
      console.error("Error fetching content:", error);
      setContent([]);
    } finally {
      setLoading(false);
    }
  };

  const getContentIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case "audio":
        return <Mic className="h-5 w-5" />;
      case "video":
        return <Video className="h-5 w-5" />;
      case "text":
      case "document":
        return <FileText className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
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

  const filteredContent = content.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType =
      filterType === "all" || item.content_type.toLowerCase() === filterType;
    const matchesStatus =
      filterStatus === "all" || item.status.toLowerCase() === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

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
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full sm:w-80"
            />
          </div>
        </div>
        <Button asChild>
          <Link href="/dashboard/upload">
            <Upload className="h-4 w-4 mr-2" />
            Upload Content
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm"
          >
            <option value="all">All Types</option>
            <option value="audio">Audio</option>
            <option value="video">Video</option>
            <option value="text">Text</option>
            <option value="document">Document</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="processing">Processing</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Content Grid */}
      {filteredContent.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {content.length === 0
                ? "No content yet"
                : "No content matches your filters"}
            </h3>
            <p className="text-gray-500 mb-6">
              {content.length === 0
                ? "Upload your first piece of content to get started"
                : "Try adjusting your search or filter criteria"}
            </p>
            <Button asChild>
              <Link href="/dashboard/upload">
                <Upload className="h-4 w-4 mr-2" />
                Upload Content
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContent.map((item) => (
            <Card key={item.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {getContentIcon(item.content_type)}
                    <CardTitle className="text-lg line-clamp-1">
                      {item.title}
                    </CardTitle>
                  </div>
                  <Badge className={getStatusColor(item.status)}>
                    {item.status}
                  </Badge>
                </div>
                {item.companies && (
                  <div className="mt-2">
                    <Badge variant="outline" className="text-xs">
                      <Building2 className="h-3 w-3 mr-1" />
                      {item.companies.name}
                    </Badge>
                    {item.companies.industry && (
                      <Badge variant="secondary" className="text-xs ml-2">
                        {item.companies.industry}
                      </Badge>
                    )}
                  </div>
                )}
                {item.description && (
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {item.description}
                  </p>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* Content Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDistanceToNow(new Date(item.created_at), {
                        addSuffix: true,
                      })}
                    </span>
                    {item.transcription?.word_count && (
                      <span>{item.transcription.word_count} words</span>
                    )}
                  </div>

                  {/* Business Insights */}
                  {item.business_insights &&
                    item.business_insights.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-700">
                          Insights:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {item.business_insights.slice(0, 3).map((insight) => (
                            <Badge
                              key={insight.id}
                              className={getPriorityColor(insight.priority)}
                              variant="secondary"
                            >
                              {insight.priority}
                            </Badge>
                          ))}
                          {item.business_insights.length > 3 && (
                            <Badge variant="secondary">
                              +{item.business_insights.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" asChild className="flex-1">
                      <Link href={`/dashboard/content/${item.id}`}>
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Link>
                    </Button>
                    {item.status === "completed" && (
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/dashboard/content/${item.id}#play`}>
                          <Play className="h-3 w-3" />
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
