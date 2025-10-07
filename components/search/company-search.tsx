"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Building2,
  ExternalLink,
  MapPin,
  Users,
  TrendingUp,
  Globe,
  Phone,
  Mail,
  Loader2,
} from "lucide-react";
import { Company } from "@/lib/types";

export default function CompanySearch() {
  const [query, setQuery] = useState("");
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchCompanies = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/search/companies?q=${encodeURIComponent(query)}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to search companies");
      }

      setCompanies(data.companies || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    searchCompanies();
  };

  const formatCompanySize = (size: string) => {
    if (!size) return "Unknown";
    return size;
  };

  const formatRevenue = (revenue: string) => {
    if (!revenue) return "Not disclosed";
    return revenue;
  };

  return (
    <div className="space-y-6">
      {/* Search Form */}
      <Card>
        <CardHeader>
          <CardTitle>Search Companies</CardTitle>
          <CardDescription>
            Find companies by name, industry, or other criteria
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex space-x-4">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Enter company name, industry, or keywords..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <Button type="submit" disabled={loading || !query.trim()}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              Search
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Error Message */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {companies.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              Found {companies.length} companies
            </h2>
          </div>

          <div className="grid gap-6">
            {companies.map((company) => (
              <Card
                key={company.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Building2 className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">
                          {company.name}
                        </CardTitle>
                        {company.trading_name && (
                          <p className="text-sm text-gray-600">
                            Trading as: {company.trading_name}
                          </p>
                        )}
                      </div>
                    </div>
                    <Badge variant="outline">{company.type}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Description */}
                    {company.description && (
                      <p className="text-gray-700">{company.description}</p>
                    )}

                    {/* Key Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {company.industry && (
                        <div className="flex items-center space-x-2">
                          <TrendingUp className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">
                            <strong>Industry:</strong> {company.industry}
                          </span>
                        </div>
                      )}

                      {company.country && (
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">
                            <strong>Country:</strong> {company.country}
                          </span>
                        </div>
                      )}

                      {company.size && (
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">
                            <strong>Size:</strong>{" "}
                            {formatCompanySize(company.size)}
                          </span>
                        </div>
                      )}

                      {company.revenue && (
                        <div className="flex items-center space-x-2">
                          <TrendingUp className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">
                            <strong>Revenue:</strong>{" "}
                            {formatRevenue(company.revenue)}
                          </span>
                        </div>
                      )}

                      {company.ceo && (
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">
                            <strong>CEO:</strong> {company.ceo}
                          </span>
                        </div>
                      )}

                      {company.founded_year && (
                        <div className="flex items-center space-x-2">
                          <TrendingUp className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">
                            <strong>Founded:</strong> {company.founded_year}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Contact Information */}
                    <div className="flex flex-wrap gap-4 pt-4 border-t">
                      {company.website && (
                        <a
                          href={company.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-1 text-blue-600 hover:text-blue-800"
                        >
                          <Globe className="h-4 w-4" />
                          <span className="text-sm">Website</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}

                      {company.linkedin && (
                        <a
                          href={company.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-1 text-blue-600 hover:text-blue-800"
                        >
                          <Globe className="h-4 w-4" />
                          <span className="text-sm">LinkedIn</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}

                      {company.phone && (
                        <div className="flex items-center space-x-1 text-gray-600">
                          <Phone className="h-4 w-4" />
                          <span className="text-sm">{company.phone}</span>
                        </div>
                      )}

                      {company.email && (
                        <div className="flex items-center space-x-1 text-gray-600">
                          <Mail className="h-4 w-4" />
                          <span className="text-sm">{company.email}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {companies.length === 0 && !loading && query && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No companies found</p>
              <p className="text-sm text-gray-400">
                Try searching with different keywords
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
