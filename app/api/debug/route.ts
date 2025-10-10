import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  try {
    console.log("🔍 Debug API called");
    
    // Check environment variables
    const envCheck = {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ Set" : "❌ Missing",
      supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✅ Set" : "❌ Missing", 
      supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? "✅ Set" : "❌ Missing",
    };
    
    console.log("Environment check:", envCheck);
    
    // Test basic Supabase connection
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    console.log("Auth check:", { 
      hasUser: !!user, 
      userEmail: user?.email,
      error: userError?.message 
    });
    
    // Test database connection
    let dbTest = { success: false, error: null as string | null };
    try {
      const { data: companies, error: companiesError } = await supabaseAdmin
        .from("companies")
        .select("id")
        .limit(1);
      
      dbTest = { 
        success: !companiesError, 
        error: companiesError?.message || null,
        hasCompanies: !!companies 
      };
    } catch (dbErr) {
      dbTest = { 
        success: false, 
        error: dbErr instanceof Error ? dbErr.message : "Unknown error" 
      };
    }
    
    console.log("Database test:", dbTest);
    
    // Test content_items table specifically
    let contentTest = { success: false, error: null as string | null };
    try {
      const { data: contentItems, error: contentError } = await supabaseAdmin
        .from("content_items")
        .select("id")
        .limit(1);
      
      contentTest = { 
        success: !contentError, 
        error: contentError?.message || null,
        hasContent: !!contentItems 
      };
    } catch (contentErr) {
      contentTest = { 
        success: false, 
        error: contentErr instanceof Error ? contentErr.message : "Unknown error" 
      };
    }
    
    console.log("Content table test:", contentTest);
    
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      environment: envCheck,
      auth: { 
        hasUser: !!user, 
        userEmail: user?.email,
        error: userError?.message 
      },
      database: dbTest,
      contentTable: contentTest,
      message: "Debug check completed"
    });
    
  } catch (error) {
    console.error("❌ Debug API error:", error);
    return NextResponse.json(
      { 
        error: "Debug API failed", 
        details: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
