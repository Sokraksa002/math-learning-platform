import axios from 'axios';
import { GoogleAuth } from 'google-auth-library';
import { LessonContent, TextBlock, FormulaBlock } from '../contentJson';
import { buildGeminiPrompt } from './prompts/geminiPrompt';
import { aiFlashcardSchema } from './aiFlashcard.schema';

/**
 * Custom errors for clearer error handling upstream
 */
export class GeminiError extends Error {}
export class GeminiAuthError extends GeminiError {}
export class GeminiEmptyResponseError extends GeminiError {}
export class GeminiParseError extends GeminiError {
  public raw?: string;
  constructor(message?: string, raw?: string) {
    super(message);
    this.raw = raw;
  }
}
export class GeminiRateLimitError extends GeminiError {}
export class GeminiProviderError extends GeminiError {}

/**
 * Flashcard structure returned by AI
 */
export interface AIGeneratedFlashcard {
  question: string;
  answer: string;
}

/**
 * Extract lesson text from validated contentJson
 * (Text + Formula only)
 */
function extractLessonText(content: LessonContent): string {
  return content.blocks
    .filter(
      (block): block is TextBlock | FormulaBlock =>
        block.type === 'text' || block.type === 'formula',
    )
    .map((block) => block.value)
    .join('\n');
}

/**
 * Generate flashcards using Google Vertex AI (Gemini)
 */
export async function generateFlashcardsWithGemini(
  content: LessonContent,
): Promise<AIGeneratedFlashcard[]> {
  // 1️⃣ Extract lesson text
  const lessonText = extractLessonText(content);

  if (!lessonText.trim()) {
    return [];
  }

  // 2️⃣ Build prompt
  const prompt = buildGeminiPrompt(lessonText);

  // 3️⃣ Authenticate with Google Cloud
  const auth = new GoogleAuth({
    scopes: ['https://www.googleapis.com/auth/cloud-platform'],
  });

  const client = await auth.getClient();
  const accessTokenResponse = await client.getAccessToken();

  if (!accessTokenResponse.token) {
    throw new GeminiAuthError('Failed to obtain Google Cloud access token');
  }

  // 4️⃣ Call Gemini (handle provider HTTP errors explicitly)
  // Retry logic for transient 5xx errors
  const maxRetries = 3;
  const baseDelayMs = 300; // backoff base
  let response: any;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      response = await axios.post(
        `https://${process.env.GCP_REGION}-aiplatform.googleapis.com/v1/projects/${process.env.GCP_PROJECT_ID}/locations/${process.env.GCP_REGION}/publishers/google/models/gemini-pro:generateContent`,
        {
          // request body: message contents and model parameters
          contents: [
            {
              role: 'user',
              parts: [{ text: prompt }],
            },
          ],
          // optional tuning params to encourage stable JSON output in Khmer
          temperature: 0.2,
          maxOutputTokens: 512,
        },
        {
          headers: {
            Authorization: `Bearer ${accessTokenResponse.token}`,
            'Content-Type': 'application/json',
          },
        },
      );
      break; // success
    } catch (err: any) {
      const status = err?.response?.status;
      // Non-retryable conditions
      if (status === 401 || status === 403) {
        throw new GeminiAuthError('Gemini provider returned auth error');
      }
      if (status === 429) {
        throw new GeminiRateLimitError('Gemini rate limit');
      }

      // Retry on 5xx
      if (status >= 500 && status < 600) {
        if (attempt >= maxRetries) {
          throw new GeminiProviderError('Gemini provider error after retries');
        }

        // exponential backoff with jitter (use attempt+1 to match previous backoff behavior)
        const backoff = Math.pow(2, attempt + 1) * baseDelayMs;
        const jitter = Math.floor(Math.random() * baseDelayMs);
        const delay = backoff + jitter;
        await new Promise((res) => setTimeout(res, delay));
        continue; // retry
      }

      // Other errors
      throw new GeminiProviderError(err?.message ?? 'Unknown provider error');
    }
  }

  // 5️⃣ Extract AI output
  const rawText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!rawText) {
    throw new GeminiEmptyResponseError('Gemini returned empty response');
  }

  // 6️⃣ Parse + validate AI JSON
  let parsedJson: unknown;

  try {
    parsedJson = JSON.parse(rawText);
  } catch (err) {
    // log raw text for debugging (avoid sensitive data leaking in prod logs)
    console.error('Invalid JSON from Gemini:', rawText);
    throw new GeminiParseError('Gemini response is not valid JSON', rawText);
  }

  // ✅ Zod validation gives full type safety
  const validatedFlashcards = aiFlashcardSchema.parse(parsedJson);

  // Quick heuristic: ensure output contains Khmer characters; if not, retry once with stronger instruction
  const hasKhmer = (s: string) => /[\u1780-\u17FF]/.test(s);
  const containsKhmer = validatedFlashcards.some((f: any) => hasKhmer(f.question) || hasKhmer(f.answer));
  if (!containsKhmer) {
    console.warn('Gemini response did not contain Khmer; retrying once with stronger Khmer-only instruction');
    const retryPrompt = prompt + '\n\nIMPORTANT: Respond ONLY in Khmer (ភាសាខ្មែរ) using Khmer script. Output ONLY valid JSON as previously requested.';

    let retryResponse: any;
    try {
      retryResponse = await axios.post(
        `https://${process.env.GCP_REGION}-aiplatform.googleapis.com/v1/projects/${process.env.GCP_PROJECT_ID}/locations/${process.env.GCP_REGION}/publishers/google/models/gemini-pro:generateContent`,
        {
          contents: [
            {
              role: 'user',
              parts: [{ text: retryPrompt }],
            },
          ],
          temperature: 0.2,
          maxOutputTokens: 512,
        },
        {
          headers: {
            Authorization: `Bearer ${accessTokenResponse.token}`,
            'Content-Type': 'application/json',
          },
        },
      );
    } catch (err: any) {
      throw new GeminiProviderError('Gemini retry failed: ' + (err?.message ?? 'unknown'));
    }

    const rawRetry = retryResponse.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawRetry) throw new GeminiEmptyResponseError('Gemini returned empty response on retry');

    try {
      parsedJson = JSON.parse(rawRetry);
    } catch (err) {
      console.error('Invalid JSON from Gemini on retry:', rawRetry);
      throw new GeminiParseError('Gemini response is not valid JSON on retry', rawRetry);
    }

    const validatedRetry = aiFlashcardSchema.parse(parsedJson);
    const retryContainsKhmer = validatedRetry.some((f: any) => hasKhmer(f.question) || hasKhmer(f.answer));
    if (!retryContainsKhmer) {
      console.warn('Gemini still did not return Khmer after retry');
    }
    return validatedRetry;
  }

  return validatedFlashcards;
}
``;
