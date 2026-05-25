import { FastifyInstance, FastifyRequest } from 'fastify';
import { prisma } from '../lib/prisma';

/**
 * Student flashcards due for review
 */
export async function flashcardsDueRoutes(app: FastifyInstance) {
  app.get(
    '/flashcards/due',
    {
      preHandler: app.authenticate, // ✅ student must be logged in
    },
    async (request: FastifyRequest) => {
      const userId = request.user.userId;

      const { chapterId, limit = '20' } = request.query as {
        chapterId?: string;
        limit?: string;
      };

      const now = new Date();

      const flashcards = await prisma.flashcard.findMany({
        where: {
          userId,
          nextReviewDate: {
            lte: now, // ✅ due now or overdue
          },
          ...(chapterId ? { chapterId } : {}),
        },
        orderBy: {
          nextReviewDate: 'asc',
        },
        take: Number(limit),
        select: {
          id: true,
          questionKm: true,
          answerJson: true,
          interval: true,
          easeFactor: true,
          totalReviews: true,
          nextReviewDate: true,
          chapterId: true,
        },
      });

      return {
        success: true,
        data: flashcards,
      };
    },
  );
}
