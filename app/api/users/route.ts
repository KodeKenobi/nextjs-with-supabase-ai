import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    // Get all users from Supabase Auth
    const { data: users, error } = await supabaseAdmin.auth.admin.listUsers();

    if (error) {
      console.error("Error fetching users:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log("📋 All Supabase Users:", {
      totalUsers: users?.users?.length || 0,
      timestamp: new Date().toISOString(),
      users: users?.users?.map(user => ({
        id: user.id,
        email: user.email,
        createdAt: user.created_at,
        lastSignIn: user.last_sign_in_at,
        emailConfirmed: user.email_confirmed_at,
        firstName: user.user_metadata?.first_name,
        lastName: user.user_metadata?.last_name,
        companyName: user.user_metadata?.company_name
      }))
    });

    return NextResponse.json({
      totalUsers: users?.users?.length || 0,
      users: users?.users?.map(user => ({
        id: user.id,
        email: user.email,
        createdAt: user.created_at,
        lastSignIn: user.last_sign_in_at,
        emailConfirmed: user.email_confirmed_at,
        firstName: user.user_metadata?.first_name,
        lastName: user.user_metadata?.last_name,
        companyName: user.user_metadata?.company_name
      }))
    });
  } catch (error) {
    console.error("Users API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
