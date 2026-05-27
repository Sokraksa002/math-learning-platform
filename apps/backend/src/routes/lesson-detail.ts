import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../lib/prisma';
import { ensureExists } from '../lib/authHelpers';
import { isValidUuid } from '../lib/validators';

/**
 * Student-safe lesson detail route
 */
export async function lessonDetailRoutes(app: FastifyInstance) {
  /**
   * Get lesson content (only if parent chapter is published)
   */
  app.get('/lessons/:lessonId', async (request: FastifyRequest, reply: FastifyReply) => {
    const { lessonId } = request.params as {
      lessonId: string;
    };

    if (!isValidUuid(lessonId)) {
      app.log.warn({ invalidLessonId: lessonId, url: request.raw?.url ?? request.url, ua: request.headers?.['user-agent'] }, 'Invalid lesson id received');
      reply.code(400).send({ success: false, error: 'Invalid lesson id' });
      return;
    }

    // 1️⃣ Fetch lesson + its chapter visibility
    const lesson = await prisma.lesson.findFirst({
      where: {
        id: lessonId,
        chapter: {
          isPublished: true, // ✅ enforce visibility
        },
      },
      select: {
        id: true,
        titleKm: true,
        orderIndex: true,
        contentJson: true,
      },
    });

    if (!ensureExists(lesson, reply, 'Lesson')) return;

    // Build localized title object and expose content for frontend
    const content = (lesson as any).contentJson ?? null;
    const titleKm = (lesson as any).titleKm ?? null;
    const titleObj: any = { km: titleKm };

    try {
      if (content && typeof content === 'object') {
        if (content.title && typeof content.title === 'object') {
          if (content.title.en) titleObj.en = content.title.en;
          if (content.title.km) titleObj.km = content.title.km;
        } else {
          if (content.en && (content.en.title || typeof content.en === 'string')) titleObj.en = content.en.title ?? content.en;
          if (content.km && (content.km.title || typeof content.km === 'string')) titleObj.km = content.km.title ?? content.km;
        }
      }
    } catch (e) {
      // ignore
    }

    const normalized = {
      id: lesson.id,
      title: titleObj,
      fallbackTitle: titleObj.km ?? titleObj.en ?? null,
      orderIndex: (lesson as any).orderIndex,
      contentJson: content,
    };

    return {
      success: true,
      data: normalized,
    };
  });
}
``;
