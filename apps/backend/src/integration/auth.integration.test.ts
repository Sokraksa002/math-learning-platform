import Fastify from 'fastify';
import { prisma } from '../lib/prisma';
import { execSync } from 'child_process';

describe('auth integration (real DB)', () => {
  let app: ReturnType<typeof Fastify>;
  const createdEmails: string[] = [];

  beforeAll(async () => {
    if (!process.env.DATABASE_URL)
      throw new Error('DATABASE_URL must be set to run integration tests');
    execSync('npx prisma db push', { stdio: 'inherit' });

    app = Fastify();
    process.env.JWT_SECRET = process.env.JWT_SECRET ?? 'test-secret';

    // register auth plugin and routes lazily to mirror other integration tests
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const authPlugin = require('../plugins/auth').default;
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const authRoutes = require('../routes/auth').default || require('../routes/auth').authRoutes;
    await app.register(authPlugin);
    app.register(authRoutes as any);
    await app.ready();
  }, 30_000);

  afterAll(async () => {
    try {
      for (const email of createdEmails) {
        const user = await prisma.user.findUnique({ where: { email } });
        if (user) {
          const sessions = await prisma.quizSession.findMany({
            where: { userId: user.id },
            select: { id: true },
          });
          if (sessions.length) {
            const sessionIds = sessions.map((s) => s.id);
            await prisma.quizSessionItem.deleteMany({ where: { sessionId: { in: sessionIds } } });
            await prisma.quizSession.deleteMany({ where: { id: { in: sessionIds } } });
          }
        }
        await prisma.user.deleteMany({ where: { email } });
      }
    } catch (err) {
      // ignore teardown errors
    }
    if (app) await app.close();
  });

  test('register creates a user', async () => {
    const email = 'integration-register@example.com';
    const payload = { email, name: 'Integration Register', password: 'password123' };

    const res = await app.inject({ method: 'POST', url: '/register', payload });
    expect([200, 201]).toContain(res.statusCode);

    const dbUser = await prisma.user.findUnique({ where: { email } });
    expect(dbUser).not.toBeNull();
    createdEmails.push(email);
  }, 30_000);

  test('login returns a token for registered user and rejects wrong password', async () => {
    const email = 'integration-login@example.com';
    const password = 'login-pass-123';
    const registerPayload = { email, name: 'Integration Login', password };

    // register first
    const regRes = await app.inject({ method: 'POST', url: '/register', payload: registerPayload });
    expect([200, 201]).toContain(regRes.statusCode);
    createdEmails.push(email);

    // successful login
    const loginRes = await app.inject({
      method: 'POST',
      url: '/login',
      payload: { email, password },
    });
    expect(loginRes.statusCode).toBe(200);
    const body = JSON.parse(loginRes.payload);
    const token = body?.data?.token ?? body.token ?? body.accessToken ?? body.jwt;
    expect(typeof token).toBe('string');

    // wrong password should fail
    const badRes = await app.inject({
      method: 'POST',
      url: '/login',
      payload: { email, password: 'wrong' },
    });
    expect([401, 400]).toContain(badRes.statusCode);
  }, 30_000);

  test('duplicate registration returns 409', async () => {
    const email = 'integration-dup@example.com';
    const payload = { email, name: 'Dup', password: 'dup-pass' };

    const first = await app.inject({ method: 'POST', url: '/register', payload });
    expect([200, 201]).toContain(first.statusCode);
    createdEmails.push(email);

    const second = await app.inject({ method: 'POST', url: '/register', payload });
    expect(second.statusCode).toBe(409);
  }, 30_000);

  // Invalid payload tests
  test('invalid registration payloads return 400 - missing fields', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/register',
      payload: { email: 'missingfields@example.com' },
    });
    expect(res.statusCode).toBe(400);
  }, 10_000);

  test('invalid registration payloads return 400 - bad email / short password', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/register',
      payload: { email: 'not-an-email', name: 'Bad', password: '1' },
    });
    expect(res.statusCode).toBe(400);
  }, 10_000);
});
