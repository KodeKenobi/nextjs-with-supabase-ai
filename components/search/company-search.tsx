"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Building2, ExternalLink, Plus } from "lucide-react";
import Link from "next/link";

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
                  {company.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {company.description}
                    </p>
                  )}
                  <div className="space-y-2">
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
                    {company.country && (
                      <div className="flex items-center text-sm">
                        <span className="font-medium text-gray-700">
                          Country:
                        </span>
                        <span className="ml-2 text-gray-600">
                          {company.country}
                        </span>
                      </div>
                    )}
                    {company.size && (
                      <div className="flex items-center text-sm">
                        <span className="font-medium text-gray-700">Size:</span>
                        <span className="ml-2 text-gray-600">
                          {company.size}
                        </span>
                      </div>
                    )}
                  </div>
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
