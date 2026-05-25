import { FastifyInstance } from 'fastify';
import { prisma } from '../lib/prisma';
import {
  startQuiz,
  submitQuiz,
  getQuizResult,
  QuizSessionCompletedError,
} from '../modules/quiz/quiz.service';
import { z } from 'zod';
import {
  startQuizSchema,
  submitQuizSchema,
  getResultParamsSchema,
  startQuizJsonSchema,
  submitQuizJsonSchema,
  getResultParamsJsonSchema,
} from '../validators/quiz';
import { ensureExists, ensureExistsAndOwned } from '../lib/authHelpers';

export async function quizRoutes(fastify: FastifyInstance) {
  // Start Quiz - authenticated
  fastify.post(
    '/quiz/start',
    { preHandler: fastify.authenticate, schema: { body: startQuizJsonSchema } },
    async (request, reply) => {
      const { lessonId, count } = request.body as unknown as z.infer<typeof startQuizSchema>;
      const userId = request.user.userId;

      // validate lesson exists
      const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } });
      if (!ensureExists(lesson, reply, 'Lesson')) return;

      const result = await startQuiz(userId, lessonId, count);
      return result;
    },
  );

  // Submit Quiz - authenticated; ensure session belongs to user
  fastify.post(
    '/quiz/submit',
    { preHandler: fastify.authenticate, schema: { body: submitQuizJsonSchema } },
    async (request, reply) => {
      const { sessionId, answers } = request.body as unknown as z.infer<typeof submitQuizSchema>;
      const userId = request.user.userId;

      // validate session ownership
      const session = await prisma.quizSession.findUnique({ where: { id: sessionId } });
      if (!ensureExistsAndOwned(session, userId, reply, 'Quiz session')) return;

      try {
        const result = await submitQuiz(sessionId, answers);
        return result;
      } catch (err: any) {
        if (err instanceof QuizSessionCompletedError) {
          reply
            .code(409)
            .send({ code: 'QUIZ_COMPLETED', message: 'Quiz session already completed' });
          return;
        }
        throw err;
      }
    },
  );

  // Get Result - authenticated; ensure session belongs to user
  fastify.get(
    '/quiz/result/:id',
    { preHandler: fastify.authenticate, schema: { params: getResultParamsJsonSchema } },
    async (request, reply) => {
      const { id } = request.params as unknown as z.infer<typeof getResultParamsSchema>;
      const userId = request.user.userId;

      const session = await prisma.quizSession.findUnique({ where: { id } });
      if (!ensureExistsAndOwned(session, userId, reply, 'Quiz session')) return;

      const result = await getQuizResult(id);
      return result;
    },
  );
}
