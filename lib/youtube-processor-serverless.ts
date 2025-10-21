import ytdl from "ytdl-core";
import OpenAI from "openai";
import {
  getYouTubeInfoFallback,
  transcribeYouTubeVideoFallback,
} from "./youtube-fallback";

// Lazily initialize OpenAI client to avoid build-time env requirements
let openAIClient: OpenAI | null = null;
function getOpenAIClient(): OpenAI {
  if (!openAIClient) {
    openAIClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openAIClient;
}

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
    ];

    while (retries > 0) {
      try {
        const userAgent =
          userAgents[Math.floor(Math.random() * userAgents.length)];
        console.log(
          `🔄 Info attempt ${
            4 - retries
          } with User-Agent: ${userAgent.substring(0, 50)}...`
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

    if (!info) {
      throw new Error("Failed to retrieve YouTube video info after multiple retries.");
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
 * Updated for serverless environment (Vercel) - no file system operations
 */
export async function transcribeYouTubeVideo(
  url: string
): Promise<TranscriptionResult> {
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

    // Download audio stream directly to memory (no file system)
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

    if (!audioStream) {
      throw new Error("Failed to download YouTube audio after multiple retries.");
    }

    // Collect audio data into buffer chunks
    console.log("💾 Collecting audio data in memory...");
    const chunks: Buffer[] = [];
    
    for await (const chunk of audioStream) {
      chunks.push(Buffer.from(chunk));
    }
    
    const audioBuffer = Buffer.concat(chunks);
    console.log("🎵 Audio collected, size:", audioBuffer.length, "bytes");

    // Transcribe using OpenAI Whisper
    console.log("🤖 Starting transcription with OpenAI Whisper...");
    const openai = getOpenAIClient();
    const transcription = await openai.audio.transcriptions.create({
      file: new File([audioBuffer], "audio.mp3", { type: "audio/mpeg" }),
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
  }
}

/**
 * Validate YouTube URL
 */
export function isValidYouTubeUrl(url: string): boolean {
  const youtubeRegex =
    /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/)|youtu\.be\/)[\w-]+/;
  return youtubeRegex.test(url);
}
