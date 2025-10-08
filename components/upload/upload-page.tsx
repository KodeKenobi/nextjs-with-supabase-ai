"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Upload,
  FileText,
  Mic,
  Video,
  Link as LinkIcon,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";

interface UploadFormData {
  title: string;
  description: string;
  contentType: "AUDIO" | "VIDEO" | "TEXT" | "BLOG_ARTICLE" | "DOCUMENT";
  source: "FILE_UPLOAD" | "YOUTUBE_URL" | "BLOG_URL" | "DIRECT_INPUT";
  file?: File;
  url?: string;
  text?: string;
}

export default function UploadPage() {
  const [formData, setFormData] = useState<UploadFormData>({
    title: "",
    description: "",
    contentType: "AUDIO",
    source: "FILE_UPLOAD",
  });
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        file,
        title: prev.title || file.name.split(".")[0],
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    setError("");
    setSuccess("");

    try {
      // Validate form data
      if (!formData.title.trim()) {
        throw new Error("Title is required");
      }

      if (formData.source === "FILE_UPLOAD" && !formData.file) {
        throw new Error("Please select a file to upload");
      }

      if (formData.source === "YOUTUBE_URL" && !formData.url?.trim()) {
        throw new Error("Please enter a YouTube URL");
      }

      if (formData.source === "BLOG_URL" && !formData.url?.trim()) {
        throw new Error("Please enter a blog URL");
      }

      if (formData.source === "DIRECT_INPUT" && !formData.text?.trim()) {
        throw new Error("Please enter text content");
      }

      // Simulate upload progress
      for (let i = 0; i <= 100; i += 10) {
        setUploadProgress(i);
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      // For now, just show success - will be implemented with actual upload
      setSuccess(
        "Content uploaded successfully! Processing will begin shortly."
      );
      setFormData({
        title: "",
        description: "",
        contentType: "AUDIO",
        source: "FILE_UPLOAD",
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case "AUDIO":
        return <Mic className="h-5 w-5" />;
      case "VIDEO":
        return <Video className="h-5 w-5" />;
      case "TEXT":
      case "DOCUMENT":
      case "BLOG_ARTICLE":
        return <FileText className="h-5 w-5" />;
      default:
        return <Upload className="h-5 w-5" />;
    }
  };

  const getAcceptedFileTypes = (contentType: string) => {
    switch (contentType) {
      case "AUDIO":
        return ".mp3,.wav,.m4a,.aac,.flac";
      case "VIDEO":
        return ".mp4,.avi,.mov,.wmv,.mkv";
      case "DOCUMENT":
        return ".pdf,.doc,.docx,.txt,.rtf";
      default:
        return "*";
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Upload Methods */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card
          className={`cursor-pointer transition-all ${
            formData.source === "FILE_UPLOAD"
              ? "ring-2 ring-blue-500 bg-blue-50"
              : "hover:shadow-md"
          }`}
          onClick={() =>
            setFormData((prev) => ({ ...prev, source: "FILE_UPLOAD" }))
          }
        >
          <CardContent className="p-4 text-center">
            <Upload className="h-8 w-8 mx-auto mb-2 text-blue-600" />
            <h3 className="font-medium text-gray-900">File Upload</h3>
            <p className="text-sm text-gray-500">
              Upload audio, video, or documents
            </p>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer transition-all ${
            formData.source === "YOUTUBE_URL"
              ? "ring-2 ring-red-500 bg-red-50"
              : "hover:shadow-md"
          }`}
          onClick={() =>
            setFormData((prev) => ({ ...prev, source: "YOUTUBE_URL" }))
          }
        >
          <CardContent className="p-4 text-center">
            <Video className="h-8 w-8 mx-auto mb-2 text-red-600" />
            <h3 className="font-medium text-gray-900">YouTube URL</h3>
            <p className="text-sm text-gray-500">Process YouTube videos</p>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer transition-all ${
            formData.source === "BLOG_URL"
              ? "ring-2 ring-green-500 bg-green-50"
              : "hover:shadow-md"
          }`}
          onClick={() =>
            setFormData((prev) => ({ ...prev, source: "BLOG_URL" }))
          }
        >
          <CardContent className="p-4 text-center">
            <LinkIcon className="h-8 w-8 mx-auto mb-2 text-green-600" />
            <h3 className="font-medium text-gray-900">Blog URL</h3>
            <p className="text-sm text-gray-500">Process blog articles</p>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer transition-all ${
            formData.source === "DIRECT_INPUT"
              ? "ring-2 ring-purple-500 bg-purple-50"
              : "hover:shadow-md"
          }`}
          onClick={() =>
            setFormData((prev) => ({ ...prev, source: "DIRECT_INPUT" }))
          }
        >
          <CardContent className="p-4 text-center">
            <FileText className="h-8 w-8 mx-auto mb-2 text-purple-600" />
            <h3 className="font-medium text-gray-900">Direct Text</h3>
            <p className="text-sm text-gray-500">Paste text directly</p>
          </CardContent>
        </Card>
      </div>

      {/* Upload Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getContentTypeIcon(formData.contentType)}
            Upload Content
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Content Type Selection */}
            <div className="space-y-2">
              <Label htmlFor="contentType">Content Type</Label>
              <select
                id="contentType"
                name="contentType"
                value={formData.contentType}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="AUDIO">Audio</option>
                <option value="VIDEO">Video</option>
                <option value="DOCUMENT">Document</option>
                <option value="TEXT">Text</option>
                <option value="BLOG_ARTICLE">Blog Article</option>
              </select>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter content title"
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
                placeholder="Enter content description (optional)"
                rows={3}
              />
            </div>

            {/* File Upload */}
            {formData.source === "FILE_UPLOAD" && (
              <div className="space-y-2">
                <Label htmlFor="file">File *</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-sm text-gray-600 mb-2">
                    Click to select a file or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 mb-4">
                    Accepted formats:{" "}
                    {getAcceptedFileTypes(formData.contentType)}
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    id="file"
                    onChange={handleFileChange}
                    accept={getAcceptedFileTypes(formData.contentType)}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Select File
                  </Button>
                  {formData.file && (
                    <div className="mt-4 flex items-center justify-center gap-2 text-sm text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      {formData.file.name} (
                      {(formData.file.size / 1024 / 1024).toFixed(2)} MB)
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* URL Input */}
            {(formData.source === "YOUTUBE_URL" ||
              formData.source === "BLOG_URL") && (
              <div className="space-y-2">
                <Label htmlFor="url">
                  {formData.source === "YOUTUBE_URL"
                    ? "YouTube URL"
                    : "Blog URL"}{" "}
                  *
                </Label>
                <Input
                  id="url"
                  name="url"
                  type="url"
                  value={formData.url || ""}
                  onChange={handleInputChange}
                  placeholder={
                    formData.source === "YOUTUBE_URL"
                      ? "https://www.youtube.com/watch?v=..."
                      : "https://example.com/blog-post"
                  }
                  required
                />
              </div>
            )}

            {/* Direct Text Input */}
            {formData.source === "DIRECT_INPUT" && (
              <div className="space-y-2">
                <Label htmlFor="text">Text Content *</Label>
                <Textarea
                  id="text"
                  name="text"
                  value={formData.text || ""}
                  onChange={handleInputChange}
                  placeholder="Paste your text content here..."
                  rows={8}
                  required
                />
              </div>
            )}

            {/* Upload Progress */}
            {isUploading && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

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
            <Button type="submit" disabled={isUploading} className="w-full">
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Content
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
