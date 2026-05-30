import axios from 'axios';
import { GoogleAuth } from 'google-auth-library';
import { z } from 'zod';

export const AiFlashcardSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
  steps: z.array(z.string()).optional(),
});

export type AiFlashcard = z.infer<typeof AiFlashcardSchema>;

export class AiError extends Error {}
export class AiRateLimitError extends AiError {}
export class AiParseError extends AiError {
  public raw?: string;
  constructor(message?: string, raw?: string) {
    super(message);
    this.raw = raw;
  }
}
export class AiProviderError extends AiError {}
export class AiAuthError extends AiError {}

/**
 * Call external AI (Gemini) to produce a step-by-step math solution in Khmer.
 * Retries on 5xx / network errors with exponential backoff. Max 2 retries.
 */
export async function generateFlashcardWithAi(promptQuestion: string): Promise<AiFlashcard> {
  // Development mock fallback
  if (process.env.MOCK_AI === 'true') {
    return {
      question: promptQuestion,
      answer: 'This is a mocked AI answer (MOCK_AI=true)',
      steps: ['Mocked step 1', 'Mocked step 2'],
    } as AiFlashcard;
  }

  if (!process.env.GCP_PROJECT_ID || !process.env.GCP_REGION) {
    throw new AiProviderError('AI provider configuration missing');
  }

  const prompt = buildPrompt(promptQuestion);

  const auth = new GoogleAuth({ scopes: ['https://www.googleapis.com/auth/cloud-platform'] });
  const client = await auth.getClient();
  const accessTokenResponse = await client.getAccessToken();
  const token = accessTokenResponse?.token;
  if (!token) throw new AiAuthError('Failed to obtain access token');

  const url = `https://${process.env.GCP_REGION}-aiplatform.googleapis.com/v1/projects/${process.env.GCP_PROJECT_ID}/locations/${process.env.GCP_REGION}/publishers/google/models/gemini-pro:generateContent`;

  const maxRetries = 2;
  const baseDelayMs = 300;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const res = await axios.post(
        url,
        {
          contents: [
            {
              role: 'user',
              parts: [{ text: prompt }],
            },
          ],
        },
        {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          timeout: 15_000,
        },
      );

      const rawText = res.data?.candidates?.[0]?.content?.parts?.[0]?.text as string | undefined;
      if (!rawText) throw new AiProviderError('Empty response from AI');

      let parsed: unknown;
      try {
        parsed = JSON.parse(rawText);
      } catch (err) {
        throw new AiParseError('AI returned invalid JSON', rawText);
      }

      const validated = AiFlashcardSchema.parse(parsed);
      return validated;
    } catch (err: any) {
      const status = err?.response?.status;
      // Rate limit
      if (status === 429) throw new AiRateLimitError('AI rate limited');
      if (status === 401 || status === 403) throw new AiAuthError('AI auth error');

      // Retry for 5xx
      if (
        (status && status >= 500 && status < 600) ||
        err.code === 'ECONNABORTED' ||
        err.code === 'ENOTFOUND'
      ) {
        if (attempt >= maxRetries) {
          throw new AiProviderError('AI provider unavailable after retries');
        }
        const delay = Math.pow(2, attempt) * baseDelayMs;
        await new Promise((res) => setTimeout(res, delay));
        continue;
      }

      // Otherwise bubble up as provider error
      if (err instanceof AiError) throw err;
      throw new AiProviderError(err?.message ?? 'Unknown AI error');
    }
  }

  // If we somehow exit the retry loop without returning or throwing, treat as provider error
  throw new AiProviderError('AI provider unavailable after retries');
}

function buildPrompt(question: string): string {
  return `Provide a JSON object with keys {"question","answer","steps"} where:\n- "question": the original question (in Khmer)\n- "answer": the final numeric/text answer (in Khmer)\n- "steps": an array of strings describing step-by-step solution in Khmer\n\nReturn only valid JSON. Question: ${escapeForPrompt(question)}`;
}

function escapeForPrompt(s: string) {
  return s.replace(/\n/g, ' ').trim();
}
