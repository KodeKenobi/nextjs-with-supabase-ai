"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function DebugUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      
      console.log("📋 All Supabase Users (Client-side):", data);
      setUsers(data.users || []);
    } catch (error) {
      console.error("❌ Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Debug: All Supabase Users</CardTitle>
        <CardDescription>
          Click to fetch and display all users in the Supabase auth system
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={fetchUsers} disabled={loading} className="mb-4">
          {loading ? "Loading..." : "Fetch All Users"}
        </Button>
        
        {users.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold">Users ({users.length} total):</h3>
            {users.map((user, index) => (
              <div key={user.id} className="p-3 border rounded bg-gray-50">
                <div className="font-medium">{user.email}</div>
                <div className="text-sm text-gray-600">
                  ID: {user.id} | Created: {new Date(user.createdAt).toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">
                  Last Sign In: {user.lastSignIn ? new Date(user.lastSignIn).toLocaleString() : 'Never'}
                </div>
                <div className="text-sm text-gray-600">
                  Email Confirmed: {user.emailConfirmed ? 'Yes' : 'No'}
                </div>
                {(user.firstName || user.lastName || user.companyName) && (
                  <div className="text-sm text-gray-600">
                    Name: {user.firstName} {user.lastName} | Company: {user.companyName}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
