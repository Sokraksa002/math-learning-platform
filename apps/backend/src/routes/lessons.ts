import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../lib/prisma';
import { ensureExists } from '../lib/authHelpers';
import { isValidUuid } from '../lib/validators';

/**
 * ✅ PUBLIC LESSON ROUTES (Guest-safe)
 */
export async function lessonRoutes(app: FastifyInstance) {
  /**
   * ✅ GET ALL LESSONS (PUBLIC)
   * Used by frontend Lesson page
   */
  app.get('/lessons', async () => {
    const lessons = await prisma.lesson.findMany({
      where: {
        isPublished: true, // ✅ only visible content
        chapter: {
          isPublished: true, // ✅ ensure chapter also visible
        },
      },
      orderBy: {
        orderIndex: 'asc',
      },
      select: {
        id: true,
        titleKm: true,
        orderIndex: true,
        chapterId: true,
        contentJson: true,
      },
    });

    // ✅ Normalize for frontend
    const normalized = lessons.map((l) => {
      const content = (l as any).contentJson ?? null;
      const titleKm = l.titleKm ?? null;

      const titleObj: { en?: string; km?: string } = {
        km: titleKm ?? undefined,
      };

      try {
        if (content && typeof content === 'object') {
          if (content.title && typeof content.title === 'object') {
            if (content.title.en) titleObj.en = content.title.en;
            if (content.title.km) titleObj.km = content.title.km;
          } else {
            if (content.en && (content.en.title || typeof content.en === 'string')) {
              titleObj.en = content.en.title ?? content.en;
            }

            if (content.km && (content.km.title || typeof content.km === 'string')) {
              titleObj.km = content.km.title ?? content.km;
            }
          }
        }
      } catch {
        // ignore parsing errors
      }

      return {
        id: l.id,
        title: titleObj,
        // also expose `titleKm` for older frontends expecting a top-level `titleKm` field
        titleKm: titleObj.km ?? undefined,
        fallbackTitle: titleObj.km ?? titleObj.en ?? 'Untitled',
        orderIndex: l.orderIndex,
        chapterId: l.chapterId, // ✅ IMPORTANT FOR FRONTEND GROUPING
        contentJson: content,
      };
    });

    return {
      success: true,
      data: normalized,
    };
  });

  /**
   * ✅ GET LESSONS BY CHAPTER
   */
  app.get('/chapters/:chapterId/lessons', async (request: FastifyRequest, reply: FastifyReply) => {
    const { chapterId } = request.params as { chapterId: string };

    if (!isValidUuid(chapterId)) {
      reply.code(400).send({
        success: false,
        error: 'Invalid chapter id',
      });
      return;
    }

    // ✅ ensure chapter exists and published
    const chapter = await prisma.chapter.findFirst({
      where: {
        id: chapterId,
        isPublished: true,
      },
    });

    if (!ensureExists(chapter, reply, 'Chapter')) return;

    const lessons = await prisma.lesson.findMany({
      where: {
        chapterId,
        isPublished: true,
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

    const normalized = lessons.map((l) => ({
      id: l.id,
      title: l.titleKm || 'Untitled',
      orderIndex: l.orderIndex,
    }));

    return {
      success: true,
      data: normalized,
    };
  });

  /**
   * ✅ GET LESSON EXERCISE COUNT
   */
  app.get('/lessons/:lessonId/exercises', async (request: FastifyRequest, reply: FastifyReply) => {
    const { lessonId } = request.params as { lessonId: string };

    if (!isValidUuid(lessonId)) {
      reply.code(400).send({
        success: false,
        error: 'Invalid lesson id',
      });
      return;
    }

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
    });

    if (!ensureExists(lesson, reply, 'Lesson')) return;

    const exercises = await prisma.exercise.findMany({
      where: { lessonId },
      select: { id: true },
    });

    return {
      success: true,
      data: {
        count: exercises.length,
        ids: exercises.map((e) => e.id),
      },
    };
  });
}
