import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase";
import {
  transcribeYouTubeVideo,
  getYouTubeInfo,
  isValidYouTubeUrl,
} from "@/lib/youtube-processor-serverless";
import { uploadRateLimit } from "@/lib/rate-limit";

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

    // Check rate limit
    const rateLimitResult = uploadRateLimit(user.id);
    if (!rateLimitResult.allowed) {
      console.log("🚫 Rate limit exceeded for user:", user.email);
      return NextResponse.json(
        {
          error: "Upload limit exceeded",
          message:
            "You have reached the maximum number of uploads per hour. Please try again later.",
          resetTime: rateLimitResult.resetTime,
        },
        {
          status: 429,
          headers: {
            "Retry-After": Math.ceil(
              (rateLimitResult.resetTime - Date.now()) / 1000
            ).toString(),
            "X-RateLimit-Limit": "10",
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": rateLimitResult.resetTime.toString(),
          },
        }
      );
    }

    console.log(
      "✅ Rate limit check passed, remaining uploads:",
      rateLimitResult.remaining
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
        const newCompanyId = crypto.randomUUID();
        const { data: newCompany, error: createError } = await supabaseAdmin
          .from("companies")
          .insert({
            id: newCompanyId,
            name: companyName,
            description: `Company created from content upload: ${title}`,
            industry: "Unknown",
            country: "Unknown",
            size: "Unknown",
            type: "TARGET",
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

        companyId = newCompanyId;
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
        contenttype: contentType,
        source: source,
        status: "PENDING",
        companyid: companyId,
        userid: user.id,
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
      console.error("❌ Content creation error:", contentError);
      return NextResponse.json(
        {
          error: "Failed to create content item",
          details: contentError.message || "Unknown error",
        },
        { status: 500 }
      );
    }

    console.log("✅ Content item created successfully:", contentId);

    // Start processing (this would trigger background job in production)
    // For now, we'll simulate immediate processing
    console.log("🔄 Starting content processing...");

    try {
      if (source === "DIRECT_INPUT" && text && text.trim()) {
        console.log("📝 Processing text content");
        // Process text directly
        await processTextContent(contentId, text, user.id);
      } else if (source === "YOUTUBE_URL" && url && url.trim()) {
        console.log("🎥 Processing YouTube video");
        // Process YouTube video
        await processYouTubeContent(contentId, url, user.id);
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
            processedat: new Date().toISOString(),
          })
          .eq("id", contentId);
      }
    } catch (processingError) {
      console.error("❌ Processing error:", processingError);
      // Don't fail the upload if processing fails, just log it
    }

    console.log("🎉 Upload completed successfully!");

    return NextResponse.json({
      success: true,
      contentItem: {
        id: contentId,
        title,
        description,
        contenttype: contentType,
        source: source,
        companyid: companyId,
        userid: user.id,
        status: "PENDING",
      },
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
    contentItemId: contentId,
    content: text,
    language: "en",
    confidence: 1.0,
    wordCount: text.split(" ").length,
  });

  // Create mock business insights
  await supabaseAdmin.from("business_insights").insert({
    contentItemId: contentId,
    userId: userId,
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
      processedat: new Date().toISOString(),
    })
    .eq("id", contentId);
}

async function processYouTubeContent(
  contentId: string,
  url: string,
  userId: string
) {
  try {
    console.log("🎥 Starting YouTube processing for:", url);

    // Validate YouTube URL
    if (!isValidYouTubeUrl(url)) {
      throw new Error("Invalid YouTube URL");
    }

    // Get video information
    const videoInfo = await getYouTubeInfo(url);
    console.log("📹 Video title:", videoInfo.title);

    // Update content item with video information
    await supabaseAdmin
      .from("content_items")
      .update({
        title: videoInfo.title || "YouTube Video",
        description:
          videoInfo.description || `YouTube video by ${videoInfo.author}`,
        sourceurl: url,
      })
      .eq("id", contentId);

    // Transcribe the video
    const transcription = await transcribeYouTubeVideo(url);
    console.log(
      "🎵 Transcription completed:",
      transcription.wordCount,
      "words"
    );

    // Save transcription
    await supabaseAdmin.from("transcriptions").insert({
      contentItemId: contentId,
      content: transcription.text,
      language: transcription.language,
      confidence: transcription.confidence,
      wordCount: transcription.wordCount,
    });

    // Generate business insights from transcription
    await supabaseAdmin.from("business_insights").insert({
      contentItemId: contentId,
      userId: userId,
      category: "BUSINESS_MODEL",
      title: "YouTube Video Analysis Complete",
      content: `Successfully transcribed YouTube video "${videoInfo.title}" with ${transcription.wordCount} words. The content has been analyzed for business insights.`,
      confidence: 0.9,
      priority: "HIGH",
    });

    // Add additional insights based on content
    if (
      transcription.text.toLowerCase().includes("business") ||
      transcription.text.toLowerCase().includes("company") ||
      transcription.text.toLowerCase().includes("strategy")
    ) {
      await supabaseAdmin.from("business_insights").insert({
        contentItemId: contentId,
        userId: userId,
        category: "STRATEGY",
        title: "Business Strategy Content Detected",
        content:
          "The video content appears to contain business strategy discussions that may be valuable for analysis.",
        confidence: 0.8,
        priority: "MEDIUM",
      });
    }

    // Update content status
    await supabaseAdmin
      .from("content_items")
      .update({
        status: "COMPLETED",
        processedat: new Date().toISOString(),
      })
      .eq("id", contentId);

    console.log("✅ YouTube processing completed successfully");
  } catch (error) {
    console.error("❌ YouTube processing error:", error);

    // Update content status to failed
    await supabaseAdmin
      .from("content_items")
      .update({
        status: "FAILED",
        processedat: new Date().toISOString(),
      })
      .eq("id", contentId);

    throw error;
  }
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
      processedat: new Date().toISOString(),
    })
    .eq("id", contentId);
}
