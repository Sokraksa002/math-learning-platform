import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../lib/prisma";
import { ensureExists } from "../lib/authHelpers";

/**
 * Student-safe lesson detail route
 */
export async function lessonDetailRoutes(app: FastifyInstance) {
  /**
   * Get lesson content (only if parent chapter is published)
   */
  app.get(
    "/lessons/:lessonId",
  async (request: FastifyRequest, reply: FastifyReply) => {
      const { lessonId } = request.params as {
        lessonId: string;
      };

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

      if (!ensureExists(lesson, reply, "Lesson")) return;

      return {
        success: true,
        data: lesson,
      };
    }
  );
}
``