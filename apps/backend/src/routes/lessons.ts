import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../lib/prisma';
import { ensureExists } from '../lib/authHelpers';
import { isValidUuid } from '../lib/validators';

/**
 * Student-safe lesson routes (read-only)
 */
export async function lessonRoutes(app: FastifyInstance) {
  /**
   * Get all published lessons (public)
   */
  app.get('/lessons', async () => {
    const lessons = await prisma.lesson.findMany({
      where: { isPublished: true },
      orderBy: { orderIndex: 'asc' },
      select: { id: true, titleKm: true, orderIndex: true, chapterId: true, contentJson: true },
    });

    const normalized = lessons.map((l) => {
      const content = (l as any).contentJson ?? null;
      const titleKm = (l as any).titleKm ?? null;
      const titleObj: any = { km: titleKm };

      try {
        if (content && typeof content === 'object') {
          if (content.title && typeof content.title === 'object') {
            if (content.title.en) titleObj.en = content.title.en;
            if (content.title.km) titleObj.km = content.title.km;
          } else {
            if (content.en && (content.en.title || typeof content.en === 'string'))
              titleObj.en = content.en.title ?? content.en;
            if (content.km && (content.km.title || typeof content.km === 'string'))
              titleObj.km = content.km.title ?? content.km;
          }
        }
      } catch (e) {
        // ignore
      }

      return {
        id: l.id,
        title: titleObj,
        fallbackTitle: titleObj.km ?? titleObj.en ?? null,
        orderIndex: l.orderIndex,
        chapterId: l.chapterId,
        contentJson: content,
      };
    });

    return { success: true, data: normalized };
  });

  /**
   * Get lessons by chapter (only if chapter is published)
   */
  app.get('/chapters/:chapterId/lessons', async (request: FastifyRequest, reply: FastifyReply) => {
    const { chapterId } = request.params as {
      chapterId: string;
    };

    // Validate chapterId
    if (!isValidUuid(chapterId)) {
      app.log.warn(
        {
          invalidChapterId: chapterId,
          url: request.raw?.url ?? request.url,
          ua: request.headers?.['user-agent'],
        },
        'Invalid chapter id received',
      );
      reply.code(400).send({ success: false, error: 'Invalid chapter id' });
      return;
    }

    // 1️⃣ Check that the chapter exists AND is published
    const chapter = await prisma.chapter.findFirst({
      where: {
        id: chapterId,
        isPublished: true,
      },
    });

    if (!ensureExists(chapter, reply, 'Chapter')) return;

    // 2️⃣ Fetch lessons for the chapter
    const lessons = await prisma.lesson.findMany({
      where: {
        chapterId,
      },
      orderBy: {
        orderIndex: 'asc',
      },
      select: {
        id: true,
        titleKm: true,
        orderIndex: true,
      },
    });

    // Normalize titleKm -> title for frontend
    const normalized = lessons.map((l) => ({
      id: l.id,
      title: (l as any).titleKm ?? null,
      orderIndex: l.orderIndex,
    }));

    return {
      success: true,
      data: normalized,
    };
  });

  /**
   * Get exercises for a lesson (public minimal info)
   */
  app.get('/lessons/:lessonId/exercises', async (request: FastifyRequest, reply: FastifyReply) => {
    const { lessonId } = request.params as { lessonId: string };

    if (!isValidUuid(lessonId)) {
      app.log.warn(
        {
          invalidLessonId: lessonId,
          url: request.raw?.url ?? request.url,
          ua: request.headers?.['user-agent'],
        },
        'Invalid lesson id received',
      );
      reply.code(400).send({ success: false, error: 'Invalid lesson id' });
      return;
    }

    const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } });
    if (!ensureExists(lesson, reply, 'Lesson')) return;

    const exercises = await prisma.exercise.findMany({ where: { lessonId }, select: { id: true } });

    return {
      success: true,
      data: { count: exercises.length, ids: exercises.map((e) => e.id) },
    };
  });
}
