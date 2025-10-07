"use client";

import {
  Brain,
  FileText,
  Mic,
  Video,
  BarChart3,
  Search,
  Shield,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Brain className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">
                AI Data Repository
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/register">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Transform Your Content Into
            <span className="text-blue-600"> Business Intelligence</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Upload audio files, videos, and articles. Get AI-powered
            transcriptions, insights, and consistency analysis for your business
            content.
          </p>
          <Link href="/register">
            <Button size="lg" className="text-lg px-8 py-4">
              Start Your Analysis
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Everything You Need for Content Intelligence
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="bg-blue-100 rounded-full p-3 w-fit mb-4">
                <Mic className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Audio Transcription
              </h3>
              <p className="text-gray-600">
                Convert audio files to text with high accuracy using advanced AI
                technology.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="bg-green-100 rounded-full p-3 w-fit mb-4">
                <Video className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Video Processing
              </h3>
              <p className="text-gray-600">
                Extract insights from video content and YouTube URLs with
                comprehensive analysis.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="bg-purple-100 rounded-full p-3 w-fit mb-4">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Content Analysis
              </h3>
              <p className="text-gray-600">
                Process blog articles and documents to extract key business
                insights.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="bg-orange-100 rounded-full p-3 w-fit mb-4">
                <BarChart3 className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Business Intelligence
              </h3>
              <p className="text-gray-600">
                Get actionable insights about strategy, operations, and market
                opportunities.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="bg-red-100 rounded-full p-3 w-fit mb-4">
                <Search className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Consistency Checking
              </h3>
              <p className="text-gray-600">
                Identify contradictions and gaps across all your business
                content.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="bg-teal-100 rounded-full p-3 w-fit mb-4">
                <Shield className="h-6 w-6 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Secure Storage
              </h3>
              <p className="text-gray-600">
                Your content is stored securely with enterprise-grade data
                protection.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Unlock Your Content's Potential?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join businesses using AI to transform their content into actionable
            insights.
          </p>
          <Link href="/register">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
              Get Started for Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Brain className="h-6 w-6 text-blue-400" />
              <span className="ml-2 text-lg font-semibold">
                AI Data Repository
              </span>
            </div>
            <div className="text-gray-400">
              © 2024 AI Data Repository. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
