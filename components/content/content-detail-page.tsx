"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
// import { Alert } from "@/components/ui/alert";
import {
  FileText,
  Video,
  Mic,
  Play,
  Pause,
  Download,
  Share,
  ArrowLeft,
  Calendar,
  Clock,
  Brain,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

interface ContentDetailPageProps {
  contentId: string;
}

interface ContentItem {
  id: string;
  title: string;
  description?: string;
  contenttype: string;
  status: string;
  createdat: string;
  processedat?: string;
  filename?: string;
  filesize?: number;
  duration?: number;
  companyid?: string;
  companies?: {
    id: string;
    name: string;
    industry?: string;
  };
  transcriptions?: {
    id: string;
    content: string;
    language?: string;
    confidence?: number;
    wordCount?: number;
  }[];
  business_insights?: {
    id: string;
    category: string;
    title: string;
    content: string;
    priority: string;
    confidence?: number;
  }[];
}

export default function ContentDetailPage({
  contentId,
}: ContentDetailPageProps) {
  const [content, setContent] = useState<ContentItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);

  const fetchContent = useCallback(async () => {
    try {
      const response = await fetch(`/api/content/${contentId}`);
      if (response.ok) {
        const data = await response.json();
        setContent(data);
      } else {
        setError("Failed to load content");
      }
    } catch (err) {
      setError("Failed to load content");
      console.error("Error fetching content:", err);
    } finally {
      setLoading(false);
    }
  }, [contentId]);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  const getContentIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case "audio":
        return <Mic className="h-6 w-6" />;
      case "video":
        return <Video className="h-6 w-6" />;
      case "text":
      case "document":
        return <FileText className="h-6 w-6" />;
      default:
        return <FileText className="h-6 w-6" />;
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

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "Unknown size";
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return "Unknown duration";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
          <div className="space-y-4">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-48 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-red-500" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {error || "Content not found"}
        </h3>
        <p className="text-gray-500 mb-6">
          {error ||
            "The content you're looking for doesn't exist or has been removed."}
        </p>
        <Button asChild>
          <Link href="/dashboard/content">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Content Library
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/content">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            {getContentIcon(content.contenttype)}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {content.title}
              </h1>
              <p className="text-gray-600">{content.description}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={getStatusColor(content.status)}>
            {content.status}
          </Badge>
          <Button size="sm" variant="outline">
            <Share className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button size="sm" variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Media Player */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="h-5 w-5" />
                Media Player
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-100 rounded-lg p-8 text-center">
                <div className="mb-4">
                  {getContentIcon(content.contenttype)}
                </div>
                <p className="text-gray-600 mb-4">
                  {content.filename} • {formatFileSize(content.filesize)} •{" "}
                  {formatDuration(content.duration)}
                </p>
                <Button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="mb-4"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="h-4 w-4 mr-2" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Play
                    </>
                  )}
                </Button>
                <p className="text-sm text-gray-500">
                  Media playback will be implemented in the full version
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Transcription */}
          {content.transcriptions && content.transcriptions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Transcription
                </CardTitle>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {content.transcriptions[0].wordCount} words
                  </span>
                  {content.transcriptions[0].language && (
                    <span>Language: {content.transcriptions[0].language}</span>
                  )}
                  {content.transcriptions[0].confidence && (
                    <span>
                      Confidence:{" "}
                      {Math.round(content.transcriptions[0].confidence * 100)}%
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 leading-relaxed">
                    {content.transcriptions[0].content}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Content Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Content Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-700">Type:</span>
                <span className="text-sm text-gray-600">
                  {content.contenttype.replace("_", " ")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Status:
                </span>
                <Badge className={getStatusColor(content.status)}>
                  {content.status}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Created:
                </span>
                <span className="text-sm text-gray-600">
                  {formatDistanceToNow(new Date(content.createdat), {
                    addSuffix: true,
                  })}
                </span>
              </div>
              {content.processedat && (
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    Processed:
                  </span>
                  <span className="text-sm text-gray-600">
                    {formatDistanceToNow(new Date(content.processedat), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              )}
              {content.filename && (
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    File:
                  </span>
                  <span className="text-sm text-gray-600 truncate ml-2">
                    {content.filename}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Business Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Business Insights
                {content.business_insights && (
                  <Badge variant="secondary">
                    {content.business_insights.length}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {content.business_insights &&
              content.business_insights.length > 0 ? (
                <div className="space-y-3">
                  {content.business_insights.map((insight) => (
                    <div key={insight.id} className="border rounded-lg p-3">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-sm text-gray-900">
                          {insight.title}
                        </h4>
                        <Badge className={getPriorityColor(insight.priority)}>
                          {insight.priority}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">
                        {insight.category.replace("_", " ")}
                      </p>
                      <p className="text-sm text-gray-700 line-clamp-2">
                        {insight.content}
                      </p>
                      {insight.confidence && (
                        <div className="mt-2 text-xs text-gray-500">
                          Confidence: {Math.round(insight.confidence * 100)}%
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <Brain className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm text-gray-500">No insights available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
