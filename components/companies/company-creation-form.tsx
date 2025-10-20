"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Building2, CheckCircle, XCircle, Loader2, Plus } from "lucide-react";

interface CompanyFormData {
  name: string;
  description: string;
  industry: string;
  country: string;
  size: string;
  type: "SUPPLIER" | "COMPETITOR" | "PARTNER" | "TARGET" | "CUSTOMER";
}

export default function CompanyCreationForm() {
  const [formData, setFormData] = useState<CompanyFormData>({
    name: "",
    description: "",
    industry: "",
    country: "",
    size: "",
    type: "TARGET",
  });
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    setError("");
    setSuccess("");

    try {
      // Validate required fields
      if (!formData.name.trim()) {
        throw new Error("Company name is required");
      }

      // Create company via API
      const response = await fetch("/api/companies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create company");
      }

      setSuccess("Company created successfully!");
      setFormData({
        name: "",
        description: "",
        industry: "",
        country: "",
        size: "",
        type: "TARGET",
      });

      // Trigger refresh of company list
      window.dispatchEvent(new CustomEvent("companyCreated"));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create company");
    } finally {
      setIsCreating(false);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "SUPPLIER":
        return "bg-blue-100 text-blue-800";
      case "COMPETITOR":
        return "bg-red-100 text-red-800";
      case "PARTNER":
        return "bg-green-100 text-green-800";
      case "TARGET":
        return "bg-purple-100 text-purple-800";
      case "CUSTOMER":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Add New Company
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Company Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Company Name *</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter company name"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter company description (optional)"
              rows={3}
            />
          </div>

          {/* Industry and Country */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Input
                id="industry"
                name="industry"
                value={formData.industry}
                onChange={handleInputChange}
                placeholder="e.g., Technology, Healthcare"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                placeholder="e.g., United States, Canada"
              />
            </div>
          </div>

          {/* Size and Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="size">Company Size</Label>
              <select
                id="size"
                name="size"
                value={formData.size}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="">Select size</option>
                <option value="Startup (1-10)">Startup (1-10)</option>
                <option value="Small (11-50)">Small (11-50)</option>
                <option value="Medium (51-200)">Medium (51-200)</option>
                <option value="Large (201-1000)">Large (201-1000)</option>
                <option value="Enterprise (1000+)">Enterprise (1000+)</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Company Type</Label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="TARGET">Target</option>
                <option value="COMPETITOR">Competitor</option>
                <option value="PARTNER">Partner</option>
                <option value="SUPPLIER">Supplier</option>
                <option value="CUSTOMER">Customer</option>
              </select>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Success Message */}
          {success && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                {success}
              </AlertDescription>
            </Alert>
          )}

          {/* Submit Button */}
          <Button type="submit" disabled={isCreating} className="w-full">
            {isCreating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating Company...
              </>
            ) : (
              <>
                <Building2 className="h-4 w-4 mr-2" />
                Create Company
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
