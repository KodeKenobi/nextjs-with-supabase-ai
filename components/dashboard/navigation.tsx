"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Brain,
  Home,
  FileText,
  Upload,
  BarChart3,
  Search,
  AlertTriangle,
  LogOut,
  Menu,
  X,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface User {
  id: string;
  email?: string;
  user_metadata?: {
    first_name?: string;
    last_name?: string;
    company_name?: string;
  };
}

interface NavigationProps {
  user: User;
}

const navigationItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    name: "Companies",
    href: "/dashboard/companies",
    icon: Building2,
  },
  {
    name: "Content Library",
    href: "/dashboard/content",
    icon: FileText,
  },
  {
    name: "Upload Content",
    href: "/dashboard/upload",
    icon: Upload,
  },
  {
    name: "Business Insights",
    href: "/dashboard/insights",
    icon: BarChart3,
  },
  {
    name: "Consistency Check",
    href: "/dashboard/consistency",
    icon: Search,
  },
  {
    name: "Gap Analysis",
    href: "/dashboard/gaps",
    icon: AlertTriangle,
  },
];

export default function DashboardNavigation({ user }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  const firstName = user?.user_metadata?.first_name;
  const lastName = user?.user_metadata?.last_name;
  const companyName = user?.user_metadata?.company_name;

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Desktop Navigation */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/dashboard" className="flex items-center">
                <Brain className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-bold text-gray-900 hidden sm:block">
                  AI Data Repository
                </span>
              </Link>
            </div>

            <div className="hidden md:ml-8 md:flex md:space-x-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      isActive
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    )}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:block text-right">
              <p className="text-sm font-medium text-gray-900">
                {firstName && lastName
                  ? `${firstName} ${lastName}`
                  : user?.email || "User"}
              </p>
              {companyName && (
                <p className="text-xs text-gray-500">{companyName}</p>
              )}
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="hidden md:flex"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors",
                    isActive
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}

            <div className="border-t border-gray-200 pt-4 mt-4">
              <div className="px-3 py-2">
                <p className="text-base font-medium text-gray-900">
                  {firstName && lastName
                    ? `${firstName} ${lastName}`
                    : user?.email || "User"}
                </p>
                <p className="text-sm text-gray-500">{user?.email}</p>
                {companyName && (
                  <p className="text-sm text-gray-500">{companyName}</p>
                )}
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="w-full justify-start mt-2"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
