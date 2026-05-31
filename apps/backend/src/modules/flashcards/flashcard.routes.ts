import { FastifyInstance } from 'fastify';
import { handleGenerateFlashcard } from './flashcard.controller';

export async function flashcardRoutes(fastify: FastifyInstance) {
  fastify.post(
    '/flashcard/generate',
    {
      preHandler: fastify.authenticate,

      schema: {
        body: {
          type: 'object',
          properties: {
            lessonId: { type: 'string', format: 'uuid' },
            topic: { type: 'string', minLength: 3 },
            save: { type: 'boolean' },
          },
          required: ['lessonId', 'topic'],
          additionalProperties: false,
        },
      },
    },
    handleGenerateFlashcard as any,
  );
}
