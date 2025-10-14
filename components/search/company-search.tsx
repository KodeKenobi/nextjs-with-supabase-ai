"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Building2, ExternalLink, Plus } from "lucide-react";
import Link from "next/link";

interface BusinessInsight {
  id: string;
  category: string;
  title: string;
  content: string;
  priority: string;
  confidence: number;
}

interface ContentItem {
  id: string;
  title: string;
  description?: string;
  contenttype: string;
  status: string;
  createdat: string;
}

interface Company {
  id: string;
  name: string;
  trading_name?: string;
  description?: string;
  industry?: string;
  website?: string;
  country?: string;
  size?: string;
  type?: string;
  createdAt?: string;
  insights?: BusinessInsight[];
  content_items?: ContentItem[];
  contentTypes?: Record<string, number>;
  totalContent?: number;
  totalInsights?: number;
}

interface SearchResults {
  companies: Company[];
  relatedContent: unknown[];
  query: string;
}

export default function CompanySearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResults | null>(null);
  const [allCompanies, setAllCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch all companies on component mount
  useEffect(() => {
    const fetchAllCompanies = async () => {
      try {
        const response = await fetch("/api/companies");
        console.log("Companies API response status:", response.status);
        if (response.ok) {
          const companies = await response.json();
          console.log("Companies fetched:", companies);
          setAllCompanies(companies);
        } else {
          const errorText = await response.text();
          console.error("Companies API error:", errorText);
        }
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    };

    fetchAllCompanies();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `/api/search/companies?q=${encodeURIComponent(query)}`
      );
      if (!response.ok) {
        throw new Error("Search failed");
      }
      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError("Failed to search companies");
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getTypeColor = (type?: string) => {
    switch (type?.toLowerCase()) {
      case "supplier":
        return "bg-blue-100 text-blue-800";
      case "competitor":
        return "bg-red-100 text-red-800";
      case "partner":
        return "bg-green-100 text-green-800";
      case "target":
        return "bg-purple-100 text-purple-800";
      case "customer":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="h-5 w-5 mr-2" />
            Search Companies
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-4">
            <Input
              placeholder="Search for companies..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={loading || !query.trim()}>
              {loading ? "Searching..." : "Search"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Search Results or All Companies */}
      <div className="space-y-6">
        {results ? (
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              Search Results for &ldquo;{results.query}&rdquo;
            </h2>
            <span className="text-sm text-gray-500">
              {results.companies.length} companies found
            </span>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">All Companies</h2>
            <span className="text-sm text-gray-500">
              {allCompanies.length} companies
            </span>
          </div>
        )}

        {results?.companies.length === 0 ||
        (results === null && allCompanies.length === 0) ? (
          <Card>
            <CardContent className="text-center py-8">
              <Building2 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500 mb-4">No companies found</p>
              <Button asChild>
                <Link href="/dashboard/companies/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Company
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(results?.companies || allCompanies).map((company) => (
              <Card
                key={company.id}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() =>
                  (window.location.href = `/dashboard/companies/${company.id}`)
                }
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{company.name}</CardTitle>
                      {company.trading_name && (
                        <p className="text-sm text-gray-600">
                          Trading as: {company.trading_name}
                        </p>
                      )}
                    </div>
                    {company.type && (
                      <Badge className={getTypeColor(company.type)}>
                        {company.type}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Content Stats */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="flex items-center">
                        <Building2 className="h-4 w-4 mr-1" />
                        {company.totalContent || 0} content
                      </span>
                      <span className="flex items-center">
                        💡 {company.totalInsights || 0} insights
                      </span>
                    </div>
                  </div>

                  {/* Top Insights */}
                  {company.insights && company.insights.length > 0 && (
                    <div className="mb-3">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">
                        Key Insights:
                      </h4>
                      <div className="space-y-2">
                        {company.insights.slice(0, 2).map((insight) => (
                          <div
                            key={insight.id}
                            className="bg-gray-50 rounded-md p-2"
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-medium text-gray-700">
                                {insight.category.replace("_", " ")}
                              </span>
                              <Badge
                                variant="secondary"
                                className={`text-xs ${
                                  insight.priority === "HIGH"
                                    ? "bg-red-100 text-red-800"
                                    : insight.priority === "MEDIUM"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-green-100 text-green-800"
                                }`}
                              >
                                {insight.priority}
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-600 line-clamp-2">
                              {insight.content}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Content Types */}
                  {company.contentTypes &&
                    Object.keys(company.contentTypes).length > 0 && (
                      <div className="mb-3">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">
                          Content Types:
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {Object.entries(company.contentTypes).map(
                            ([type, count]) => (
                              <Badge
                                key={type}
                                variant="outline"
                                className="text-xs"
                              >
                                {type} ({count})
                              </Badge>
                            )
                          )}
                        </div>
                      </div>
                    )}

                  {/* Show content-based description from first content item */}
                  {company.content_items &&
                    company.content_items.length > 0 && (
                      <div className="mb-3">
                        <p className="text-sm text-gray-600 line-clamp-3">
                          {company.content_items[0].description ||
                            company.content_items[0].title ||
                            "Content uploaded for analysis"}
                        </p>
                      </div>
                    )}

                  {/* Fallback to basic info if no content */}
                  {(!company.content_items ||
                    company.content_items.length === 0) && (
                    <div className="space-y-2">
                      {company.description && (
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {company.description}
                        </p>
                      )}
                      {company.industry && (
                        <div className="flex items-center text-sm">
                          <span className="font-medium text-gray-700">
                            Industry:
                          </span>
                          <span className="ml-2 text-gray-600">
                            {company.industry}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                  <div className="mt-4 flex gap-2">
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.location.href = `/dashboard/companies/${company.id}`;
                      }}
                    >
                      View Details
                    </Button>
                    {company.website && (
                      <Button size="sm" variant="outline" asChild>
                        <a
                          href={company.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Website
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Related Content */}
      {results?.relatedContent && results.relatedContent.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Related Content</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.relatedContent.map((content) => {
              const typedContent = content as {
                id: string;
                title: string;
                description?: string;
                content_type?: string;
                status: string;
              };
              return (
                <Card
                  key={typedContent.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-4">
                    <h4 className="font-medium text-gray-900">
                      {typedContent.title}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {typedContent.description || "No description available"}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {typedContent.content_type?.split("_").join(" ")}
                      </Badge>
                      <Badge className="text-xs">{typedContent.status}</Badge>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
