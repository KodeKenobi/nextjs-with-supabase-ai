import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("🔍 Environment check:");
    console.log("NEXT_PUBLIC_SUPABASE_URL:", process.env.NEXT_PUBLIC_SUPABASE_URL ? "Set" : "Missing");
    console.log("NEXT_PUBLIC_SUPABASE_ANON_KEY:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Set" : "Missing");
    console.log("SUPABASE_SERVICE_ROLE_KEY:", process.env.SUPABASE_SERVICE_ROLE_KEY ? "Set" : "Missing");
    
    return NextResponse.json({
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? "Set" : "Missing",
      supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Set" : "Missing", 
      supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? "Set" : "Missing",
      message: "Environment variables check"
    });
  } catch (error) {
    console.error("Environment check error:", error);
    return NextResponse.json(
      { error: "Environment check failed", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
