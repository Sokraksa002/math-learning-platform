import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../lib/prisma';
import { ensureExists } from '../lib/authHelpers';

/**
 * Student-safe lesson routes (read-only)
 */
export async function lessonRoutes(app: FastifyInstance) {
  /**
   * Get lessons by chapter (only if chapter is published)
   */
  app.get('/chapters/:chapterId/lessons', async (request: FastifyRequest, reply: FastifyReply) => {
    const { chapterId } = request.params as {
      chapterId: string;
    };

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

    return {
      success: true,
      data: lessons,
    };
  });
}
