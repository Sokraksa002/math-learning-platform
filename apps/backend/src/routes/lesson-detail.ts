import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../lib/prisma';
import { ensureExists } from '../lib/authHelpers';

/**
 * ✅ Simple UUID check
 */
function isValidUuid(id: string) {
  return /^[0-9a-fA-F-]{36}$/.test(id);
}

/**
 * ✅ PUBLIC LESSON DETAIL (safe)
 */
export async function lessonDetailRoutes(app: FastifyInstance) {
  app.get('/lesson/:lessonId', async (request: FastifyRequest, reply: FastifyReply) => {
    const { lessonId } = request.params as { lessonId: string };

    // ✅ Validate ID safely (PREVENT CRASH ✅)
    if (!lessonId || !isValidUuid(lessonId)) {
      reply.code(400).send({
        success: false,
        error: 'Invalid lesson id format',
      });
      return;
    }

    try {
      const lesson = await prisma.lesson.findFirst({
        where: {
          id: lessonId,
          isPublished: true,
        },
        select: {
          id: true,
          titleKm: true,
          orderIndex: true,
          contentJson: true,
          chapterId: true,
        },
      });

      // ✅ Not found handling
      if (!ensureExists(lesson, reply, 'Lesson')) return;

      const content = lesson.contentJson ?? null;

      const titleObj: { en?: string; km?: string } = {
        km: lesson.titleKm ?? undefined,
      };

      // ✅ Optional title extraction from JSON
      try {
        if (content && typeof content === 'object') {
          const c = content as {
            title?: { en?: string; km?: string };
          };

          if (c.title) {
            if (c.title.en) titleObj.en = c.title.en;
            if (c.title.km) titleObj.km = c.title.km;
          }
        }
      } catch {
        // ignore safely
      }

      return {
        success: true,
        data: {
          id: lesson.id,
          title: titleObj,
          fallbackTitle: titleObj.km ?? titleObj.en ?? 'Untitled',
          chapterId: lesson.chapterId,
          orderIndex: lesson.orderIndex,

          // ✅ IMPORTANT
          contentJson: content,
        },
      };
    } catch (err) {
      console.error('❌ Lesson fetch error:', err);

      reply.code(500).send({
        success: false,
        error: 'Failed to fetch lesson',
      });
    }
  });
}
