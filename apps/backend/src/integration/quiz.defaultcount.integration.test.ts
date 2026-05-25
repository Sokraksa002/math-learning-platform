import Fastify from 'fastify';
import { prisma } from '../lib/prisma';
import { execSync } from 'child_process';

describe('quiz start default count (real DB)', () => {
  let app: ReturnType<typeof Fastify>;
  let token: string;
  let createdUserId: string | undefined;
  const createdChapterIds: string[] = [];
  const createdLessonIds: string[] = [];
  const createdExerciseIds: string[] = [];

  beforeAll(async () => {
    if (!process.env.DATABASE_URL)
      throw new Error('DATABASE_URL must be set to run integration tests');
    execSync('npx prisma db push', { stdio: 'inherit' });

    // create minimal data and app
    const user = await prisma.user.upsert({
      where: { email: 'defaultcount@example.com' },
      update: { name: 'DefaultCount' },
      create: { email: 'defaultcount@example.com', name: 'DefaultCount', passwordHash: 'x' },
    });
    createdUserId = user.id;

    app = Fastify();
    process.env.JWT_SECRET = process.env.JWT_SECRET ?? 'test-secret';
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
        await prisma.quizSessionItem.deleteMany({
          where: { exerciseId: { in: createdExerciseIds } },
        });
        await prisma.exercise.deleteMany({ where: { id: { in: createdExerciseIds } } });
      }
      if (createdLessonIds.length) {
        // remove quiz sessions tied to these lessons to avoid FK constraint when deleting users
        const sessions = await prisma.quizSession.findMany({
          where: { lessonId: { in: createdLessonIds } },
          select: { id: true },
        });
        if (sessions.length) {
          const sessionIds = sessions.map((s) => s.id);
          await prisma.quizSessionItem.deleteMany({ where: { sessionId: { in: sessionIds } } });
        }
        await prisma.quizSession.deleteMany({ where: { lessonId: { in: createdLessonIds } } });
        await prisma.lesson.deleteMany({ where: { id: { in: createdLessonIds } } });
      }
      if (createdChapterIds.length) {
        await prisma.chapter.deleteMany({ where: { id: { in: createdChapterIds } } });
      }

      // delete any quiz sessions for the created test user to avoid FK constraint
      if (createdUserId) {
        const userSessions = await prisma.quizSession.findMany({
          where: { userId: createdUserId },
          select: { id: true },
        });
        if (userSessions.length) {
          const sessionIds = userSessions.map((s) => s.id);
          await prisma.quizSessionItem.deleteMany({ where: { sessionId: { in: sessionIds } } });
          await prisma.quizSession.deleteMany({ where: { id: { in: sessionIds } } });
        }
      }

      await prisma.user.deleteMany({ where: { email: 'defaultcount@example.com' } });
    } catch (err) {
      // ignore cleanup errors
    }
    if (app) await app.close();
  });

  test('starting a quiz without count defaults to 10 items', async () => {
    const chapter = await prisma.chapter.create({
      data: { titleKm: 'Default Count Chap', orderIndex: 1000 },
    });
    createdChapterIds.push(chapter.id);
    const lesson = await prisma.lesson.create({
      data: { chapterId: chapter.id, titleKm: 'Default Count Lesson', orderIndex: 1000 },
    });
    createdLessonIds.push(lesson.id);

    // create 15 exercises so that selection of 10 is possible
    for (let i = 0; i < 15; i++) {
      const ex = await prisma.exercise.create({
        data: { lessonId: lesson.id, questionKm: `Q${i}`, solutionKm: `S${i}`, correctAnswer: 'A' },
      });
      createdExerciseIds.push(ex.id);
    }

    const startRes = await app.inject({
      method: 'POST',
      url: '/quiz/start',
      payload: { lessonId: lesson.id },
      headers: { authorization: `Bearer ${token}` },
    });
    expect(startRes.statusCode).toBe(200);
    const session = JSON.parse(startRes.payload);
    // session.items should be an array of length 10
    expect(session).toHaveProperty('items');
    expect(Array.isArray(session.items)).toBe(true);
    expect(session.items.length).toBe(10);
    // ensure exerciseIds are unique (no duplicates)
    const exerciseIds = session.items.map((it: any) => it.exerciseId);
    const uniqueIds = Array.from(new Set(exerciseIds));
    expect(uniqueIds.length).toBe(exerciseIds.length);
  }, 30_000);
});
