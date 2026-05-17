import Fastify from 'fastify';
import { prisma } from '../lib/prisma';
import { quizRoutes } from '../routes/quiz';
import { execSync } from 'child_process';
import authPlugin from '../plugins/auth';

// This integration test requires a real DATABASE_URL pointing to a Postgres instance.
// In CI we start a dockerized Postgres service and set DATABASE_URL accordingly.

describe('quiz integration (real DB)', () => {
  let app: ReturnType<typeof Fastify>;
  let userId: string;
  let lessonId: string;
  let exerciseId: string;
  const createdChapterIds: string[] = [];
  const createdLessonIds: string[] = [];
  const createdExerciseIds: string[] = [];

  beforeAll(async () => {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL must be set to run integration tests');
    }

    // push schema to DB (safe for CI/test)
    execSync('npx prisma db push', { stdio: 'inherit' });

    // create minimal data: user, chapter, lesson, exercise
    const user = await prisma.user.upsert({
      where: { email: 'test@example.com' },
      update: { name: 'Test', passwordHash: 'x' },
      create: { email: 'test@example.com', name: 'Test', passwordHash: 'x' },
    });
    userId = user.id;

  const chapter = await prisma.chapter.create({ data: { titleKm: 'Imported', orderIndex: 1 } });
  createdChapterIds.push(chapter.id);
  const lesson = await prisma.lesson.create({ data: { chapterId: chapter.id, titleKm: 'Lesson 1', orderIndex: 1 } });
  lessonId = lesson.id;
  createdLessonIds.push(lesson.id);

  const ex = await prisma.exercise.create({ data: { lessonId: lessonId, questionKm: 'Q1', solutionKm: 'S1', correctAnswer: 'A' } });
  exerciseId = ex.id;
  createdExerciseIds.push(exerciseId);

    app = Fastify();
    process.env.JWT_SECRET = process.env.JWT_SECRET ?? 'test-secret';
    await app.register(authPlugin);
    app.register(quizRoutes as any);
    await app.ready();
  }, 60_000);

  afterAll(async () => {
    try {
      // delete only records created by this test to avoid interfering with other tests
      if (createdExerciseIds.length) {
        await prisma.quizSessionItem.deleteMany({ where: { exerciseId: { in: createdExerciseIds } } });
        await prisma.exercise.deleteMany({ where: { id: { in: createdExerciseIds } } });
      }
      if (createdLessonIds.length) {
        await prisma.quizSession.deleteMany({ where: { lessonId: { in: createdLessonIds } } });
        await prisma.lesson.deleteMany({ where: { id: { in: createdLessonIds } } });
      }
      if (createdChapterIds.length) {
        await prisma.chapter.deleteMany({ where: { id: { in: createdChapterIds } } });
      }
      await prisma.user.deleteMany({ where: { email: 'test@example.com' } });
    } catch (err) {
      // ignore cleanup errors in teardown
      // they can happen in CI if other tests mutate DB
      // but log for debugging
      // eslint-disable-next-line no-console
      console.warn('Integration test teardown error:', err);
    }

    if (app) await app.close();
  });

  test('full quiz flow', async () => {
  // use shared helper to create a signed JWT for the test app
  // import locally to avoid top-level circulars in some test runners
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { default: createAuthToken } = require('../tests/utils/createAuthToken');
  const token = await createAuthToken(app, { userId, role: 'STUDENT' });
  const startRes = await app.inject({ method: 'POST', url: '/quiz/start', payload: { lessonId }, headers: { authorization: `Bearer ${token}` } });
    expect(startRes.statusCode).toBe(200);
    const session = JSON.parse(startRes.payload);
    expect(session).toHaveProperty('id');

    const answers = [{ exerciseId, selectedChoice: 'A' }];
  const submitRes = await app.inject({ method: 'POST', url: '/quiz/submit', payload: { sessionId: session.id, answers }, headers: { authorization: `Bearer ${token}` } });
    expect(submitRes.statusCode).toBe(200);
    const submit = JSON.parse(submitRes.payload);
    expect(submit.score).toBe(100);

  const resultRes = await app.inject({ method: 'GET', url: `/quiz/result/${session.id}`, headers: { authorization: `Bearer ${token}` } });
    expect(resultRes.statusCode).toBe(200);
    const result = JSON.parse(resultRes.payload);
    expect(result).toHaveProperty('items');
  }, 30_000);
});
