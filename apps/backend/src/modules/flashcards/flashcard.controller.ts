import { FastifyRequest, FastifyReply } from 'fastify';
import { generateAndSaveFlashcard } from './flashcard.service';
import { AiRateLimitError, AiParseError, AiProviderError } from '../../lib/ai/generateFlashcard';

type ReqBody = {
  chapterId: string;
  question: string;
};

export async function handleGenerateFlashcard(
  request: FastifyRequest<{ Body: ReqBody }>,
  reply: FastifyReply,
) {
  const { chapterId, question } = request.body;
  const userId = (request.user as any)?.userId as string | undefined;

  if (!userId) {
    return reply
      .code(401)
      .send({ error: { code: 'UNAUTHORIZED', message: 'Authentication required' } });
  }

  try {
    const result = await generateAndSaveFlashcard({ userId, chapterId, question });
    return reply.code(200).send(result.flashcard);
  } catch (err: any) {
    // log full error for easier diagnosis in server logs
    request.log?.error?.(err);
    if (err instanceof AiRateLimitError) {
      return reply.code(429).send({ success: false, code: 'RATE_LIMIT', message: err.message });
    }
    if (err instanceof AiParseError) {
      return reply.code(422).send({ success: false, code: 'AI_PARSE_ERROR', message: err.message });
    }
    if (err instanceof AiProviderError) {
      return reply.code(502).send({ success: false, code: 'AI_UNAVAILABLE', message: err.message });
    }

    // fallback
    const isProd = process.env.NODE_ENV === 'production';
    const safeMessage = isProd ? 'Internal server error' : err?.message || 'Internal server error';
    return reply.code(500).send({ success: false, code: 'INTERNAL_ERROR', message: safeMessage });
  }
}
