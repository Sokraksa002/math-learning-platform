import { FastifyInstance } from 'fastify';

import { startQuiz, submitQuiz, getQuizResult } from '../modules/quiz/quiz.service';

import { z } from 'zod';
import {
  startQuizSchema,
  submitQuizSchema,
  getResultParamsSchema,
  startQuizJsonSchema,
  submitQuizJsonSchema,
  getResultParamsJsonSchema,
} from '../validators/quiz';

export async function quizRoutes(fastify: FastifyInstance) {
  /* ✅ START QUIZ */
  fastify.post(
    '/quiz/start',
    {
      preHandler: fastify.authenticate,
      schema: { body: startQuizJsonSchema },
    },
    async (request, reply) => {
      try {
        const { lessonId, count } = request.body as z.infer<typeof startQuizSchema>;

        const userId = request.user.userId;

        /* ✅ NO Prisma check (JSON system) */
        const result = await startQuiz(userId, lessonId, count);

        return result;
      } catch (err: any) {
        reply.code(400).send({
          message: err.message || 'Failed to start quiz',
        });
      }
    },
  );

  /* ✅ SUBMIT QUIZ */
  fastify.post(
    '/quiz/submit',
    {
      preHandler: fastify.authenticate,
      schema: { body: submitQuizJsonSchema },
    },
    async (request, reply) => {
      try {
        const { sessionId, answers } = request.body as z.infer<typeof submitQuizSchema>;

        const result = await submitQuiz(sessionId, answers);

        return result;
      } catch (err: any) {
        reply.code(400).send({
          message: err.message || 'Failed to submit quiz',
        });
      }
    },
  );

  /* ✅ GET RESULT */
  fastify.get(
    '/quiz/result/:id',
    {
      preHandler: fastify.authenticate,
      schema: { params: getResultParamsJsonSchema },
    },
    async (request, reply) => {
      try {
        const { id } = request.params as z.infer<typeof getResultParamsSchema>;

        const result = await getQuizResult(id);

        return result;
      } catch (err: any) {
        reply.code(400).send({
          message: err.message || 'Failed to fetch result',
        });
      }
    },
  );
}
