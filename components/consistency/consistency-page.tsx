"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Search,
  AlertTriangle,
  CheckCircle,
  FileText,
  Brain,
  RefreshCw,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Contradiction {
  id: string;
  content1: string;
  content2: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  category: string;
  source1: {
    id: string;
    title: string;
    type: string;
  };
  source2: {
    id: string;
    title: string;
    type: string;
  };
}

interface ConsistencyReport {
  id: string;
  title: string;
  description: string;
  total_contradictions: number;
  contradictions: Contradiction[];
  created_at: string;
  status: "PENDING" | "RUNNING" | "COMPLETED" | "FAILED";
}

export default function ConsistencyPage() {
  const [reports, setReports] = useState<ConsistencyReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await fetch("/api/consistency");
      if (response.ok) {
        const data = await response.json();
        setReports(data);
      } else {
        console.error("Failed to fetch consistency reports");
        setReports([]);
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  const runConsistencyCheck = async () => {
    setIsRunning(true);
    setError("");

    try {
      const response = await fetch("/api/consistency/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to run consistency check");
      }

      const data = await response.json();

      // Refresh reports list
      await fetchReports();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to run consistency check"
      );
    } finally {
      setIsRunning(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
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
          <h1 className="text-2xl font-bold text-gray-900">
            Consistency Check
          </h1>
          <p className="text-gray-600">
            Analyze your content for contradictions and inconsistencies
          </p>
        </div>
        <Button
          onClick={runConsistencyCheck}
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
              <Search className="h-4 w-4" />
              Run Consistency Check
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
            <Search className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No consistency reports yet
            </h3>
            <p className="text-gray-500 mb-6">
              Run your first consistency check to analyze your content
            </p>
            <Button onClick={runConsistencyCheck} disabled={isRunning}>
              <Search className="h-4 w-4 mr-2" />
              Run First Check
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
                <div className="space-y-4">
                  {/* Summary Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                        <span className="font-medium text-gray-900">
                          Total Contradictions
                        </span>
                      </div>
                      <p className="text-2xl font-bold text-gray-900 mt-1">
                        {report.total_contradictions}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-blue-600" />
                        <span className="font-medium text-gray-900">
                          Content Analyzed
                        </span>
                      </div>
                      <p className="text-2xl font-bold text-gray-900 mt-1">
                        {report.contradictions.length > 0
                          ? new Set(
                              report.contradictions.flatMap((c) => [
                                c.source1.id,
                                c.source2.id,
                              ])
                            ).size
                          : 0}
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
                        {
                          new Set(report.contradictions.map((c) => c.category))
                            .size
                        }
                      </p>
                    </div>
                  </div>

                  {/* Contradictions List */}
                  {report.contradictions.length > 0 ? (
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900">
                        Contradictions Found
                      </h4>
                      {report.contradictions.map((contradiction) => (
                        <div
                          key={contradiction.id}
                          className="border rounded-lg p-4 bg-red-50"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <AlertTriangle className="h-4 w-4 text-red-600" />
                              <span className="font-medium text-gray-900">
                                {contradiction.category}
                              </span>
                            </div>
                            <Badge
                              className={getSeverityColor(
                                contradiction.severity
                              )}
                            >
                              {contradiction.severity}
                            </Badge>
                          </div>

                          <div className="space-y-3">
                            <div>
                              <p className="text-sm font-medium text-gray-700 mb-1">
                                Statement 1:
                              </p>
                              <p className="text-sm text-gray-600 bg-white p-2 rounded border-l-4 border-blue-500">
                                "{contradiction.content1}"
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                From: {contradiction.source1.title} (
                                {contradiction.source1.type})
                              </p>
                            </div>

                            <div>
                              <p className="text-sm font-medium text-gray-700 mb-1">
                                Contradicts with:
                              </p>
                              <p className="text-sm text-gray-600 bg-white p-2 rounded border-l-4 border-red-500">
                                "{contradiction.content2}"
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                From: {contradiction.source2.title} (
                                {contradiction.source2.type})
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-green-50 rounded-lg">
                      <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-600" />
                      <h4 className="font-medium text-green-900 mb-2">
                        No Contradictions Found
                      </h4>
                      <p className="text-green-700">
                        Your content is consistent across all sources
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
