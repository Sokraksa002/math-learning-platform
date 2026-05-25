import Fastify from 'fastify';
import { prisma } from '../lib/prisma';
import { execSync } from 'child_process';

describe('quiz re-submit integration (real DB)', () => {
  let app: ReturnType<typeof Fastify>;
  let token: string;
  const createdChapterIds: string[] = [];
  const createdLessonIds: string[] = [];
  const createdExerciseIds: string[] = [];

  beforeAll(async () => {
    if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL must be set to run integration tests');
    execSync('npx prisma db push', { stdio: 'inherit' });

  // create minimal data and app
  const user = await prisma.user.upsert({ where: { email: 'resubmit@example.com' }, update: { name: 'Resubmit' }, create: { email: 'resubmit@example.com', name: 'Resubmit', passwordHash: 'x' } });

    app = Fastify();
    process.env.JWT_SECRET = process.env.JWT_SECRET ?? 'test-secret';
    // register auth plugin and routes lazily to mirror other integration tests
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const authPlugin = require('../plugins/auth').default;
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const quizRoutes = require('../routes/quiz').quizRoutes;
    await app.register(authPlugin);
    app.register(quizRoutes as any);
    await app.ready();

    // create a token
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { default: createAuthToken } = require('../tests/utils/createAuthToken');
    token = await createAuthToken(app, { userId: user.id, role: 'STUDENT' });
  }, 30_000);

  afterAll(async () => {
    try {
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
      await prisma.user.deleteMany({ where: { email: 'resubmit@example.com' } });
    } catch (err) {
      // ignore teardown errors
    }
    if (app) await app.close();
  });

  test('re-submitting a completed quiz returns 409', async () => {
    const chapter = await prisma.chapter.create({ data: { titleKm: 'Resubmit chap', orderIndex: 999 } });
    createdChapterIds.push(chapter.id);
    const lesson = await prisma.lesson.create({ data: { chapterId: chapter.id, titleKm: 'Resubmit lesson', orderIndex: 999 } });
    createdLessonIds.push(lesson.id);
    const exercise = await prisma.exercise.create({ data: { lessonId: lesson.id, questionKm: 'Q', solutionKm: 'S', correctAnswer: 'A' } });
    createdExerciseIds.push(exercise.id);

    const startRes = await app.inject({ method: 'POST', url: '/quiz/start', payload: { lessonId: lesson.id }, headers: { authorization: `Bearer ${token}` } });
    expect(startRes.statusCode).toBe(200);
    const session = JSON.parse(startRes.payload);

    const answers = [{ exerciseId: exercise.id, selectedChoice: 'A' }];
    const submitRes = await app.inject({ method: 'POST', url: '/quiz/submit', payload: { sessionId: session.id, answers }, headers: { authorization: `Bearer ${token}` } });
    expect(submitRes.statusCode).toBe(200);

    // second submit should be rejected with 409
    const res2 = await app.inject({ method: 'POST', url: '/quiz/submit', payload: { sessionId: session.id, answers }, headers: { authorization: `Bearer ${token}` } });
    expect(res2.statusCode).toBe(409);
  const body = JSON.parse(res2.payload);
  expect(body).toHaveProperty('code', 'QUIZ_COMPLETED');
  expect(body).toHaveProperty('message', 'Quiz session already completed');
  }, 30_000);
});
