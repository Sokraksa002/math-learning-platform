import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../lib/prisma';
import { ensureExistsAndOwned } from '../lib/authHelpers';

export async function flashcardReviewRoutes(app: FastifyInstance) {
  app.post(
    '/flashcards/:flashcardId/review',
    {
      preHandler: app.authenticate, // ✅ student must be logged in
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { flashcardId } = request.params as {
        flashcardId: string;
      };

      const { rating } = request.body as {
        rating: 'AGAIN' | 'HARD' | 'GOOD' | 'EASY';
      };

      const userId = request.user.userId;

      // 1️⃣ Load flashcard
      const flashcard = await prisma.flashcard.findUnique({ where: { id: flashcardId } });
      if (!ensureExistsAndOwned(flashcard, userId, reply, 'Flashcard')) return;

      // 2️⃣ Save review (learning logic)
      const review = await prisma.flashcardReview.create({
        data: {
          flashcardId,
          userId,
          rating,
          interval: flashcard.interval,
        },
      });

      // 3️⃣ Update spaced repetition fields (simplified)
      await prisma.flashcard.update({
        where: { id: flashcardId },
        data: {
          totalReviews: { increment: 1 },
          nextReviewDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
      });

      // 4️⃣ Record activity event (tracking logic)
      await prisma.activityEvent.create({
        data: {
          userId,
          eventType: 'FLASHCARD_REVIEW',
          entity: flashcardId,
        },
      });

      return {
        success: true,
        message: 'Flashcard reviewed',
        data: review,
      };
    },
  );
}
``;
