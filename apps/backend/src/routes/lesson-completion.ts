import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../lib/prisma';
import { ensureExists } from '../lib/authHelpers';
import { isValidUuid } from '../lib/validators';

/**
 * Student lesson completion routes
 */
export async function lessonCompletionRoutes(app: FastifyInstance) {
  /**
   * Mark a lesson as completed
   */
  app.post(
    '/lessons/:lessonId/complete',
    {
      preHandler: app.authenticate, // ✅ user must be logged in
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { lessonId } = request.params as { lessonId: string };
      const userId = request.user.userId;


      // Validate lessonId
      if (!isValidUuid(lessonId)) {
        app.log.warn({ invalidLessonId: lessonId, url: request.raw?.url ?? request.url, ua: request.headers?.['user-agent'] }, 'Invalid lesson id received');
        reply.code(400).send({ success: false, error: 'Invalid lesson id' });
        return;
      }

      // 1️⃣ Ensure lesson exists and its chapter is published
      const lesson = await prisma.lesson.findFirst({
        where: {
          id: lessonId,
          chapter: {
            isPublished: true,
          },
        },
      });

      if (!ensureExists(lesson, reply, 'Lesson')) return;

      // 2️⃣ Create lesson completion (idempotent)
      const completion = await prisma.lessonCompletion.upsert({
        where: {
          userId_lessonId: {
            userId,
            lessonId,
          },
        },
        update: {},
        create: {
          userId,
          lessonId,
        },
      });

      return {
        success: true,
        data: completion,
      };
    },
  );
}
``;
