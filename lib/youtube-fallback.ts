// No OpenAI usage in fallback to avoid build-time env requirements

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
 * Fallback method: Extract basic info from URL and create a mock transcription
 * This is used when ytdl-core fails due to YouTube's anti-bot measures
 */
export async function getYouTubeInfoFallback(
  url: string
): Promise<YouTubeInfo> {
  try {
    console.log("🔄 Using fallback method for YouTube info:", url);

    // Extract video ID
    const videoId = extractVideoId(url);
    if (!videoId) {
      throw new Error("Invalid YouTube URL");
    }

    // Create a basic info object
    return {
      title: `YouTube Video ${videoId}`,
      description: "Video description not available due to access restrictions",
      duration: 0, // Unknown duration
      thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      author: "Unknown Author",
    };
  } catch (error) {
    console.error("Error in fallback YouTube info:", error);
    throw new Error("Failed to extract YouTube video information");
  }
}

/**
 * Fallback transcription method: Create a mock transcription
 * This is used when the actual audio extraction fails
 */
export async function transcribeYouTubeVideoFallback(
  url: string
): Promise<TranscriptionResult> {
  try {
    console.log("🔄 Using fallback transcription method for:", url);

    const videoId = extractVideoId(url);
    if (!videoId) {
      throw new Error("Invalid YouTube URL");
    }

    // Create a mock transcription explaining the limitation
    const mockText = `This is a placeholder transcription for YouTube video ${videoId}. 

The actual audio transcription could not be extracted due to YouTube's anti-bot measures. This is a common issue with YouTube video processing tools.

To get the actual transcription, you could:
1. Try a different video URL
2. Use the video's built-in captions if available
3. Try again later when YouTube's restrictions may be less strict

The video appears to be accessible at: ${url}

Please note that this is a limitation of the current YouTube processing system and not an error in the application.`;

    const wordCount = mockText.split(" ").length;

    console.log("✅ Fallback transcription completed:", wordCount, "words");

    return {
      text: mockText,
      language: "en",
      confidence: 0.1, // Low confidence since it's a mock
      wordCount,
    };
  } catch (error) {
    console.error("❌ Fallback transcription error:", error);
    throw new Error(
      `Failed to create fallback transcription: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Extract video ID from YouTube URL
 */
function extractVideoId(url: string): string | null {
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
