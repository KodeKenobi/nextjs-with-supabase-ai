"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Building2, MapPin, Globe } from "lucide-react";
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
  updatedAt?: string;
  address?: string;
  email?: string;
  phone?: string;
  foundedYear?: number;
  ceo?: string;
  headquarters?: string;
  employeeCount?: string;
  revenue?: string;
  marketCap?: string;
  businessModel?: string;
  competitiveAdvantage?: string;
  targetMarket?: string;
  growthStage?: string;
  legalStatus?: string;
  stockSymbol?: string;
  [key: string]: any; // For other dynamic fields
}

interface ContentItem {
  id: string;
  title: string;
  description?: string;
  contentType?: string;
  source?: string;
  status?: string;
  createdAt?: string;
  transcriptions?: any[];
  business_insights?: any[];
}

export default function CompanyDetailsPage() {
  const params = useParams();
  const [company, setCompany] = useState<Company | null>(null);
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        const response = await fetch(`/api/companies/${params.id}`);
        if (!response.ok) {
          throw new Error("Company not found");
        }
        const data = await response.json();
        setCompany(data.company);
        setContentItems(data.contentItems || []);
      } catch (err) {
        setError("Failed to load company details");
        console.error("Error fetching company:", err);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchCompanyDetails();
    }
  }, [params.id]);

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

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading company details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <Building2 className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Company Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            {error || "The company you're looking for doesn't exist."}
          </p>
          <Button asChild>
            <Link href="/dashboard/companies">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Companies
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/companies">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{company.name}</h1>
            {company.trading_name && (
              <p className="text-lg text-gray-600">
                Trading as: {company.trading_name}
              </p>
            )}
          </div>
        </div>
        {company.type && (
          <Badge className={`text-lg px-4 py-2 ${getTypeColor(company.type)}`}>
            {company.type}
          </Badge>
        )}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Company Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building2 className="h-5 w-5 mr-2" />
                Company Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {company.description && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Description
                  </h4>
                  <p className="text-gray-700">{company.description}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {company.industry && (
                  <div>
                    <h4 className="font-semibold text-gray-900">Industry</h4>
                    <p className="text-gray-700">{company.industry}</p>
                  </div>
                )}
                {company.country && (
                  <div>
                    <h4 className="font-semibold text-gray-900">Country</h4>
                    <p className="text-gray-700">{company.country}</p>
                  </div>
                )}
                {company.size && (
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Company Size
                    </h4>
                    <p className="text-gray-700">{company.size}</p>
                  </div>
                )}
                {company.foundedYear && (
                  <div>
                    <h4 className="font-semibold text-gray-900">Founded</h4>
                    <p className="text-gray-700">{company.foundedYear}</p>
                  </div>
                )}
                {company.ceo && (
                  <div>
                    <h4 className="font-semibold text-gray-900">CEO</h4>
                    <p className="text-gray-700">{company.ceo}</p>
                  </div>
                )}
                {company.headquarters && (
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Headquarters
                    </h4>
                    <p className="text-gray-700">{company.headquarters}</p>
                  </div>
                )}
              </div>

              {company.website && (
                <div className="pt-4">
                  <Button asChild>
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center"
                    >
                      <Globe className="h-4 w-4 mr-2" />
                      Visit Website
                    </a>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Business Details */}
          {(company.businessModel ||
            company.competitiveAdvantage ||
            company.targetMarket) && (
            <Card>
              <CardHeader>
                <CardTitle>Business Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {company.businessModel && (
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Business Model
                    </h4>
                    <p className="text-gray-700">{company.businessModel}</p>
                  </div>
                )}
                {company.competitiveAdvantage && (
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Competitive Advantage
                    </h4>
                    <p className="text-gray-700">
                      {company.competitiveAdvantage}
                    </p>
                  </div>
                )}
                {company.targetMarket && (
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Target Market
                    </h4>
                    <p className="text-gray-700">{company.targetMarket}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Related Content */}
          {contentItems.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Related Content ({contentItems.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {contentItems.map((item) => (
                    <div key={item.id} className="border rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900">
                        {item.title}
                      </h4>
                      {item.description && (
                        <p className="text-sm text-gray-600 mt-1">
                          {item.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="secondary" className="text-xs">
                          {item.contentType?.split("_").join(" ")}
                        </Badge>
                        <Badge className="text-xs">{item.status}</Badge>
                        <span className="text-xs text-gray-500">
                          {formatDate(item.createdAt)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Content Items</span>
                <span className="font-semibold">{contentItems.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Created</span>
                <span className="font-semibold">
                  {formatDate(company.createdAt)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Last Updated</span>
                <span className="font-semibold">
                  {formatDate(company.updatedAt)}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          {(company.email || company.phone || company.address) && (
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {company.email && (
                  <div className="flex items-center">
                    <span className="text-sm text-gray-600 w-16">Email:</span>
                    <a
                      href={`mailto:${company.email}`}
                      className="text-blue-600 hover:underline"
                    >
                      {company.email}
                    </a>
                  </div>
                )}
                {company.phone && (
                  <div className="flex items-center">
                    <span className="text-sm text-gray-600 w-16">Phone:</span>
                    <a
                      href={`tel:${company.phone}`}
                      className="text-blue-600 hover:underline"
                    >
                      {company.phone}
                    </a>
                  </div>
                )}
                {company.address && (
                  <div className="flex items-start">
                    <MapPin className="h-4 w-4 mt-0.5 mr-2 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {company.address}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
