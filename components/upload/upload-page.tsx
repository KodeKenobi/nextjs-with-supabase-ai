"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Upload,
  FileText,
  Link,
  Type,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

export default function UploadPage() {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [url, setUrl] = useState("");
  const [uploadType, setUploadType] = useState<"text" | "url">("text");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleTextUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !text.trim()) {
      setMessage({
        type: "error",
        text: "Please provide both title and text content",
      });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("You must be logged in to upload content");
      }

      const response = await fetch("/api/process-text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          text: text.trim(),
          userId: user.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to process text");
      }

      setMessage({
        type: "success",
        text: "Content uploaded and processed successfully!",
      });
      setTitle("");
      setText("");
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "An error occurred",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUrlUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !url.trim()) {
      setMessage({ type: "error", text: "Please provide both title and URL" });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      // For now, we'll just show a message that URL upload is not implemented
      setMessage({
        type: "error",
        text: "URL upload is not yet implemented. Please use text upload for now.",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "An error occurred",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Type Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Choose Upload Type</CardTitle>
          <CardDescription>
            Select how you want to upload your content
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              variant={uploadType === "text" ? "default" : "outline"}
              onClick={() => setUploadType("text")}
              className="h-20 flex flex-col items-center justify-center space-y-2"
            >
              <Type className="h-6 w-6" />
              <span>Direct Text Input</span>
            </Button>
            <Button
              variant={uploadType === "url" ? "default" : "outline"}
              onClick={() => setUploadType("url")}
              className="h-20 flex flex-col items-center justify-center space-y-2"
            >
              <Link className="h-6 w-6" />
              <span>URL Content</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Upload Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Upload className="h-5 w-5" />
            <span>
              {uploadType === "text"
                ? "Upload Text Content"
                : "Upload from URL"}
            </span>
          </CardTitle>
          <CardDescription>
            {uploadType === "text"
              ? "Paste your text content directly for AI analysis"
              : "Provide a URL to extract and analyze content"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {uploadType === "text" ? (
            <form onSubmit={handleTextUpload} className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter a title for your content"
                  required
                />
              </div>
              <div>
                <Label htmlFor="text">Content *</Label>
                <Textarea
                  id="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Paste your text content here..."
                  rows={10}
                  required
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <FileText className="h-4 w-4 mr-2" />
                )}
                Upload and Process Text
              </Button>
            </form>
          ) : (
            <form onSubmit={handleUrlUpload} className="space-y-4">
              <div>
                <Label htmlFor="url-title">Title *</Label>
                <Input
                  id="url-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter a title for your content"
                  required
                />
              </div>
              <div>
                <Label htmlFor="url">URL *</Label>
                <Input
                  id="url"
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com/article"
                  required
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Link className="h-4 w-4 mr-2" />
                )}
                Upload and Process URL
              </Button>
            </form>
          )}
        </CardContent>
      </Card>

      {/* Message Display */}
      {message && (
        <Card
          className={
            message.type === "success"
              ? "border-green-200 bg-green-50"
              : "border-red-200 bg-red-50"
          }
        >
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              {message.type === "success" ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-600" />
              )}
              <p
                className={
                  message.type === "success" ? "text-green-800" : "text-red-800"
                }
              >
                {message.text}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>How it works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-3 w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <h3 className="font-semibold mb-1">Upload Content</h3>
              <p className="text-sm text-gray-600">
                Upload text or provide a URL to extract content
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-3 w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                <span className="text-blue-600 font-bold">2</span>
              </div>
              <h3 className="font-semibold mb-1">AI Processing</h3>
              <p className="text-sm text-gray-600">
                Our AI analyzes the content for business insights
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-3 w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                <span className="text-blue-600 font-bold">3</span>
              </div>
              <h3 className="font-semibold mb-1">View Insights</h3>
              <p className="text-sm text-gray-600">
                Access generated insights and analysis in your dashboard
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
