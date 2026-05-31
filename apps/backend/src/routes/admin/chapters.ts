import { FastifyInstance, FastifyRequest } from 'fastify';
import { prisma } from '../../lib/prisma';
import { requireAdmin } from '../../modules/admin/admin.controller';

/**
 * Admin-only chapter management
 */
export async function adminChapterRoutes(app: FastifyInstance) {
  /**
   * List all chapters for admin management
   */
  app.get(
    '/admin/chapters',
    {
      preHandler: [app.authenticate, requireAdmin],
    },
    async () => {
      const chapters = await prisma.chapter.findMany({
        orderBy: { orderIndex: 'asc' },
      });

      const normalized = chapters.map((chapter) => {
        const titleKm = (chapter as any).titleKm ?? null;
        return {
          id: chapter.id,
          title: { km: titleKm },
          fallbackTitle: titleKm,
          orderIndex: (chapter as any).orderIndex,
          isPublished: (chapter as any).isPublished,
          createdAt: (chapter as any).createdAt,
        };
      });

      return { success: true, data: normalized };
    },
  );

  /**
   * ✅ Create a new chapter (draft)
   */
  app.post(
    '/admin/chapters',
    {
      preHandler: [app.authenticate, requireAdmin], // 👑 ADMIN ONLY
    },
    async (request: FastifyRequest) => {
      const { titleKm, orderIndex } = request.body as {
        titleKm: string;
        orderIndex: number;
      };

      const chapter = await prisma.chapter.create({
        data: {
          titleKm,
          orderIndex,
        },
      });

      return {
        success: true,
        data: chapter,
      };
    },
  );

  /**
   * ✅ Publish / unpublish a chapter
   */
  app.patch(
    '/admin/chapters/:id/publish',
    {
      preHandler: app.requireAdmin, // 👑 ADMIN ONLY
    },
    async (request: FastifyRequest) => {
      const { id } = request.params as { id: string };
      const { isPublished } = request.body as { isPublished: boolean };

      const chapter = await prisma.chapter.update({
        where: { id },
        data: { isPublished },
      });

      return {
        success: true,
        data: chapter,
      };
    },
  );
}
