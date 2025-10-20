import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  transcribeYouTubeVideo,
  getYouTubeInfo,
  isValidYouTubeUrl,
} from "@/lib/youtube-processor";
import { transcriptionRateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    console.log("🔍 Extract Transcription API called");

    // Check environment variables
    console.log("🔍 Environment check:", {
      openaiKey: process.env.OPENAI_API_KEY ? "✅ Set" : "❌ Missing",
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL
        ? "✅ Set"
        : "❌ Missing",
    });

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

    console.log("✅ User authenticated:", user.email);

    // Check rate limit
    const rateLimitResult = transcriptionRateLimit(user.id);
    if (!rateLimitResult.allowed) {
      console.log("🚫 Transcription rate limit exceeded for user:", user.email);
      return NextResponse.json(
        {
          error: "Transcription limit exceeded",
          message:
            "You have reached the maximum number of transcriptions per hour. Please try again later.",
          resetTime: rateLimitResult.resetTime,
        },
        {
          status: 429,
          headers: {
            "Retry-After": Math.ceil(
              (rateLimitResult.resetTime - Date.now()) / 1000
            ).toString(),
            "X-RateLimit-Limit": "5",
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": rateLimitResult.resetTime.toString(),
          },
        }
      );
    }

    console.log(
      "✅ Rate limit check passed, remaining transcriptions:",
      rateLimitResult.remaining
    );

    const { url } = await request.json();
    console.log("🔍 Received URL:", url);

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Validate YouTube URL
    if (!isValidYouTubeUrl(url)) {
      console.log("❌ Invalid YouTube URL:", url);
      return NextResponse.json(
        { error: "Invalid YouTube URL" },
        { status: 400 }
      );
    }

    console.log("✅ YouTube URL validated:", url);
    console.log("🎥 Extracting transcription for:", url);

    // Get video information
    const videoInfo = await getYouTubeInfo(url);
    console.log("📹 Video title:", videoInfo.title);

    // Transcribe the video
    const transcription = await transcribeYouTubeVideo(url);
    console.log(
      "🎵 Transcription completed:",
      transcription.wordCount,
      "words"
    );

    return NextResponse.json({
      success: true,
      videoInfo: {
        title: videoInfo.title,
        author: videoInfo.author,
        duration: videoInfo.duration,
        thumbnail: videoInfo.thumbnail,
      },
      transcription: {
        text: transcription.text,
        language: transcription.language,
        confidence: transcription.confidence,
        wordCount: transcription.wordCount,
      },
    });
  } catch (error) {
    console.error("❌ Transcription extraction error:", error);
    return NextResponse.json(
      {
        error: "Failed to extract transcription",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
