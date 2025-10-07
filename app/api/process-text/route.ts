import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const { title, text, userId } = await request.json();

    if (!title || !text || !userId) {
      return NextResponse.json(
        { error: "Title, text, and userId are required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Create content item for text
    const { data: contentItem, error: contentError } = await supabase
      .from("content_items")
      .insert({
        title,
        description: `Direct text input - ${text.length} characters`,
        content_type: "TEXT",
        source: "DIRECT_INPUT",
        status: "COMPLETED", // Text doesn't need transcription
        user_id: userId,
        processed_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    if (contentError) {
      console.error("Error creating content item:", contentError);
      return NextResponse.json(
        { error: "Failed to create content item" },
        { status: 500 }
      );
    }

    // Create "transcription" record with the direct text
    const { error: transcriptionError } = await supabase
      .from("transcriptions")
      .insert({
        content: text,
        language: "en",
        confidence: 1.0, // Perfect confidence for direct text input
        word_count: text.split(/\s+/).length,
        content_item_id: contentItem.id,
      });

    if (transcriptionError) {
      console.error("Error creating transcription:", transcriptionError);
      return NextResponse.json(
        { error: "Failed to create transcription" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      contentId: contentItem.id,
      message: "Text content processed successfully",
    });
  } catch (error) {
    console.error("Text processing error:", error);
    return NextResponse.json(
      { error: "Failed to process text content" },
      { status: 500 }
    );
  }
}
