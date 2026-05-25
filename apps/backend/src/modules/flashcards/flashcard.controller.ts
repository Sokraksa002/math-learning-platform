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
    if (err instanceof AiRateLimitError) {
      return reply.code(429).send({ error: { code: 'RATE_LIMIT', message: err.message } });
    }
    if (err instanceof AiParseError) {
      return reply.code(422).send({ error: { code: 'AI_PARSE_ERROR', message: err.message } });
    }
    if (err instanceof AiProviderError) {
      return reply.code(502).send({ error: { code: 'AI_UNAVAILABLE', message: err.message } });
    }

    // fallback
    return reply
      .code(500)
      .send({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } });
  }
}
