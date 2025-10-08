"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Target,
  Brain,
  RefreshCw,
  ArrowRight,
  Lightbulb,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Gap {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  impact: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  effort: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  recommendations: string[];
  related_content: {
    id: string;
    title: string;
    type: string;
  }[];
}

interface GapAnalysisReport {
  id: string;
  title: string;
  description: string;
  total_gaps: number;
  priority_gaps: number;
  gaps: Gap[];
  created_at: string;
  status: "PENDING" | "RUNNING" | "COMPLETED" | "FAILED";
}

export default function GapAnalysisPage() {
  const [reports, setReports] = useState<GapAnalysisReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await fetch("/api/gaps");
      if (response.ok) {
        const data = await response.json();
        setReports(data);
      } else {
        console.error("Failed to fetch gap analysis reports");
        setReports([]);
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  const runGapAnalysis = async () => {
    setIsRunning(true);
    setError("");

    try {
      // Simulate running gap analysis
      await new Promise((resolve) => setTimeout(resolve, 4000));

      // Add new report
      const newReport: GapAnalysisReport = {
        id: Date.now().toString(),
        title: `Gap Analysis - ${new Date().toLocaleDateString()}`,
        description: "Latest gap analysis of content strategy",
        total_gaps: 0,
        priority_gaps: 0,
        gaps: [],
        created_at: new Date().toISOString(),
        status: "COMPLETED",
      };

      setReports((prev) => [newReport, ...prev]);
    } catch {
      setError("Failed to run gap analysis");
    } finally {
      setIsRunning(false);
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

  const getImpactColor = (impact: string) => {
    switch (impact?.toLowerCase()) {
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

  const getEffortColor = (effort: string) => {
    switch (effort?.toLowerCase()) {
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
      case "running":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
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
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gap Analysis</h1>
          <p className="text-gray-600">
            Identify content gaps and opportunities in your strategy
          </p>
        </div>
        <Button
          onClick={runGapAnalysis}
          disabled={isRunning}
          className="flex items-center gap-2"
        >
          {isRunning ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              Running Analysis...
            </>
          ) : (
            <>
              <TrendingUp className="h-4 w-4" />
              Run Gap Analysis
            </>
          )}
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Reports List */}
      {reports.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <TrendingUp className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No gap analysis reports yet
            </h3>
            <p className="text-gray-500 mb-6">
              Run your first gap analysis to identify content opportunities
            </p>
            <Button onClick={runGapAnalysis} disabled={isRunning}>
              <TrendingUp className="h-4 w-4 mr-2" />
              Run First Analysis
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {reports.map((report) => (
            <Card key={report.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{report.title}</CardTitle>
                    <p className="text-gray-600 mt-1">{report.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(report.status)}>
                      {report.status}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {formatDistanceToNow(new Date(report.created_at), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Summary Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-2">
                        <Target className="h-5 w-5 text-blue-600" />
                        <span className="font-medium text-gray-900">
                          Total Gaps
                        </span>
                      </div>
                      <p className="text-2xl font-bold text-gray-900 mt-1">
                        {report.total_gaps}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-orange-600" />
                        <span className="font-medium text-gray-900">
                          Priority Gaps
                        </span>
                      </div>
                      <p className="text-2xl font-bold text-gray-900 mt-1">
                        {report.priority_gaps}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-2">
                        <Brain className="h-5 w-5 text-purple-600" />
                        <span className="font-medium text-gray-900">
                          Categories
                        </span>
                      </div>
                      <p className="text-2xl font-bold text-gray-900 mt-1">
                        {new Set(report.gaps.map((g) => g.category)).size}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-2">
                        <Lightbulb className="h-5 w-5 text-green-600" />
                        <span className="font-medium text-gray-900">
                          Recommendations
                        </span>
                      </div>
                      <p className="text-2xl font-bold text-gray-900 mt-1">
                        {report.gaps.reduce(
                          (acc, gap) => acc + gap.recommendations.length,
                          0
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Gaps List */}
                  {report.gaps.length > 0 ? (
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900">
                        Identified Gaps
                      </h4>
                      {report.gaps.map((gap) => (
                        <div
                          key={gap.id}
                          className="border rounded-lg p-6 bg-orange-50"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h5 className="font-medium text-gray-900 text-lg">
                                {gap.title}
                              </h5>
                              <p className="text-gray-600 mt-1">
                                {gap.description}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className="bg-blue-100 text-blue-800">
                                {gap.category}
                              </Badge>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                              <span className="text-sm font-medium text-gray-700">
                                Priority:
                              </span>
                              <Badge
                                className={`ml-2 ${getPriorityColor(
                                  gap.priority
                                )}`}
                              >
                                {gap.priority}
                              </Badge>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-gray-700">
                                Impact:
                              </span>
                              <Badge
                                className={`ml-2 ${getImpactColor(gap.impact)}`}
                              >
                                {gap.impact}
                              </Badge>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-gray-700">
                                Effort:
                              </span>
                              <Badge
                                className={`ml-2 ${getEffortColor(gap.effort)}`}
                              >
                                {gap.effort}
                              </Badge>
                            </div>
                          </div>

                          {/* Recommendations */}
                          <div className="mb-4">
                            <h6 className="font-medium text-gray-900 mb-2">
                              Recommendations:
                            </h6>
                            <ul className="space-y-1">
                              {gap.recommendations.map((rec, index) => (
                                <li
                                  key={index}
                                  className="flex items-start gap-2 text-sm text-gray-700"
                                >
                                  <ArrowRight className="h-3 w-3 mt-1 text-blue-600 flex-shrink-0" />
                                  {rec}
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Related Content */}
                          {gap.related_content.length > 0 && (
                            <div>
                              <h6 className="font-medium text-gray-900 mb-2">
                                Related Content:
                              </h6>
                              <div className="flex flex-wrap gap-2">
                                {gap.related_content.map((content) => (
                                  <Badge
                                    key={content.id}
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {content.title} ({content.type})
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-green-50 rounded-lg">
                      <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-600" />
                      <h4 className="font-medium text-green-900 mb-2">
                        No Gaps Identified
                      </h4>
                      <p className="text-green-700">
                        Your content strategy appears to be comprehensive
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
