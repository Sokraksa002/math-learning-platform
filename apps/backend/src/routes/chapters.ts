import { FastifyInstance } from 'fastify';
import { prisma } from '../lib/prisma';

/**
 * Student-safe chapter routes (read-only)
 */
export async function chapterRoutes(app: FastifyInstance) {
  /**
   * Get all published chapters
   */
  app.get('/chapters', async () => {
    const chapters = await prisma.chapter.findMany({
      where: {
        isPublished: true, // ✅ ONLY published chapters
      },
      orderBy: {
        orderIndex: 'asc',
      },
    });

    // Map `titleKm` -> localized title object for frontend
    const normalized = chapters.map((c) => {
      const titleKm = (c as any).titleKm ?? null;
      const titleObj: any = { km: titleKm };
      return {
        id: c.id,
        title: titleObj,
        fallbackTitle: titleKm,
        orderIndex: (c as any).orderIndex,
        isPublished: (c as any).isPublished,
        createdAt: (c as any).createdAt,
      };
    });

    return {
      success: true,
      data: normalized,
    };
  });
}
