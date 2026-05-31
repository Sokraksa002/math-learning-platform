import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../lib/prisma';
import crypto from 'crypto';

export async function certificateRoutes(app: FastifyInstance) {
  const course = 'Grade 12 Mathematics';

  const requireStudent = (request: FastifyRequest, reply: FastifyReply) => {
    if (request.user?.role !== 'STUDENT') {
      reply.code(403).send({
        success: false,
        message: 'Student access required',
      });
      return false;
    }
    return true;
  };

  const getCertificateProgress = async (userId: string) => {
    /* ✅ GET ALL LESSONS */
    const lessons = await prisma.lesson.findMany({
      where: {
        isPublished: true,
        chapter: { isPublished: true },
      },
      select: {
        id: true,
        titleKm: true,
      },
    });

    const totalLessons = lessons.length;

    /* ✅ COMPLETED LESSONS */
    const completedLessonsData = await prisma.lessonCompletion.findMany({
      where: { userId },
      select: { lessonId: true },
    });

    const completedLessonIds = completedLessonsData.map((l) => l.lessonId);

    /* ✅ QUIZ COMPLETION: use the best score per lesson */
    const quizSessions = await prisma.quizSession.findMany({
      where: {
        userId,
        completedAt: { not: null },
      },
      select: {
        id: true,
        lessonId: true,
        score: true,
        completedAt: true,
        items: {
          select: {
            exerciseId: true,
          },
        },
      },
    });

    const exercises = await prisma.exercise.findMany({
      select: {
        id: true,
        lessonId: true,
      },
    });

    const lessonIdByExerciseId = new Map(
      exercises.map((exercise) => [exercise.id, exercise.lessonId]),
    );

    function resolveLessonIdFromQuizSession(session: {
      lessonId: string;
      items: { exerciseId: string }[];
    }) {
      const inferredLessonIds = new Set(
        session.items
          .map((item) => lessonIdByExerciseId.get(item.exerciseId))
          .filter((lessonId): lessonId is string => Boolean(lessonId)),
      );

      if (inferredLessonIds.size === 1) {
        return [...inferredLessonIds][0];
      }

      return session.lessonId;
    }

    const bestScoreByLesson = new Map<string, number>();

    for (const session of quizSessions) {
      const score = session.score ?? 0;
      const resolvedLessonId = resolveLessonIdFromQuizSession(session);
      const currentBest = bestScoreByLesson.get(resolvedLessonId);

      if (currentBest === undefined || score > currentBest) {
        bestScoreByLesson.set(resolvedLessonId, score);
      }
    }

    /* ✅ UNIQUE COMPLETED QUIZ LESSONS WITH PASSING SCORE */
    const completedSet = new Set(
      [...bestScoreByLesson.entries()]
        .filter(([, score]) => score >= 80)
        .map(([lessonId]) => lessonId),
    );

    const completedLessons = completedLessonIds.length;
    const completedQuizzes = completedSet.size;

    /* ✅ AVERAGE SCORE */
    const passingScores = [...completedSet].map((lessonId) => bestScoreByLesson.get(lessonId) ?? 0);

    const averageScore =
      passingScores.length === 0
        ? 0
        : Math.round(passingScores.reduce((sum, score) => sum + score, 0) / passingScores.length);

    /* ✅ MISSING LESSONS */
    const missingLessons = lessons
      .filter((l) => !completedLessonIds.includes(l.id))
      .map((l) => ({
        lessonId: l.id,
        title: l.titleKm,
      }));

    /* ✅ ✅ ✅ FIXED MISSING QUIZ LOGIC */
    const missingQuizLessons = lessons
      .filter((l) => !completedSet.has(l.id))
      .map((l) => ({
        lessonId: l.id,
        title: l.titleKm,
      }));

    /* ✅ ELIGIBILITY */
    const eligible =
      totalLessons > 0 &&
      completedLessons === totalLessons &&
      completedQuizzes === totalLessons &&
      averageScore >= 80;

    /* ✅ DEBUG (REMOVE LATER) */
    console.log(
      'ALL lessons:',
      lessons.map((l) => l.id),
    );
    console.log('COMPLETED quizzes:', [...completedSet]);
    console.log('MISSING quizzes:', missingQuizLessons);

    return {
      totalLessons,
      completedLessons,
      completedQuizzes,
      averageScore,
      eligible,
      missingLessons,
      missingQuizLessons,
    };
  };

  /* ✅ ELIGIBILITY API */
  app.get(
    '/certificates/eligibility',
    { preHandler: app.authenticate },
    async (request: FastifyRequest, reply: FastifyReply) => {
      if (!requireStudent(request, reply)) return;

      const progress = await getCertificateProgress(request.user.userId);

      const certificate = await prisma.certificate.findUnique({
        where: {
          userId_course: {
            userId: request.user.userId,
            course,
          },
        },
      });

      return {
        success: true,
        data: {
          ...progress,
          certificate,
        },
      };
    },
  );

  /* ✅ GET MY CERTIFICATE */
  app.get(
    '/certificates/me',
    { preHandler: app.authenticate },
    async (request: FastifyRequest, reply: FastifyReply) => {
      if (!requireStudent(request, reply)) return;

      const certificate = await prisma.certificate.findUnique({
        where: {
          userId_course: {
            userId: request.user.userId,
            course,
          },
        },
      });

      return {
        success: true,
        data: certificate,
      };
    },
  );

  /* ✅ ISSUE CERTIFICATE */
  app.post(
    '/certificates/issue',
    { preHandler: app.authenticate },
    async (request: FastifyRequest, reply: FastifyReply) => {
      if (!requireStudent(request, reply)) return;

      const userId = request.user.userId;
      const progress = await getCertificateProgress(userId);

      if (progress.totalLessons === 0) {
        return reply.code(400).send({
          success: false,
          message: 'No published lessons found',
        });
      }

      if (!progress.eligible) {
        return reply.code(400).send({
          success: false,
          message: 'Complete all lessons and quizzes',
          data: progress,
        });
      }

      /* ✅ PREVENT DUPLICATE */
      const existing = await prisma.certificate.findUnique({
        where: {
          userId_course: {
            userId,
            course,
          },
        },
      });

      if (existing) {
        return {
          success: true,
          data: existing,
          message: 'Already issued',
        };
      }

      /* ✅ CREATE CERTIFICATE */
      const certificate = await prisma.certificate.create({
        data: {
          userId,
          course,
          totalLessons: progress.totalLessons,
          averageScore: progress.averageScore,
          certificateCode: crypto.randomUUID(),
        },
      });

      return {
        success: true,
        data: certificate,
      };
    },
  );
}
