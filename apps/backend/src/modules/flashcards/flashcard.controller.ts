import { FastifyRequest, FastifyReply } from 'fastify';
import { generateFlashcardsForLesson } from './ai.service';
import { AiRateLimitError, AiParseError, AiProviderError } from '../../lib/ai/generateFlashcard';

/* ✅ ✅ UPDATE TYPE */
type ReqBody = {
  lessonId: string;
  topic: string;
  save?: boolean;
};

export async function handleGenerateFlashcard(
  request: FastifyRequest<{ Body: ReqBody }>,
  reply: FastifyReply,
) {
  const { lessonId, topic, save } = request.body;

  const userId = (request.user as any)?.userId;

  if (!userId) {
    return reply.code(401).send({
      error: {
        code: 'UNAUTHORIZED',
        message: 'Authentication required',
      },
    });
  }

  try {
    /* ✅ ✅ CALL NEW AI SERVICE */
    const cards = await generateFlashcardsForLesson(lessonId, topic, save ?? false, userId);

    return reply.code(200).send({
      success: true,
      flashcards: cards,
    });
  } catch (err: any) {
    request.log?.error?.(err);

    if (err instanceof AiRateLimitError) {
      return reply.code(429).send({
        success: false,
        code: 'RATE_LIMIT',
        message: err.message,
      });
    }

    if (err instanceof AiParseError) {
      return reply.code(422).send({
        success: false,
        code: 'AI_PARSE_ERROR',
        message: err.message,
      });
    }

    if (err instanceof AiProviderError) {
      return reply.code(502).send({
        success: false,
        code: 'AI_UNAVAILABLE',
        message: err.message,
      });
    }

    const isProd = process.env.NODE_ENV === 'production';
    const safeMessage = isProd ? 'Internal server error' : err?.message || 'Internal server error';

    return reply.code(500).send({
      success: false,
      code: 'INTERNAL_ERROR',
      message: safeMessage,
    });
  }
}
