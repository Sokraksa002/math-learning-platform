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

/* ✅ FINAL VERSION */
export async function aiFlashcardRoutes(fastify: FastifyInstance) {
  fastify.post(
    '/ai/flashcards',
    {
      preHandler: fastify.authenticate,
      schema: { body: generateFlashcardsJsonSchema },
    },
    async (request, reply) => {
      try {
        const { lessonId, topic, save } = request.body as z.infer<typeof generateFlashcardsSchema>;

        const userId = request.user.userId;

        /* ✅ ✅ REMOVE PRISMA LESSON CHECK (CRITICAL FIX) */
        // ❌ DO NOT use prisma.lesson.findUnique()

        const result = await generateFlashcardsForLesson(lessonId, topic, save, userId);

        return {
          flashcards: result,
        };
      } catch (err: any) {
        /* ✅ HANDLE AI ERRORS CLEANLY */
        if (err instanceof GeminiAuthError) {
          return reply.code(502).send({ code: 'GEMINI_AUTH', message: err.message });
        }

        if (err instanceof GeminiRateLimitError) {
          return reply
            .code(429)
            .send({ code: 'GEMINI_RATE_LIMIT', message: 'Rate limited by AI provider' });
        }

        if (err instanceof GeminiParseError) {
          return reply
            .code(422)
            .send({ code: 'GEMINI_PARSE_ERROR', message: 'Invalid AI response format' });
        }

        if (err instanceof GeminiEmptyResponseError) {
          return reply
            .code(502)
            .send({ code: 'GEMINI_EMPTY', message: 'AI returned empty response' });
        }

        if (err instanceof GeminiProviderError) {
          return reply.code(502).send({ code: 'GEMINI_PROVIDER_ERROR', message: err.message });
        }

        /* ✅ FALLBACK ERROR */
        request.log.error(err);

        return reply.code(500).send({
          code: 'INTERNAL_ERROR',
          message: err.message || 'Failed to generate flashcards',
        });
      }
    },
  );
}
