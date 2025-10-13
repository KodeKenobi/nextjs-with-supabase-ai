import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  console.log("🚀 Upload API called");
  console.log("🔍 Environment check:", {
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ Set" : "❌ Missing",
    supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      ? "✅ Set"
      : "❌ Missing",
    supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY
      ? "✅ Set"
      : "❌ Missing",
  });

  try {
    const supabase = await createClient();

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.log("❌ User authentication failed:", userError?.message);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log(
      "✅ User authenticated:",
      user.email,
      "ID:",
      user.id,
      "ID type:",
      typeof user.id
    );

    const formData = await request.formData();
    let title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const companyName = formData.get("companyName") as string;
    let contentType = formData.get("contentType") as string;
    let source = formData.get("source") as string;
    const file = formData.get("file") as File;
    const url = formData.get("url") as string;
    const text = formData.get("text") as string;

    console.log("📝 Form data received:", {
      title: title || "empty",
      description: description || "empty",
      companyName: companyName || "empty",
      contentType: contentType || "empty",
      source: source || "empty",
      hasFile: !!file,
      url: url || "empty",
      hasText: !!text,
    });

    // Validate required fields - only companyName is required
    if (!companyName) {
      console.log("❌ Company name is missing");
      return NextResponse.json(
        { error: "Company name is required" },
        { status: 400 }
      );
    }

    console.log("✅ Company name validation passed:", companyName);

    // Generate default title if not provided
    if (!title || title.trim() === "") {
      const timestamp = new Date().toLocaleString();
      title = `Content Upload - ${timestamp}`;
    }

    // Generate default content type and source if not provided
    if (!contentType) {
      contentType = "TEXT";
    }
    if (!source) {
      source = "DIRECT_INPUT";
    }

    // Handle file upload
    let cloudStoragePath = null;
    let fileName: string | null = null;
    let fileSize = null;
    let mimeType = null;

    if (source === "FILE_UPLOAD" && file) {
      // Upload file to Supabase Storage
      const fileExt = file.name.split(".").pop();
      const uniqueFileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2)}.${fileExt}`;
      const filePath = `content/${user.id}/${uniqueFileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("content-files")
        .upload(filePath, file);

      if (uploadError) {
        console.error("Upload error:", uploadError);
        return NextResponse.json(
          { error: "Failed to upload file" },
          { status: 500 }
        );
      }

      cloudStoragePath = uploadData.path;
      fileName = file.name;
      fileSize = file.size;
      mimeType = file.type;
    }

    // Find or create company
    let companyId = null;
    if (companyName) {
      console.log("🔍 Looking for company:", companyName);

      // First, try to find existing company
      const { data: existingCompany, error: findError } = await supabaseAdmin
        .from("companies")
        .select("id")
        .eq("name", companyName)
        .single();

      console.log("🔍 Company search result:", {
        found: !!existingCompany,
        error: findError?.message,
        errorCode: findError?.code,
      });

      if (findError && findError.code !== "PGRST116") {
        // PGRST116 is "not found" error, which is expected
        console.error("❌ Error finding company:", findError);
        return NextResponse.json(
          { error: "Failed to find company", details: findError.message },
          { status: 500 }
        );
      }

      if (existingCompany) {
        companyId = existingCompany.id;
        console.log("✅ Found existing company:", companyId);
      } else {
        console.log("🏗️ Creating new company:", companyName);

        // Create new company with explicit UUID
        const companyId = crypto.randomUUID();
        const { data: newCompany, error: createError } = await supabaseAdmin
          .from("companies")
          .insert({
            id: companyId,
            name: companyName,
            description: `Company created from content upload: ${title}`,
            industry: "Unknown",
            country: "Unknown",
            size: "Unknown",
            type: "TARGET",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .select("id")
          .single();

        console.log("🏗️ Company creation result:", {
          success: !!newCompany,
          error: createError?.message,
          errorCode: createError?.code,
        });

        if (createError) {
          console.error("❌ Error creating company:", createError);
          return NextResponse.json(
            { error: "Failed to create company", details: createError.message },
            { status: 500 }
          );
        }

        console.log("✅ Created new company:", companyId);
      }
    }

    // Create content item in database
    console.log("📄 Creating content item with companyId:", companyId);

    const contentId = crypto.randomUUID();
    const { data: contentItem, error: contentError } = await supabaseAdmin
      .from("content_items")
      .insert({
        id: contentId,
        title,
        description,
        content_type: contentType,
        source: source,
        source_url: url || null,
        cloud_storage_path: cloudStoragePath,
        file_name: fileName,
        file_size: fileSize,
        mime_type: mimeType,
        status: "PENDING",
        company_id: companyId,
        user_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    console.log("📄 Content creation result:", {
      success: !!contentItem,
      error: contentError?.message,
      errorCode: contentError?.code,
      contentId: contentItem?.id,
    });

    if (contentError) {
      console.error("Content creation error:", contentError);
      return NextResponse.json(
        { error: "Failed to create content item" },
        { status: 500 }
      );
    }

    // Start processing (this would trigger background job in production)
    // For now, we'll simulate immediate processing
    if (source === "DIRECT_INPUT" && text && text.trim()) {
      // Process text directly
      await processTextContent(contentId, text, user.id);
    } else if (cloudStoragePath) {
      // Process uploaded file
      await processFileContent(contentId, cloudStoragePath, user.id);
    } else {
      // No content to process - just mark as completed
      await supabaseAdmin
        .from("content_items")
        .update({
          status: "COMPLETED",
          processed_at: new Date().toISOString(),
        })
        .eq("id", contentId);
    }

    if (contentError) {
      console.error("❌ Content creation error:", contentError);
      return NextResponse.json(
        {
          error: "Failed to create content item",
          details: (contentError as any)?.message || "Unknown error",
        },
        { status: 500 }
      );
    }

    console.log("✅ Content item created successfully:", contentId);

    // Start processing (this would trigger background job in production)
    // For now, we'll simulate immediate processing
    console.log("🔄 Starting content processing...");

    if (source === "DIRECT_INPUT" && text && text.trim()) {
      console.log("📝 Processing text content");
      // Process text directly
      await processTextContent(contentId, text, user.id);
    } else if (cloudStoragePath) {
      console.log("📁 Processing uploaded file");
      // Process uploaded file
      await processFileContent(contentId, cloudStoragePath, user.id);
    } else {
      console.log("✅ No content to process - marking as completed");
      // No content to process - just mark as completed
      await supabaseAdmin
        .from("content_items")
        .update({
          status: "COMPLETED",
          processed_at: new Date().toISOString(),
        })
        .eq("id", contentId);
    }

    console.log("🎉 Upload completed successfully!");

    return NextResponse.json({
      success: true,
      contentItem,
      message: "Content uploaded successfully and processing started",
    });
  } catch (error) {
    console.error("❌ Upload error:", error);
    console.error("❌ Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : "No stack trace",
      name: error instanceof Error ? error.name : "Unknown error type",
    });
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

async function processTextContent(
  contentId: string,
  text: string,
  userId: string
) {
  // This would integrate with OpenAI for analysis
  // For now, create a mock transcription and insights

  // Create transcription
  await supabaseAdmin.from("transcriptions").insert({
    content_item_id: contentId,
    content: text,
    language: "en",
    confidence: 1.0,
    word_count: text.split(" ").length,
  });

  // Create mock business insights
  await supabaseAdmin.from("business_insights").insert({
    content_item_id: contentId,
    user_id: userId,
    category: "BUSINESS_MODEL",
    title: "Text Analysis Complete",
    content: "Content has been processed and analyzed for business insights.",
    confidence: 0.8,
    priority: "MEDIUM",
  });

  // Update content status
  await supabaseAdmin
    .from("content_items")
    .update({
      status: "COMPLETED",
      processed_at: new Date().toISOString(),
    })
    .eq("id", contentId);
}

async function processFileContent(
  contentId: string,
  _filePath: string,
  _userId: string
) {
  // This would integrate with transcription services and AI analysis
  // For now, just update status
  await supabaseAdmin
    .from("content_items")
    .update({
      status: "COMPLETED",
      processed_at: new Date().toISOString(),
    })
    .eq("id", contentId);
}
