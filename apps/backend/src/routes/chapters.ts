import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";

/**
 * Student-safe chapter routes (read-only)
 */
export async function chapterRoutes(app: FastifyInstance) {
  /**
   * Get all published chapters
   */
  app.get("/chapters", async () => {
    const chapters = await prisma.chapter.findMany({
      where: {
        isPublished: true, // ✅ ONLY published chapters
      },
      orderBy: {
        orderIndex: "asc",
      },
    });

    return {
      success: true,
      data: chapters,
    };
  });
}