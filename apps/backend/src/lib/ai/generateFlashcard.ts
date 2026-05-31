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
  // Diagnostic log + Development mock fallback
  const usingMock = process.env.MOCK_AI === 'true';
  const modelName = process.env.GEMINI_MODEL || 'gemini-1.5-flash-002';
  console.info(`generateFlashcardWithAi — MOCK_AI=${usingMock}, GEMINI_MODEL=${modelName}, GCP_PROJECT_ID=${process.env.GCP_PROJECT_ID ?? 'unset'}, GCP_REGION=${process.env.GCP_REGION ?? 'unset'}, GOOGLE_APPLICATION_CREDENTIALS=${process.env.GOOGLE_APPLICATION_CREDENTIALS ?? 'unset'}`);

  if (usingMock) {
    return {
      question: promptQuestion,
      // Provide a non-echoing mock answer so it's clear this is mocked output
      answer: 'ឧទាហរណ៍ចម្លើយ (MOCK): សូមពិនិត្យវិញដោយវិធីដោះស្រាយ។',
      steps: [
        'ជំហាន 1: វិភាគសំណួរ។',
        'ជំហាន 2: ប្រើក្បាលសមីការឬបច្ចេកទេសដើម្បីគណនា។',
      ],
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

  const url = buildVertexAiUrl(modelName);

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

      const normalize = (s: string) => s.replace(/\s+/g, ' ').trim().toLowerCase();
      const promptNorm = normalize(promptQuestion);
      const echoesPrompt = (s: string) => {
        const normalized = normalize(s);
        return normalized.includes(promptNorm) || promptNorm.includes(normalized);
      };

      const hasKhmer = (s: string) => /[\u1780-\u17FF]/.test(s);
      const answerLooksBad = !hasKhmer(validated.answer) || echoesPrompt(validated.answer) || echoesPrompt(validated.question);

      if (answerLooksBad) {
        if (attempt >= maxRetries) {
          throw new AiProviderError('AI response echoed the question or did not contain Khmer');
        }

        const strictPrompt =
          `${prompt}\n\n` +
          `IMPORTANT: Do not repeat the question. Return only the final answer in Khmer. ` +
          `If you include steps, keep them very short. Output ONLY valid JSON.`;

        const retryRes = await axios.post(
          buildVertexAiUrl(modelName),
          {
            contents: [
              {
                role: 'user',
                parts: [{ text: strictPrompt }],
              },
            ],
          },
          {
            headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
            timeout: 15_000,
          },
        );

        const retryText = retryRes.data?.candidates?.[0]?.content?.parts?.[0]?.text as string | undefined;
        if (!retryText) throw new AiProviderError('Empty response from AI on retry');

        const retryParsed = AiFlashcardSchema.parse(JSON.parse(retryText));
        return retryParsed;
      }

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
  return `Provide a JSON array with exactly one object: {"question":"...","answer":"...","steps":[...]}\n\nRules:\n- Solve the math problem directly.\n- The answer must be the final result, in Khmer.\n- Do NOT copy or repeat the question in the answer.\n- Keep steps short and useful.\n- Output ONLY valid JSON and nothing else.\n\nQuestion: ${escapeForPrompt(question)}`;
}

function escapeForPrompt(s: string) {
  return s.replace(/\n/g, ' ').trim();
}

function buildVertexAiUrl(modelName: string): string {
  return `https://${process.env.GCP_REGION}-aiplatform.googleapis.com/v1/projects/${process.env.GCP_PROJECT_ID}/locations/${process.env.GCP_REGION}/publishers/google/models/${modelName}:generateContent`;
}
