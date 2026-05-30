import { FastifyInstance } from 'fastify';
import { prisma } from '../lib/prisma';

export async function lessonExercisesRoutes(app: FastifyInstance) {
  app.get('/lesson-exercises/:lessonId', async (request) => {
    const { lessonId } = request.params as { lessonId: string };

    const count = await prisma.exercise.count({
      where: {
        lessonId,
      },
    });

    return {
      success: true,
      data: { count },
    };
  });
}
