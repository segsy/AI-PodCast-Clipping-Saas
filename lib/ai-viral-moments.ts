// AI Viral Moments Extraction Service
// Uses Gemini Flash 1.5 for free token usage
// Analyzes transcripts and extracts the most viral moments (20-60 seconds)

import { GoogleGenerativeAI } from "@google/generative-ai";

export interface TranscriptSegment {
  start: number; // in seconds
  end: number;   // in seconds
  text: string;
}

export interface ViralMoment {
  start_time: number;
  end_time: number;
  title: string;
  reason: string;
  viral_score: number; // 1-100
}

export interface ViralMomentsResult {
  moments: ViralMoment[];
  fullTranscript: string;
  modelUsed: string;
}

// Gemini Flash 1.5 model name
const GEMINI_FLASH_15_MODEL = "gemini-2.0-flash-exp";

/**
 * Extract viral moments from transcript using Gemini Flash 1.5
 * 
 * @param segments - Array of transcript segments with timestamps
 * @param maxMoments - Maximum number of moments to extract (default: 10)
 * @returns Array of viral moments with metadata
 */
export async function extractViralMoments(
  segments: TranscriptSegment[],
  maxMoments: number = 10
): Promise<ViralMomentsResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  // Initialize Gemini Flash 1.5
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ 
    model: GEMINI_FLASH_15_MODEL 
  });

  // Build formatted transcript with timestamps
  const formattedTranscript = formatTranscriptWithTimestamps(segments);
  
  // Create the prompt for viral moment extraction
  const prompt = createViralMomentPrompt(formattedTranscript, maxMoments);

  try {
    // Call Gemini Flash 1.5
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Parse the JSON response
    const moments = parseViralMomentsResponse(responseText);
    
    return {
      moments: moments.slice(0, maxMoments),
      fullTranscript: segments.map(s => s.text).join(" "),
      modelUsed: GEMINI_FLASH_15_MODEL,
    };
  } catch (error) {
    console.error("Error extracting viral moments with Gemini:", error);
    throw new Error("Failed to extract viral moments");
  }
}

/**
 * Format transcript segments for the AI prompt
 */
function formatTranscriptWithTimestamps(segments: TranscriptSegment[]): string {
  return segments.map(seg => {
    const startTime = formatTime(seg.start);
    return `[${startTime}] ${seg.text}`;
  }).join("\n");
}

/**
 * Format seconds to HH:MM:SS
 */
function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
}

/**
 * Create the prompt for viral moment extraction
 */
function createViralMomentPrompt(transcript: string, maxMoments: number): string {
  return `You are a professional podcast content editor specializing in short-form viral clips.

Analyze the transcript below and extract the most viral moments.

Rules:
- Each moment must be emotionally engaging, controversial, insightful, or story-driven
- Each clip length must be between 20 and 60 seconds
- Prefer moments with clear punchlines, questions, or strong opinions
- Avoid intros, ads, or filler
- Return ONLY valid JSON (no markdown, no explanations)
- Maximum ${maxMoments} moments

Transcript:
${transcript}

Output JSON format:
[
{
"start_time": number (seconds),
"end_time": number (seconds),
"title": string,
"reason": string,
"viral_score": number (1-100)
}
]`;
}

/**
 * Parse the Gemini response to extract viral moments
 */
function parseViralMomentsResponse(responseText: string): ViralMoment[] {
  try {
    // Try to extract JSON from the response
    // Sometimes Gemini wraps JSON in markdown code blocks
    let jsonStr = responseText.trim();
    
    // Remove markdown code blocks if present
    if (jsonStr.startsWith("```json")) {
      jsonStr = jsonStr.slice(7);
    } else if (jsonStr.startsWith("```")) {
      jsonStr = jsonStr.slice(3);
    }
    
    if (jsonStr.endsWith("```")) {
      jsonStr = jsonStr.slice(0, -3);
    }
    
    jsonStr = jsonStr.trim();
    
    const parsed = JSON.parse(jsonStr);
    
    // Validate and normalize the response
    if (!Array.isArray(parsed)) {
      console.error("Response is not an array:", parsed);
      return [];
    }
    
    return parsed.map((item: any) => ({
      start_time: Number(item.start_time) || 0,
      end_time: Number(item.end_time) || 0,
      title: String(item.title || "").substring(0, 100),
      reason: String(item.reason || "").substring(0, 200),
      viral_score: Math.min(100, Math.max(1, Number(item.viral_score) || 50)),
    }));
  } catch (error) {
    console.error("Error parsing viral moments response:", error);
    console.error("Response text:", responseText);
    return [];
  }
}

/**
 * Extract viral moments from SRT format transcript
 */
export async function extractViralMomentsFromSRT(
  srtContent: string,
  maxMoments: number = 10
): Promise<ViralMomentsResult> {
  const segments = parseSRT(srtContent);
  return extractViralMoments(segments, maxMoments);
}

/**
 * Parse SRT format to segments
 */
function parseSRT(srtContent: string): TranscriptSegment[] {
  const segments: TranscriptSegment[] = [];
  const blocks = srtContent.trim().split(/\n\n+/);
  
  for (const block of blocks) {
    const lines = block.split("\n");
    if (lines.length < 3) continue;
    
    // Extract timing line (format: 00:00:00,000 --> 00:00:00,000)
    const timingLine = lines.find(line => line.includes("-->"));
    if (!timingLine) continue;
    
    const times = timingLine.split("-->");
    if (times.length !== 2) continue;
    
    const startTime = parseSRTTime(times[0].trim());
    const endTime = parseSRTTime(times[1].trim());
    
    // Text is everything after the timing line
    const text = lines.slice(lines.indexOf(timingLine) + 1).join(" ").trim();
    
    if (text) {
      segments.push({
        start: startTime,
        end: endTime,
        text: text,
      });
    }
  }
  
  return segments;
}

/**
 * Parse SRT time format (HH:MM:SS,mmm) to seconds
 */
function parseSRTTime(timeStr: string): number {
  const match = timeStr.match(/(\d{2}):(\d{2}):(\d{2})[,.](\d{3})/);
  if (!match) return 0;
  
  const hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const seconds = parseInt(match[3], 10);
  const ms = parseInt(match[4], 10);
  
  return hours * 3600 + minutes * 60 + seconds + ms / 1000;
}

/**
 * Convert viral moments to SRT format for reference
 */
export function momentsToSRTMoments(moments: ViralMoment[]): string {
  return moments.map((moment, index) => {
    const startTime = formatSRTTime(moment.start_time);
    const endTime = formatSRTTime(moment.end_time);
    return `${index + 1}\n${startTime} --> ${endTime}\n${moment.title}\n${moment.reason}\n`;
  }).join("\n");
}

function formatSRTTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 1000);
  
  return `${pad(hours)}:${pad(minutes)}:${pad(secs)},${pad(ms, 3)}`;
}

function pad(num: number, size: number = 2): string {
  return num.toString().padStart(size, "0");
}
