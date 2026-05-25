import { FastifyInstance, FastifyRequest } from 'fastify';
import { prisma } from '../lib/prisma';
import crypto from 'crypto';

/**
 * Certificate routes
 */
export async function certificateRoutes(app: FastifyInstance) {
  /**
   * Issue certificate if student completed course
   */
  app.post(
    '/certificates/issue',
    {
      preHandler: app.authenticate, // ✅ student must be logged in
    },
    async (request: FastifyRequest) => {
      const userId = request.user.userId;
      const course = 'Grade 12 Mathematics';

      // 1️⃣ Count total published lessons
      const totalLessons = await prisma.lesson.count({
        where: {
          chapter: {
            isPublished: true,
          },
        },
      });

      // 2️⃣ Count completed lessons
      const completedLessons = await prisma.lessonCompletion.count({
        where: {
          userId,
          lesson: {
            chapter: {
              isPublished: true,
            },
          },
        },
      });

      if (totalLessons === 0) {
        return {
          success: false,
          message: 'No published lessons found',
        };
      }

      if (completedLessons < totalLessons) {
        return {
          success: false,
          message: 'Course not fully completed',
        };
      }

      // 3️⃣ Prevent duplicate certificates
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
          message: 'Certificate already issued',
        };
      }

      // 4️⃣ Issue certificate
      const certificate = await prisma.certificate.create({
        data: {
          userId,
          course,
          totalLessons,
          averageScore: 0, // 🔜 later from quizzes
          certificateCode: crypto.randomUUID(),
        },
      });

      return {
        success: true,
        data: certificate,
        message: 'Certificate issued successfully',
      };
    },
  );
}
