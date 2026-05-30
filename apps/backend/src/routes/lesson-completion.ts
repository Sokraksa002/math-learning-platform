import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../lib/prisma';
import { ensureExists } from '../lib/authHelpers';
import { isValidUuid } from '../lib/validators';

/**
 * ✅ LESSON COMPLETION ROUTES
 */
export async function lessonCompletionRoutes(app: FastifyInstance) {
  /**
   * ✅ MARK LESSON AS COMPLETED
   */
  app.post(
    '/lessons/:lessonId/complete',
    {
      preHandler: app.authenticate, // ✅ must be logged in
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { lessonId } = request.params as { lessonId: string };
      const userId = request.user.userId;

      // ✅ validate lessonId
      if (!isValidUuid(lessonId)) {
        reply.code(400).send({
          success: false,
          error: 'Invalid lesson id',
        });
        return;
      }

      // ✅ ensure lesson exists + published
      const lesson = await prisma.lesson.findFirst({
        where: {
          id: lessonId,
          isPublished: true,
          chapter: {
            isPublished: true,
          },
        },
      });

      if (!ensureExists(lesson, reply, 'Lesson')) return;

      // ✅ create or update completion (prevents duplicates)
      const completion = await prisma.lessonCompletion.upsert({
        where: {
          userId_lessonId: {
            userId,
            lessonId,
          },
        },
        update: {}, // nothing to update
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

  /**
   * ✅ GET USER COMPLETED LESSONS
   */
  app.get(
    '/me/completed-lessons',
    {
      preHandler: app.authenticate, // ✅ must be logged in
    },
    async (request: FastifyRequest) => {
      const userId = request.user.userId;

      const completions = await prisma.lessonCompletion.findMany({
        where: { userId },
        select: {
          lessonId: true,
        },
      });

      return {
        success: true,
        data: completions.map((c) => c.lessonId),
      };
    },
  );

  /**
   * ✅ OPTIONAL: GET COMPLETION STATUS FOR A LESSON
   */
  app.get(
    '/lessons/:lessonId/completion',
    {
      preHandler: app.authenticate,
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { lessonId } = request.params as { lessonId: string };
      const userId = request.user.userId;

      if (!isValidUuid(lessonId)) {
        reply.code(400).send({
          success: false,
          error: 'Invalid lesson id',
        });
        return;
      }

      const record = await prisma.lessonCompletion.findUnique({
        where: {
          userId_lessonId: {
            userId,
            lessonId,
          },
        },
      });

      return {
        success: true,
        data: {
          completed: !!record,
        },
      };
    },
  );
}
