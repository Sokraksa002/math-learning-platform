import { FastifyInstance, FastifyRequest } from 'fastify';
import { prisma } from '../lib/prisma';

export async function progressRoutes(app: FastifyInstance) {
  app.get('/progress', { preHandler: app.authenticate }, async (request: FastifyRequest) => {
    const userId = request.user.userId;

    // ✅ Total lessons
    const totalLessons = await prisma.lesson.count({
      where: {
        isPublished: true,
        chapter: {
          isPublished: true,
        },
      },
    });

    // ✅ Completed lessons
    const completedLessons = await prisma.lessonCompletion.count({
      where: {
        userId,
        lesson: {
          isPublished: true,
          chapter: {
            isPublished: true,
          },
        },
      },
    });

    // ✅ Progress %
    const progressPercent =
      totalLessons === 0 ? 0 : Math.round((completedLessons / totalLessons) * 100);

    // ✅ Quiz stats
    const sessions = await prisma.quizSession.findMany({
      where: {
        userId,
        completedAt: { not: null },
      },
      select: {
        score: true,
      },
    });

    const totalQuizzes = sessions.length;

    const averageScore =
      totalQuizzes === 0
        ? 0
        : Math.round(sessions.reduce((sum, s) => sum + (s.score ?? 0), 0) / totalQuizzes);

    return {
      success: true,
      data: {
        totalLessons,
        completedLessons,
        progressPercent,
        totalQuizzes,
        averageScore,
      },
    };
  });
}
