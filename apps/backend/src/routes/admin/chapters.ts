import { FastifyInstance, FastifyRequest } from "fastify";
import { prisma } from "../../lib/prisma";

/**
 * Admin-only chapter management
 */
export async function adminChapterRoutes(app: FastifyInstance) {

  /**
   * ✅ Create a new chapter (draft)
   */
  app.post(
    "/admin/chapters",
    {
      preHandler: app.requireAdmin, // 👑 ADMIN ONLY
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
    }
  );

  /**
   * ✅ Publish / unpublish a chapter
   */
  app.patch(
    "/admin/chapters/:id/publish",
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
    }
  );
}