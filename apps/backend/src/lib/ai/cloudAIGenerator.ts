import axios from 'axios';
import { GoogleAuth } from 'google-auth-library';
import fs from 'fs';

export interface AIGeneratedFlashcard {
  question: string;
  answer: string;
}

/* ================= ERRORS ================= */

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

/* ================= MAIN FUNCTION ================= */

export async function generateFlashcardsWithGemini(input: {
  topic: string;
}): Promise<AIGeneratedFlashcard[]> {
  const usingMock = process.env.MOCK_AI === 'true';

  const modelName = process.env.GEMINI_MODEL || 'gemini-1.5-flash-002';

  const projectId = process.env.GCP_PROJECT_ID;
  const region = process.env.GCP_REGION;
  const keyFile = process.env.GOOGLE_APPLICATION_CREDENTIALS;

  if (!projectId || !region || !keyFile) {
    throw new GeminiAuthError('Missing required GCP environment variables');
  }

  if (!fs.existsSync(keyFile)) {
    throw new GeminiAuthError(`Key file not found: ${keyFile}`);
  }

  /* ✅ ✅ PROMPT USING TOPIC (IMPORTANT) */
  const prompt = `
You are a math tutor.

Solve the following math problem step-by-step.

STRICT RULES:
- Use Khmer language
- Return ONLY JSON
- DO NOT include explanation before or after JSON
- DO NOT include markdown like \`\`\`
- Output MUST be valid JSON

Format EXACTLY like this:

[
  {
    "question": "...",
    "answer": "..."
  }
]

Problem:
${input.topic}
`;

  /* ✅ MOCK MODE */
  if (usingMock) {
    return [
      {
        question: input.topic,
        answer: `នេះជាចម្លើយគំរូសម្រាប់ ${input.topic}`,
      },
    ];
  }

  /* ✅ AUTH */
  const auth = new GoogleAuth({
    keyFile,
    scopes: ['https://www.googleapis.com/auth/cloud-platform'],
  });

  const client = await auth.getClient();
  const tokenResponse = await client.getAccessToken();

  if (!tokenResponse?.token) {
    throw new GeminiAuthError('Failed to get access token');
  }

  let response;

  try {
    response = await axios.post(
      buildVertexAiUrl(modelName),
      {
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }],
          },
        ],
        temperature: 0.2,
        maxOutputTokens: 512,
      },
      {
        headers: {
          Authorization: `Bearer ${tokenResponse.token}`,
          'Content-Type': 'application/json',
        },
      },
    );
  } catch (err: any) {
    const status = err?.response?.status;

    if (status === 401 || status === 403) {
      throw new GeminiAuthError('Authentication failed');
    }

    if (status === 429) {
      throw new GeminiRateLimitError('Rate limit exceeded');
    }

    if (status >= 500) {
      throw new GeminiProviderError('Gemini server error');
    }

    throw new GeminiProviderError(err?.message);
  }

  /* ✅ EXTRACT RESPONSE */
  const rawText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!rawText) {
    throw new GeminiEmptyResponseError('Empty response from Gemini');
  }

  let parsed: any;

  /* ✅ CLEAN RESPONSE */
  let cleanText = rawText.trim();

  /* remove markdown ```json */
  cleanText = cleanText.replace(/```json/g, '').replace(/```/g, '');

  /* remove text before JSON array */
  const jsonStart = cleanText.indexOf('[');
  if (jsonStart !== -1) {
    cleanText = cleanText.substring(jsonStart);
  }

  try {
    parsed = JSON.parse(cleanText);
  } catch {
    console.error('INVALID JSON AFTER CLEAN:', cleanText);

    /* ✅ FALLBACK: return raw AI text instead of crashing */
    return [
      {
        question: input.topic,
        answer: rawText,
      },
    ];
  }

  /* ✅ VALIDATE FORMAT */
  if (!Array.isArray(parsed)) {
    throw new GeminiParseError('Response is not array', rawText);
  }

  const result: AIGeneratedFlashcard[] = parsed.map((item: any) => ({
    question: String(item.question || input.topic),
    answer: String(item.answer || 'No answer'),
  }));

  // Post-process answers: normalize LaTeX typos and extract concise final solution
  function normalizeLatex(s: string): string {
    if (!s) return s;
    let out = s;
    out = out.replace(/\brac\{/g, "\\frac{");
    out = out.replace(/\bfrc\{/g, "\\frac{");
    out = out.replace(/(?<!\\)\bfrac\{/g, "\\frac{");
    out = out.replace(/->/g, " \\to ");
    out = out.replace(/→/g, " \\to ");
    out = out.replace(/\binfty\b/g, "\\infty");
    out = out.replace(/`([^`]+)`/g, "$1");
    return out;
  }

  function extractFinal(s: string): string {
    if (!s) return s;
    let t = s.trim();
    // try to find last '=' and take RHS
    const lastEq = t.lastIndexOf('=');
    if (lastEq !== -1 && lastEq < t.length - 1) {
      const cand = t.slice(lastEq + 1).trim().replace(/^[\s:\-–]+|[\s;,.]+$/g, '');
      if (cand) return cand;
    }
    // fallback: last non-empty line
    const lines = t.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    if (lines.length) return lines[lines.length - 1];
    return t;
  }

  for (const r of result) {
    r.answer = normalizeLatex(String(r.answer));
    try {
      const concise = extractFinal(r.answer);
      if (concise) r.answer = concise;
    } catch {
      // ignore
    }
  }

  // Additional cleanup: remove stray words and ensure a single math block
  for (const r of result) {
    let a = String(r.answer || '');
    // remove leading words like 'exists' or 'there exists'
    a = a.replace(/^\s*(?:exists|there exists)\s*/i, '');
    // fix common typo: 'x o 0' or 'x o  \to 0' -> 'x \\to 0'
    a = a.replace(/x\s*o\s*0/g, 'x \\to 0');
    a = a.replace(/\\?\s*o\s*/g, ' \\to ');
    // collapse multiple dollar signs to at most two
    a = a.replace(/\${3,}/g, '$$');
    // if there is text before the first math indicator, strip it
    const mathIndex = a.search(/(\\frac|lim_|\\to|\\infty|\\\(|\\\[|\$\$|\$)/);
    if (mathIndex > 0) {
      a = a.slice(mathIndex).trim();
    }
    // ensure wrapped in $$ if it looks like LaTeX and not already wrapped
    if (/\\frac|lim_|\\to|\\infty|\\sqrt/.test(a) && !/^\$\$[\s\S]*\$\$/.test(a)) {
      a = `$$${a}$$`;
    }
    // final trim
    r.answer = a.trim();
  }

  return result;
}

/* ================= HELPER ================= */

function buildVertexAiUrl(modelName: string): string {
  return `https://${process.env.GCP_REGION}-aiplatform.googleapis.com/v1/projects/${process.env.GCP_PROJECT_ID}/locations/${process.env.GCP_REGION}/publishers/google/models/${modelName}:generateContent`;
}
