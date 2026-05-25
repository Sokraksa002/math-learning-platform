import { FastifyInstance } from 'fastify';
import * as controller from './admin.controller';

export async function adminRoutes(fastify: FastifyInstance) {
  // List lessons with exercise counts
  fastify.get(
    '/admin/lessons',
    { preHandler: [fastify.authenticate, controller.requireAdmin] },
    controller.listLessons as any,
  );

  // Lesson details with exercises
  fastify.get(
    '/admin/lesson/:id',
    {
      preHandler: [fastify.authenticate, controller.requireAdmin],
      schema: {
        params: {
          type: 'object',
          required: ['id'],
          properties: { id: { type: 'string', format: 'uuid' } },
        },
      },
    },
    controller.getLessonDetails as any,
  );

  // Create exercise
  fastify.post(
    '/admin/exercise',
    {
      preHandler: [fastify.authenticate, controller.requireAdmin],
      schema: {
        body: {
          type: 'object',
          required: ['lessonId', 'questionKm', 'solutionKm', 'correctAnswer'],
          properties: {
            lessonId: { type: 'string', format: 'uuid' },
            questionKm: { type: 'string', minLength: 1 },
            solutionKm: { type: 'string', minLength: 1 },
            correctAnswer: { type: 'string', minLength: 1 },
          },
          additionalProperties: false,
        },
      },
    },
    controller.addExercise as any,
  );

  // Move exercise to another lesson
  fastify.patch(
    '/admin/exercise/move',
    {
      preHandler: [fastify.authenticate, controller.requireAdmin],
      schema: {
        body: {
          type: 'object',
          required: ['exerciseId', 'newLessonId'],
          properties: {
            exerciseId: { type: 'string', format: 'uuid' },
            newLessonId: { type: 'string', format: 'uuid' },
          },
          additionalProperties: false,
        },
      },
    },
    controller.moveExerciseHandler as any,
  );

  // Delete exercise
  fastify.delete(
    '/admin/exercise/:id',
    {
      preHandler: [fastify.authenticate, controller.requireAdmin],
      schema: {
        params: {
          type: 'object',
          required: ['id'],
          properties: { id: { type: 'string', format: 'uuid' } },
        },
      },
    },
    controller.deleteExerciseHandler as any,
  );
}
