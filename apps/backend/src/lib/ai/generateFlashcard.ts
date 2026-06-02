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
  const usingMock = process.env.MOCK_AI === 'true';
  const modelName = process.env.GEMINI_MODEL || 'gemini-1.5-flash-002';

  if (usingMock) {
    return {
      question: promptQuestion,
      answer: 'ឧទាហរណ៍ចម្លើយ (MOCK): សូមពិនិត្យវិញដោយវិធីដោះស្រាយ។',
      steps: [
        'ជំហាន 1: វិភាគសំណួរ។',
        'ជំហាន 2: ប្រើក្បាលសមីការឬបច្ចេកទេសដើម្បីគណនា។',
      ],
    };
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

      const validated = parseAndValidateAiFlashcard(rawText, promptQuestion);

      if (!validated) {
        if (attempt >= maxRetries) {
          throw new AiProviderError('AI response echoed the question or did not contain Khmer');
        }

        const strictPrompt =
          `${prompt}\n\n` +
          `IMPORTANT: Do not repeat the question. Return only the final answer in Khmer. ` +
          `If you include steps, keep them very short. Output ONLY valid JSON.`;

        const retryRes = await axios.post(
          url,
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

        const retryValidated = parseAndValidateAiFlashcard(retryText, promptQuestion);
        if (!retryValidated) {
          throw new AiProviderError('AI response echoed the question or did not contain Khmer');
        }

        return retryValidated;
      }

      return validated;
    } catch (err: any) {
      const status = err?.response?.status;

      if (status === 429) throw new AiRateLimitError('AI rate limited');
      if (status === 401 || status === 403) throw new AiAuthError('AI auth error');

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

      if (err instanceof AiError) throw err;
      throw new AiProviderError(err?.message ?? 'Unknown AI error');
    }
  }

  throw new AiProviderError('AI provider unavailable after retries');
}

function buildPrompt(question: string): string {
  return `Provide one JSON object with exactly these keys: {"question":"...","answer":"...","steps":[...]}

Rules:
- Solve the math problem directly.
- The answer must be the final result, in Khmer.
- Do NOT copy or repeat the question in the answer.
- Keep steps short and useful.
- Output ONLY valid JSON and nothing else.

Question: ${escapeForPrompt(question)}`;
}

function parseAndValidateAiFlashcard(rawText: string, promptQuestion: string): AiFlashcard | null {
  const normalizedRawText = rawText.trim().replace(/```json/g, '').replace(/```/g, '');

  let parsed: unknown;
  try {
    parsed = JSON.parse(normalizedRawText);
  } catch {
    throw new AiParseError('AI returned invalid JSON', rawText);
  }

  const candidate = Array.isArray(parsed) ? parsed[0] : parsed;
  const validated = AiFlashcardSchema.safeParse(candidate);

  if (!validated.success) {
    throw new AiParseError('AI returned JSON with the wrong shape', rawText);
  }

  const normalize = (s: string) => s.replace(/\s+/g, ' ').trim().toLowerCase();
  const promptNorm = normalize(promptQuestion);
  const echoesPrompt = (s: string) => {
    const normalized = normalize(s);
    return normalized.includes(promptNorm) || promptNorm.includes(normalized);
  };

  const hasKhmer = (s: string) => /[\u1780-\u17FF]/.test(s);
  const answerLooksBad =
    !hasKhmer(validated.data.answer) ||
    echoesPrompt(validated.data.answer) ||
    echoesPrompt(validated.data.question);

  return answerLooksBad ? null : validated.data;
}

function escapeForPrompt(s: string) {
  return s.replace(/\n/g, ' ').trim();
}

function buildVertexAiUrl(modelName: string): string {
  return `https://${process.env.GCP_REGION}-aiplatform.googleapis.com/v1/projects/${process.env.GCP_PROJECT_ID}/locations/${process.env.GCP_REGION}/publishers/google/models/${modelName}:generateContent`;
}
