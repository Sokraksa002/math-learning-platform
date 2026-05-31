import { FastifyInstance } from 'fastify';
import * as controller from './admin.controller';

export async function adminRoutes(fastify: FastifyInstance) {
  // List users
  fastify.get(
    '/admin/users',
    { preHandler: [fastify.authenticate, controller.requireAdmin] },
    controller.listUsers as any,
  );

  // Create user
  fastify.post(
    '/admin/users',
    {
      preHandler: [fastify.authenticate, controller.requireAdmin],
      schema: {
        body: {
          type: 'object',
          required: ['email', 'name', 'role', 'password'],
          properties: {
            email: { type: 'string', format: 'email' },
            name: { type: 'string', minLength: 1 },
            role: { type: 'string', enum: ['ADMIN', 'STUDENT'] },
            password: { type: 'string', minLength: 6 },
          },
          additionalProperties: false,
        },
      },
    },
    controller.addUser as any,
  );

  // Update user
  fastify.patch(
    '/admin/users/:id',
    {
      preHandler: [fastify.authenticate, controller.requireAdmin],
      schema: {
        params: {
          type: 'object',
          required: ['id'],
          properties: { id: { type: 'string', format: 'uuid' } },
        },
        body: {
          type: 'object',
          required: ['email', 'name', 'role', 'isBanned'],
          properties: {
            email: { type: 'string', format: 'email' },
            name: { type: 'string', minLength: 1 },
            role: { type: 'string', enum: ['ADMIN', 'STUDENT'] },
            isBanned: { type: 'boolean' },
          },
          additionalProperties: false,
        },
      },
    },
    controller.updateUserHandler as any,
  );

  // Delete user
  fastify.delete(
    '/admin/users/:id',
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
    controller.deleteUserHandler as any,
  );

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
