import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  console.log("🚀 Test Upload API called (NO AUTH)");
  
  try {
    const formData = await request.formData();
    const companyName = formData.get("companyName") as string;
    
    console.log("📝 Company name received:", companyName);
    
    if (!companyName) {
      return NextResponse.json({ error: "Company name is required" }, { status: 400 });
    }
    
    // Test database connection directly
    const { data: companies, error: companiesError } = await supabaseAdmin
      .from("companies")
      .select("id")
      .limit(1);
    
    console.log("🔍 Companies test:", { success: !companiesError, error: companiesError?.message });
    
    // Test content_items table
    const { data: contentItems, error: contentError } = await supabaseAdmin
      .from("content_items")
      .select("id")
      .limit(1);
    
    console.log("🔍 Content items test:", { success: !contentError, error: contentError?.message });
    
    return NextResponse.json({
      success: true,
      message: "Test upload successful",
      companyName,
      databaseTests: {
        companies: { success: !companiesError, error: companiesError?.message },
        contentItems: { success: !contentError, error: contentError?.message }
      }
    });
    
  } catch (error) {
    console.error("❌ Test upload error:", error);
    return NextResponse.json(
      { 
        error: "Test upload failed", 
        details: error instanceof Error ? error.message : "Unknown error" 
      },
      { status: 500 }
    );
  }
}
