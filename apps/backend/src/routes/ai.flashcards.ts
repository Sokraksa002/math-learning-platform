import { FastifyInstance } from 'fastify';
import { generateFlashcardsSchema, generateFlashcardsJsonSchema } from '../validators/ai';
import { z } from 'zod';
import { generateFlashcardsForLesson } from '../modules/flashcards/ai.service';
import {
  GeminiAuthError,
  GeminiEmptyResponseError,
  GeminiParseError,
  GeminiRateLimitError,
  GeminiProviderError,
} from '../lib/ai/cloudAIGenerator';
import { prisma } from '../lib/prisma';

export async function aiFlashcardRoutes(fastify: FastifyInstance) {
  fastify.post(
    '/ai/flashcards',
    { preHandler: fastify.authenticate, schema: { body: generateFlashcardsJsonSchema } },
    async (request, reply) => {
      const { lessonId, save } = request.body as unknown as z.infer<
        typeof generateFlashcardsSchema
      >;
      const userId = request.user.userId;

      // ensure lesson exists
      const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } });
      if (!lesson) return reply.code(404).send({ message: 'Lesson not found' });

      try {
        const result = await generateFlashcardsForLesson(lessonId, !!save, userId);
        return { flashcards: result };
      } catch (err: any) {
        if (err instanceof GeminiAuthError) {
          return reply.code(502).send({ code: 'GEMINI_AUTH', message: err.message });
        }
        if (err instanceof GeminiRateLimitError) {
          return reply
            .code(429)
            .send({ code: 'GEMINI_RATE_LIMIT', message: 'Rate limit from provider' });
        }
        if (err instanceof GeminiParseError) {
          return reply
            .code(422)
            .send({ code: 'GEMINI_PARSE_ERROR', message: 'Failed to parse model output' });
        }
        if (err instanceof GeminiEmptyResponseError) {
          return reply
            .code(502)
            .send({ code: 'GEMINI_EMPTY', message: 'Model returned no content' });
        }
        if (err instanceof GeminiProviderError) {
          return reply.code(502).send({ code: 'GEMINI_PROVIDER_ERROR', message: err.message });
        }
        // fallback
        throw err;
      }
    },
  );
}
