import Fastify from 'fastify';
import authPlugin from '../../../plugins/auth';
import createAuthToken from '../../../tests/utils/createAuthToken';
import { adminRoutes } from '../admin.routes';

import * as prismaModule from '../../../lib/prisma';

describe('Admin routes', () => {
  beforeEach(() => jest.clearAllMocks());

  test('GET /admin/lessons returns summaries for admin', async () => {
    const app = Fastify();
    process.env.JWT_SECRET = process.env.JWT_SECRET ?? 'test-secret';
    await app.register(authPlugin as any);
    app.register(adminRoutes as any);
    await app.ready();

    const token = await createAuthToken(app, { userId: 'admin-1', role: 'ADMIN' });

    const rows = [
      {
        id: '00000000-0000-0000-0000-000000000001',
        titleKm: 'មេរៀន 1',
        chapterId: 'c1',
        _count: { exercises: 3 },
      },
      {
        id: '00000000-0000-0000-0000-000000000002',
        titleKm: 'មេរៀន 2',
        chapterId: 'c1',
        _count: { exercises: 0 },
      },
    ];

    jest.spyOn(prismaModule.prisma.lesson, 'findMany').mockResolvedValue(rows as any);

    const res = await app.inject({
      method: 'GET',
      url: '/admin/lessons',
      headers: { authorization: `Bearer ${token}` },
    });
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.payload);
    expect(body.success).toBe(true);
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data[0]).toMatchObject({
      id: '00000000-0000-0000-0000-000000000001',
      exerciseCount: 3,
    });

    await app.close();
  });

  test('GET /admin/lessons forbidden for non-admin', async () => {
    const app = Fastify();
    process.env.JWT_SECRET = process.env.JWT_SECRET ?? 'test-secret';
    await app.register(authPlugin as any);
    app.register(adminRoutes as any);
    await app.ready();

    const token = await createAuthToken(app, { userId: 'user-1', role: 'STUDENT' });

    const res = await app.inject({
      method: 'GET',
      url: '/admin/lessons',
      headers: { authorization: `Bearer ${token}` },
    });
    expect(res.statusCode).toBe(403);
    const body = JSON.parse(res.payload);
    expect(body).toHaveProperty('error');
    expect(body.error.code).toBe('FORBIDDEN');

    await app.close();
  });

  test('GET /admin/lesson/:id returns lesson details', async () => {
    const app = Fastify();
    process.env.JWT_SECRET = process.env.JWT_SECRET ?? 'test-secret';
    await app.register(authPlugin as any);
    app.register(adminRoutes as any);
    await app.ready();

    const token = await createAuthToken(app, { userId: 'admin-2', role: 'ADMIN' });

    const lesson = {
      id: '00000000-0000-0000-0000-000000000010',
      titleKm: 'Lesson 1',
      chapterId: 'c1',
      exercises: [
        {
          id: '00000000-0000-0000-0000-00000000e001',
          questionKm: 'Q1',
          solutionKm: 'S1',
          correctAnswer: 'A',
        },
      ],
    };

    jest.spyOn(prismaModule.prisma.lesson, 'findUnique').mockResolvedValue(lesson as any);

    const res = await app.inject({
      method: 'GET',
      url: '/admin/lesson/00000000-0000-0000-0000-000000000010',
      headers: { authorization: `Bearer ${token}` },
    });
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.payload);
    expect(body.success).toBe(true);
    expect(body.data).toHaveProperty('exercises');

    await app.close();
  });

  test('POST /admin/exercise creates exercise', async () => {
    const app = Fastify();
    process.env.JWT_SECRET = process.env.JWT_SECRET ?? 'test-secret';
    await app.register(authPlugin as any);
    app.register(adminRoutes as any);
    await app.ready();

    const token = await createAuthToken(app, { userId: 'admin-3', role: 'ADMIN' });

    jest
      .spyOn(prismaModule.prisma.lesson, 'findUnique')
      .mockResolvedValue({ id: '00000000-0000-0000-0000-000000000010' } as any);

    const created = {
      id: '00000000-0000-0000-0000-00000000e002',
      lessonId: '00000000-0000-0000-0000-000000000010',
      questionKm: 'Q',
      solutionKm: 'S',
      correctAnswer: 'A',
    };
    jest.spyOn(prismaModule.prisma.exercise, 'create').mockResolvedValue(created as any);

    const res = await app.inject({
      method: 'POST',
      url: '/admin/exercise',
      headers: { authorization: `Bearer ${token}` },
      payload: {
        lessonId: '00000000-0000-0000-0000-000000000010',
        questionKm: 'Q',
        solutionKm: 'S',
        correctAnswer: 'A',
      },
    });
    expect(res.statusCode).toBe(201);
    const body = JSON.parse(res.payload);
    expect(body.success).toBe(true);
    expect(body.data).toHaveProperty('id', '00000000-0000-0000-0000-00000000e002');

    await app.close();
  });

  test('PATCH /admin/exercise/move moves exercise', async () => {
    const app = Fastify();
    process.env.JWT_SECRET = process.env.JWT_SECRET ?? 'test-secret';
    await app.register(authPlugin as any);
    app.register(adminRoutes as any);
    await app.ready();

    const token = await createAuthToken(app, { userId: 'admin-4', role: 'ADMIN' });

    jest.spyOn(prismaModule.prisma.exercise, 'findUnique').mockResolvedValue({
      id: '00000000-0000-0000-0000-00000000e003',
      lessonId: '00000000-0000-0000-0000-000000000020',
    } as any);
    jest
      .spyOn(prismaModule.prisma.lesson, 'findUnique')
      .mockResolvedValue({ id: '00000000-0000-0000-0000-000000000021' } as any);
    jest.spyOn(prismaModule.prisma.exercise, 'update').mockResolvedValue({
      id: '00000000-0000-0000-0000-00000000e003',
      lessonId: '00000000-0000-0000-0000-000000000021',
    } as any);

    const res = await app.inject({
      method: 'PATCH',
      url: '/admin/exercise/move',
      headers: { authorization: `Bearer ${token}` },
      payload: {
        exerciseId: '00000000-0000-0000-0000-00000000e003',
        newLessonId: '00000000-0000-0000-0000-000000000021',
      },
    });
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.payload);
    expect(body.success).toBe(true);
    expect(body.data).toHaveProperty('lessonId', '00000000-0000-0000-0000-000000000021');

    await app.close();
  });

  test('PATCH /admin/exercise/move returns 404 when target lesson not found', async () => {
    const app = Fastify();
    process.env.JWT_SECRET = process.env.JWT_SECRET ?? 'test-secret';
    await app.register(authPlugin as any);
    app.register(adminRoutes as any);
    await app.ready();

    const token = await createAuthToken(app, { userId: 'admin-5', role: 'ADMIN' });

    jest.spyOn(prismaModule.prisma.exercise, 'findUnique').mockResolvedValue({
      id: '00000000-0000-0000-0000-00000000e004',
      lessonId: '00000000-0000-0000-0000-000000000030',
    } as any);
    jest.spyOn(prismaModule.prisma.lesson, 'findUnique').mockResolvedValue(null);

    const res = await app.inject({
      method: 'PATCH',
      url: '/admin/exercise/move',
      headers: { authorization: `Bearer ${token}` },
      payload: {
        exerciseId: '00000000-0000-0000-0000-00000000e004',
        newLessonId: '00000000-0000-0000-0000-000000000099',
      },
    });
    expect(res.statusCode).toBe(404);
    const body = JSON.parse(res.payload);
    expect(body).toHaveProperty('error');
    expect(body.error.code).toBe('NOT_FOUND');

    await app.close();
  });

  test('DELETE /admin/exercise/:id deletes exercise', async () => {
    const app = Fastify();
    process.env.JWT_SECRET = process.env.JWT_SECRET ?? 'test-secret';
    await app.register(authPlugin as any);
    app.register(adminRoutes as any);
    await app.ready();

    const token = await createAuthToken(app, { userId: 'admin-6', role: 'ADMIN' });

    jest
      .spyOn(prismaModule.prisma.exercise, 'findUnique')
      .mockResolvedValue({ id: '00000000-0000-0000-0000-00000000e005' } as any);
    jest
      .spyOn(prismaModule.prisma.exercise, 'delete')
      .mockResolvedValue({ id: '00000000-0000-0000-0000-00000000e005' } as any);

    const res = await app.inject({
      method: 'DELETE',
      url: '/admin/exercise/00000000-0000-0000-0000-00000000e005',
      headers: { authorization: `Bearer ${token}` },
    });
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.payload);
    expect(body.success).toBe(true);
    expect(body.data).toHaveProperty('id', '00000000-0000-0000-0000-00000000e005');

    await app.close();
  });
});
