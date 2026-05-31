import { FastifyInstance } from 'fastify';
import { readdir, readFile } from 'fs/promises';
import path from 'path';

import { startQuiz, submitQuiz, getQuizResult } from '../modules/quiz/quiz.service';

import { z } from 'zod';
import {
  startQuizSchema,
  submitQuizSchema,
  getResultParamsSchema,
  startQuizJsonSchema,
  submitQuizJsonSchema,
  getResultParamsJsonSchema,
} from '../validators/quiz';

function isLessonLookupError(message: string) {
  return (
    message.startsWith('Lesson file not found') ||
    message.startsWith('Lesson not found in database')
  );
}

export async function quizRoutes(fastify: FastifyInstance) {
  async function walkJsonFiles(dir: string): Promise<string[]> {
    const entries = await readdir(dir, { withFileTypes: true });
    const files: string[] = [];

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        files.push(...(await walkJsonFiles(fullPath)));
      } else if (entry.isFile() && fullPath.endsWith('.json') && !fullPath.endsWith('.bak')) {
        files.push(fullPath);
      }
    }

    return files;
  }

  function parseLessonNumber(lessonId: string) {
    const match = lessonId.match(/lesson(\d+)$/i);
    return match ? Number(match[1]) : null;
  }

  function parseChapterKey(lessonId: string) {
    const match = lessonId.match(/^(?:math-)?(grade\d+-[a-z]+)-lesson\d+/i);
    return match ? match[1] : null;
  }

  function chapterKeyToLessonTitle(chapterKey: string) {
    const mapping: Record<string, string> = {
      'grade12-complex': 'Complex Numbers',
      'grade12-conics': 'Conic Sections',
      'grade12-derivatives': 'Derivatives',
      'grade12-differential': 'Differential Equations',
      'grade12-functions': 'Functions',
      'grade12-integrals': 'Integrals',
      'grade12-limits': 'Limits',
      'grade12-probability': 'Probability',
    };

    return mapping[chapterKey] ?? chapterKey.replace(/^grade\d+-/, '').replace(/-/g, ' ');
  }

  function normalizeLessonLabel(value: string) {
    return value
      .trim()
      .replace(/^grade\d+-[a-z]+-lesson\d+$/i, '')
      .replace(/\s+/g, ' ');
  }

  function buildDisplayTitle(parsed: {
    lessonId?: string;
    lessonTitle?: string;
    titleKm?: string;
    title?: string | { en?: string; km?: string };
  }) {
    const lessonNumber = parsed.lessonId ? parseLessonNumber(parsed.lessonId) : null;
    const chapterKey = parsed.lessonId ? parseChapterKey(parsed.lessonId) : null;

    let titleValue = '';

    if (typeof parsed.title === 'string') {
      titleValue = parsed.title;
    } else if (parsed.title) {
      titleValue = parsed.title.km || parsed.title.en || '';
    }

    const explicitTitle = parsed.lessonTitle || parsed.titleKm || titleValue;

    if (explicitTitle) {
      return normalizeLessonLabel(explicitTitle);
    }

    if (chapterKey && lessonNumber !== null) {
      return `Lesson ${lessonNumber} - ${chapterKeyToLessonTitle(chapterKey)}`;
    }

    return parsed.lessonId || 'Untitled';
  }

  fastify.get('/quiz/lessons', async () => {
    const baseDir = path.join(process.cwd(), 'data', 'exercises');
    const files = await walkJsonFiles(baseDir);

    const lessons = await Promise.all(
      files.map(async (filePath, index) => {
        try {
          const raw = await readFile(filePath, 'utf8');
          const parsed = JSON.parse(raw) as {
            lessonId?: string;
            lessonTitle?: string;
            titleKm?: string;
            title?: string | { en?: string; km?: string };
            exercises?: unknown[];
          };

          const exerciseCount = Array.isArray(parsed.exercises) ? parsed.exercises.length : 0;

          if (!parsed.lessonId || exerciseCount === 0) {
            return null;
          }

          const displayTitle = buildDisplayTitle(parsed);

          const folderName = path.basename(path.dirname(filePath));

          return {
            lessonId: parsed.lessonId,
            title: displayTitle,
            subject: folderName,
            exerciseCount,
            orderIndex: index,
          };
        } catch {
          return null;
        }
      }),
    );

    return {
      success: true,
      data: lessons.filter(Boolean),
    };
  });

  /* ✅ START QUIZ */
  fastify.post(
    '/quiz/start',
    {
      preHandler: fastify.authenticate,
      schema: { body: startQuizJsonSchema },
    },
    async (request, reply) => {
      try {
        const { lessonId, count } = request.body as z.infer<typeof startQuizSchema>;

        const userId = request.user.userId;

        /* ✅ NO Prisma check (JSON system) */
        const result = await startQuiz(userId, lessonId, count);

        return result;
      } catch (err: any) {
        const message = err.message || 'Failed to start quiz';
        let statusCode = 400;

        if (message === 'Unauthorized') {
          statusCode = 401;
        } else if (isLessonLookupError(message)) {
          statusCode = 404;
        }

        reply.code(statusCode).send({
          message,
        });
      }
    },
  );

  /* ✅ SUBMIT QUIZ */
  fastify.post(
    '/quiz/submit',
    {
      preHandler: fastify.authenticate,
      schema: { body: submitQuizJsonSchema },
    },
    async (request, reply) => {
      try {
        const { sessionId, answers, lessonId } = request.body as z.infer<typeof submitQuizSchema>;

        const result = await submitQuiz(sessionId, answers, request.user.userId, lessonId);

        return result;
      } catch (err: any) {
        const message = err.message || 'Failed to submit quiz';
        let statusCode = 400;

        if (message === 'Unauthorized') {
          statusCode = 401;
        } else if (isLessonLookupError(message)) {
          statusCode = 404;
        }

        reply.code(statusCode).send({
          message,
        });
      }
    },
  );

  /* ✅ GET RESULT */
  fastify.get(
    '/quiz/result/:id',
    {
      preHandler: fastify.authenticate,
      schema: { params: getResultParamsJsonSchema },
    },
    async (request, reply) => {
      try {
        const { id } = request.params as z.infer<typeof getResultParamsSchema>;

        const result = await getQuizResult(id);

        return result;
      } catch (err: any) {
        reply.code(400).send({
          message: err.message || 'Failed to fetch result',
        });
      }
    },
  );
}
