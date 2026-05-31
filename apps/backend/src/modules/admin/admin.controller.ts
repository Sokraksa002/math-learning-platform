import { FastifyRequest, FastifyReply } from 'fastify';
import * as service from './admin.service';

type UserToken = { id?: string; userId?: string; role?: string };

function getUserFromRequest(request: FastifyRequest): UserToken {
  return request.user as unknown as UserToken;
}

export async function requireAdmin(request: FastifyRequest, reply: FastifyReply) {
  const user = getUserFromRequest(request);
  if (user.role !== 'ADMIN') {
    return reply.code(403).send({ error: { code: 'FORBIDDEN', message: 'Admin access required' } });
  }
}

export async function listLessons(request: FastifyRequest, reply: FastifyReply) {
  try {
    const data = await service.listLessonsWithExerciseCounts();
    return reply.send({ success: true, data });
  } catch (err: unknown) {
    request.log.error(err);
    return reply
      .code(500)
      .send({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } });
  }
}

export async function getLessonDetails(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };
  try {
    const lesson = await service.getLessonWithExercises(id);
    if (!lesson)
      return reply.code(404).send({ error: { code: 'NOT_FOUND', message: 'Lesson not found' } });
    return reply.send({ success: true, data: lesson });
  } catch (err: unknown) {
    request.log.error(err);
    return reply
      .code(500)
      .send({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } });
  }
}

export async function addExercise(request: FastifyRequest, reply: FastifyReply) {
  const body = request.body as {
    lessonId: string;
    questionKm: string;
    solutionKm: string;
    correctAnswer: string;
  };
  try {
    const created = await service.createExercise(body);
    return reply.code(201).send({ success: true, data: created });
  } catch (err: any) {
    request.log.error(err);
    if ((err as Error).message === 'Lesson not found') {
      return reply.code(404).send({ error: { code: 'NOT_FOUND', message: 'Lesson not found' } });
    }
    return reply
      .code(500)
      .send({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } });
  }
}

export async function moveExerciseHandler(request: FastifyRequest, reply: FastifyReply) {
  const body = request.body as { exerciseId: string; newLessonId: string };
  try {
    const updated = await service.moveExercise(body.exerciseId, body.newLessonId);
    if (!updated)
      return reply.code(404).send({ error: { code: 'NOT_FOUND', message: 'Exercise not found' } });
    return reply.send({ success: true, data: updated });
  } catch (err: any) {
    request.log.error(err);
    if ((err as Error).message === 'Target lesson not found') {
      return reply
        .code(404)
        .send({ error: { code: 'NOT_FOUND', message: 'Target lesson not found' } });
    }
    return reply
      .code(500)
      .send({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } });
  }
}

export async function deleteExerciseHandler(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };
  try {
    const removed = await service.deleteExercise(id);
    if (!removed)
      return reply.code(404).send({ error: { code: 'NOT_FOUND', message: 'Exercise not found' } });
    return reply.send({ success: true, data: removed });
  } catch (err: unknown) {
    request.log.error(err);
    return reply
      .code(500)
      .send({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } });
  }
}

export async function listUsers(request: FastifyRequest, reply: FastifyReply) {
  try {
    const data = await service.listUsers();
    return reply.send({ success: true, data });
  } catch (err: unknown) {
    request.log.error(err);
    return reply.code(500).send({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } });
  }
}

export async function addUser(request: FastifyRequest, reply: FastifyReply) {
  const body = request.body as {
    email: string;
    name: string;
    role: 'ADMIN' | 'STUDENT';
    password: string;
  };

  try {
    const created = await service.createUser(body);
    return reply.code(201).send({ success: true, data: created });
  } catch (err: any) {
    request.log.error(err);
    if (err?.code === 'P2002') {
      return reply.code(409).send({ error: { code: 'CONFLICT', message: 'Email already exists' } });
    }
    return reply.code(500).send({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } });
  }
}

export async function updateUserHandler(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };
  const body = request.body as {
    email: string;
    name: string;
    role: 'ADMIN' | 'STUDENT';
    isBanned: boolean;
  };

  try {
    const updated = await service.updateUser(id, body);
    return reply.send({ success: true, data: updated });
  } catch (err: any) {
    request.log.error(err);
    if (err?.code === 'P2025') {
      return reply.code(404).send({ error: { code: 'NOT_FOUND', message: 'User not found' } });
    }
    if (err?.code === 'P2002') {
      return reply.code(409).send({ error: { code: 'CONFLICT', message: 'Email already exists' } });
    }
    return reply.code(500).send({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } });
  }
}

export async function deleteUserHandler(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };

  try {
    const removed = await service.deleteUser(id);
    if (!removed) {
      return reply.code(404).send({ error: { code: 'NOT_FOUND', message: 'User not found' } });
    }

    return reply.send({ success: true, data: removed });
  } catch (err: unknown) {
    request.log.error(err);
    return reply.code(500).send({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } });
  }
}
