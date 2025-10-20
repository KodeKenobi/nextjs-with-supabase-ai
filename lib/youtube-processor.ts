import ytdl from "ytdl-core";
import OpenAI from "openai";
import { createWriteStream, createReadStream } from "fs";
import { pipeline } from "stream/promises";
import { randomBytes } from "crypto";
import { join } from "path";
import { unlink } from "fs/promises";
import {
  getYouTubeInfoFallback,
  transcribeYouTubeVideoFallback,
} from "./youtube-fallback";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface YouTubeInfo {
  title: string;
  description: string;
  duration: number;
  thumbnail: string;
  author: string;
}

export interface TranscriptionResult {
  text: string;
  language: string;
  confidence: number;
  wordCount: number;
}

/**
 * Extract YouTube video information
 */
export async function getYouTubeInfo(url: string): Promise<YouTubeInfo> {
  try {
    console.log("🔍 Getting YouTube info for:", url);

    // Try multiple approaches to get video info
    let info;
    let retries = 3; // Reduced retries for faster fallback
    const userAgents = [
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/121.0",
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15",
    ];

    while (retries > 0) {
      try {
        const userAgent =
          userAgents[Math.floor(Math.random() * userAgents.length)];
        console.log(
          `🔄 Attempt ${4 - retries} with User-Agent: ${userAgent.substring(
            0,
            50
          )}...`
        );

        info = await ytdl.getInfo(url, {
          requestOptions: {
            headers: {
              "User-Agent": userAgent,
              Accept:
                "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
              "Accept-Language": "en-US,en;q=0.5",
              "Accept-Encoding": "gzip, deflate",
              DNT: "1",
              Connection: "keep-alive",
              "Upgrade-Insecure-Requests": "1",
            },
          },
        });
        break;
      } catch (retryError) {
        retries--;
        console.log(`⚠️ Retry attempt ${4 - retries} failed:`, retryError);
        if (retries === 0) throw retryError;
        // Exponential backoff
        const delay = Math.pow(2, 4 - retries) * 1000;
        console.log(`⏳ Waiting ${delay}ms before retry...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
    // If we still don't have info, bail to fallback
    if (!info || !info.videoDetails) {
      throw new Error("Missing video details after retries");
    }

    const videoDetails = info.videoDetails;
    console.log("✅ YouTube info retrieved successfully");

    return {
      title: videoDetails.title,
      description: videoDetails.description || "",
      duration: parseInt(videoDetails.lengthSeconds),
      thumbnail: videoDetails.thumbnails[0]?.url || "",
      author: videoDetails.author.name,
    };
  } catch (error) {
    console.error("Error getting YouTube info:", error);
    console.log("🔄 Attempting fallback method...");

    try {
      return await getYouTubeInfoFallback(url);
    } catch (fallbackError) {
      console.error("Fallback method also failed:", fallbackError);
      throw new Error(
        "Failed to extract YouTube video information. This might be due to YouTube's anti-bot measures. Please try a different video or try again later."
      );
    }
  }
}

/**
 * Download YouTube audio and transcribe using OpenAI Whisper
 */
export async function transcribeYouTubeVideo(
  url: string
): Promise<TranscriptionResult> {
  let tempFilePath: string | null = null;

  try {
    console.log("🎥 Starting YouTube video processing:", url);

    // Get video info first
    const videoInfo = await getYouTubeInfo(url);
    console.log("📹 Video info:", videoInfo.title);

    // Check if OpenAI key is available
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OpenAI API key is not configured");
    }
    console.log("✅ OpenAI API key is available");

    // Create temporary file for audio
    const tempFileName = `audio_${randomBytes(16).toString("hex")}.mp3`;
    tempFilePath = join(process.cwd(), "temp", tempFileName);

    // Ensure temp directory exists
    const { mkdir } = await import("fs/promises");
    try {
      await mkdir(join(process.cwd(), "temp"), { recursive: true });
    } catch (err) {
      // Directory might already exist
    }

    // Download audio stream with retry logic
    let audioStream: NodeJS.ReadableStream | undefined;
    let audioRetries = 2; // Reduced retries for faster fallback
    const userAgents = [
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    ];

    while (audioRetries > 0) {
      try {
        const userAgent =
          userAgents[Math.floor(Math.random() * userAgents.length)];
        console.log(
          `🔄 Audio download attempt ${
            3 - audioRetries
          } with User-Agent: ${userAgent.substring(0, 50)}...`
        );

        audioStream = ytdl(url, {
          filter: "audioonly",
          quality: "highestaudio",
          requestOptions: {
            headers: {
              "User-Agent": userAgent,
              Accept:
                "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
              "Accept-Language": "en-US,en;q=0.5",
              "Accept-Encoding": "gzip, deflate",
              DNT: "1",
              Connection: "keep-alive",
              "Upgrade-Insecure-Requests": "1",
            },
          },
        });
        break;
      } catch (audioError) {
        audioRetries--;
        console.log(
          `⚠️ Audio download retry attempt ${3 - audioRetries} failed:`,
          audioError
        );
        if (audioRetries === 0) throw audioError;
        // Exponential backoff
        const delay = Math.pow(2, 3 - audioRetries) * 1000;
        console.log(`⏳ Waiting ${delay}ms before audio retry...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    // Ensure we have a valid stream
    if (!audioStream) {
      throw new Error("Failed to initialize audio stream");
    }

    // Write stream to temporary file
    console.log("💾 Writing audio to temporary file:", tempFilePath);
    const writeStream = createWriteStream(tempFilePath);
    await pipeline(audioStream as any, writeStream);

    // Get file stats
    const { stat } = await import("fs/promises");
    const stats = await stat(tempFilePath);
    console.log("🎵 Audio downloaded, size:", stats.size, "bytes");

    // Transcribe using OpenAI Whisper
    console.log("🤖 Starting transcription with OpenAI Whisper...");
    const transcription = await openai.audio.transcriptions.create({
      file: createReadStream(tempFilePath),
      model: "whisper-1",
      language: "en", // You can make this dynamic based on video language
      response_format: "verbose_json",
    });

    const text = transcription.text;
    const wordCount = text.split(" ").length;

    console.log("✅ Transcription completed:", wordCount, "words");

    return {
      text,
      language: "en",
      confidence: 0.95, // Whisper doesn't provide confidence scores, using high default
      wordCount,
    };
  } catch (error) {
    console.error("❌ YouTube transcription error:", error);
    console.log("🔄 Attempting fallback transcription method...");

    try {
      return await transcribeYouTubeVideoFallback(url);
    } catch (fallbackError) {
      console.error("Fallback transcription also failed:", fallbackError);
      throw new Error(
        `Failed to transcribe YouTube video: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  } finally {
    // Clean up temporary file
    if (tempFilePath) {
      try {
        await unlink(tempFilePath);
        console.log("🗑️ Cleaned up temporary file:", tempFilePath);
      } catch (cleanupError) {
        console.warn("⚠️ Failed to clean up temporary file:", cleanupError);
      }
    }
  }
}

/**
 * Validate YouTube URL
 */
export function isValidYouTubeUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return (
      ((urlObj.hostname === "www.youtube.com" ||
        urlObj.hostname === "youtube.com") &&
        urlObj.pathname === "/watch" &&
        urlObj.searchParams.has("v")) ||
      (urlObj.hostname === "youtu.be" && urlObj.pathname.length > 1)
    );
  } catch {
    return false;
  }
}

/**
 * Extract video ID from YouTube URL
 */
export function extractVideoId(url: string): string | null {
  try {
    const urlObj = new URL(url);

    if (urlObj.hostname === "youtu.be") {
      return urlObj.pathname.slice(1);
    }

    if (
      (urlObj.hostname === "www.youtube.com" ||
        urlObj.hostname === "youtube.com") &&
      urlObj.pathname === "/watch"
    ) {
      return urlObj.searchParams.get("v");
    }

    return null;
  } catch {
    return null;
  }
}
