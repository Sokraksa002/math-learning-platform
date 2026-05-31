import Fastify from 'fastify';
import { quizRoutes } from '../quiz';
import { prisma } from '../../lib/prisma';
import authPlugin from '../../plugins/auth';
import createAuthToken from '../../tests/utils/createAuthToken';

// mock prisma
jest.mock('../../lib/prisma', () => ({
  prisma: {
    user: { findUnique: jest.fn() },
    lesson: { findUnique: jest.fn() },
    quizSession: { create: jest.fn(), findUnique: jest.fn() },
    exercise: { findMany: jest.fn() },
  },
}));

const mockedPrisma = prisma as unknown as any;

describe('quiz routes', () => {
  beforeEach(() => jest.clearAllMocks());

  test('POST /quiz/start returns 401 when not authenticated', async () => {
    const app = Fastify();
    // register real auth plugin which will require JWT
    process.env.JWT_SECRET = process.env.JWT_SECRET ?? 'test-secret';
    await app.register(authPlugin);

    app.register(quizRoutes as any);
    await app.ready();

    const res = await app.inject({
      method: 'POST',
      url: '/quiz/start',
      payload: { lessonId: '00000000-0000-0000-0000-000000000000' },
    });
    expect(res.statusCode).toBe(401);

    await app.close();
  });

  test('POST /quiz/start with invalid lesson returns 404', async () => {
    const app = Fastify();
    process.env.JWT_SECRET = process.env.JWT_SECRET ?? 'test-secret';
    await app.register(authPlugin);
    app.register(quizRoutes as any);
    await app.ready();

    // create a signed token with the shared test helper and pass it in Authorization header
    const token = await createAuthToken(app, { userId: 'u1', role: 'STUDENT' });

    mockedPrisma.user.findUnique.mockResolvedValue({ id: 'u1' });
    mockedPrisma.lesson.findUnique.mockResolvedValue(null);
    const res = await app.inject({
      method: 'POST',
      url: '/quiz/start',
      payload: { lessonId: '00000000-0000-0000-0000-000000000000' },
      headers: { authorization: `Bearer ${token}` },
    });
    expect(res.statusCode).toBe(404);

    await app.close();
  });
});
