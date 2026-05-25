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
            chapterId: { type: 'string', format: 'uuid' },
            question: { type: 'string', minLength: 3 },
          },
          required: ['chapterId', 'question'],
          additionalProperties: false,
        },
      },
    },
    handleGenerateFlashcard as any
  );
}
