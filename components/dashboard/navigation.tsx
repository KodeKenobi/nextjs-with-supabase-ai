"use client";

import { useState, useEffect, useRef } from "react";
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
  ChevronDown,
  User,
  Settings,
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
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const userMenuRef = useRef<HTMLDivElement>(null);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  const firstName = user?.user_metadata?.first_name;
  const lastName = user?.user_metadata?.last_name;
  const companyName = user?.user_metadata?.company_name;

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Desktop Navigation */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/dashboard" className="flex items-center group">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur-sm opacity-75 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                    <Brain className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="ml-3">
                  <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent hidden sm:block">
                    AI Data Repository
                  </span>
                  <span className="text-xs text-gray-500 hidden sm:block -mt-1">
                    Intelligence Platform
                  </span>
                </div>
              </Link>
            </div>

            <div className="hidden md:ml-10 md:flex md:space-x-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 group relative",
                      isActive
                        ? "bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 shadow-sm border border-blue-200/50"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 hover:shadow-sm"
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-4 w-4 mr-2 transition-transform duration-200",
                        isActive
                          ? "text-blue-600"
                          : "text-gray-500 group-hover:text-gray-700"
                      )}
                    />
                    {item.name}
                    {isActive && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-purple-500 rounded-r-full"></div>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-3">
            {/* User Profile Dropdown */}
            <div className="relative" ref={userMenuRef}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="hidden md:flex items-center p-2 hover:bg-gray-50 rounded-lg transition-all duration-200"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
              </Button>

              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200/50 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">
                      {firstName && lastName
                        ? `${firstName} ${lastName}`
                        : user?.email || "User"}
                    </p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                    {companyName && (
                      <p className="text-xs text-gray-500 mt-1">
                        {companyName}
                      </p>
                    )}
                  </div>

                  <div className="py-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Settings className="h-4 w-4 mr-3" />
                      Settings
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleSignOut}
                      className="w-full justify-start px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4 mr-3" />
                      Sign Out
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
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
        <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-200/50">
          <div className="px-4 pt-4 pb-6 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center px-4 py-3 rounded-xl text-base font-medium transition-all duration-200",
                    isActive
                      ? "bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 shadow-sm border border-blue-200/50"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon
                    className={cn(
                      "h-5 w-5 mr-3 transition-colors",
                      isActive ? "text-blue-600" : "text-gray-500"
                    )}
                  />
                  {item.name}
                </Link>
              );
            })}

            <div className="border-t border-gray-200 pt-4 mt-4">
              <div className="px-4 py-3 bg-gray-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div>
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
                </div>
              </div>

              <div className="mt-3 space-y-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl"
                >
                  <Settings className="h-4 w-4 mr-3" />
                  Settings
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className="w-full justify-start px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl"
                >
                  <LogOut className="h-4 w-4 mr-3" />
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
