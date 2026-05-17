import { FastifyInstance, FastifyRequest } from "fastify";
import { prisma } from "../lib/prisma";

/**
 * Student progress dashboard
 */
export async function progressRoutes(app: FastifyInstance) {
  /**
   * Get progress summary for the logged-in student
   */
  app.get(
    "/progress",
    {
      preHandler: app.authenticate, // ✅ student must be logged in
    },
    async (request: FastifyRequest) => {
      const userId = request.user.userId;

      // 1️⃣ Count total published lessons
      const totalLessons = await prisma.lesson.count({
        where: {
          chapter: {
            isPublished: true,
          },
        },
      });

      // 2️⃣ Count completed lessons by this user
      const completedLessons = await prisma.lessonCompletion.count({
        where: {
          userId,
          lesson: {
            chapter: {
              isPublished: true,
            },
          },
        },
      });

      // 3️⃣ Calculate progress percentage
      const progressPercent =
        totalLessons === 0
          ? 0
          : Math.round((completedLessons / totalLessons) * 100);

      return {
        success: true,
        data: {
          totalLessons,
          completedLessons,
          progressPercent,
        },
      };
    }
  );
}