import { FastifyInstance, FastifyRequest } from 'fastify';
import { prisma } from '../../lib/prisma';
import { Prisma } from '../../generated/prisma/client';
import { lessonContentSchema, lessonContentJsonSchema } from '../../lib/contentJson.schema';

/**
 * Admin-only lesson management
 */
export async function adminLessonRoutes(app: FastifyInstance) {
  /**
   * Create a new lesson
   */
  app.post(
    '/admin/lessons',
    {
      preHandler: app.requireAdmin, // 👑 ADMIN ONLY
      schema: {
        body: {
          type: 'object',
          required: ['chapterId', 'titleKm', 'orderIndex', 'contentJson'],
          properties: {
            chapterId: { type: 'string' },
            titleKm: { type: 'string' },
            orderIndex: { type: 'integer' },
            contentJson: lessonContentJsonSchema,
          },
          additionalProperties: false,
        },
      },
    },
    async (request: FastifyRequest) => {
      const { chapterId, titleKm, orderIndex, contentJson } = request.body as {
        chapterId: string;
        titleKm: string;
        orderIndex: number;
        contentJson: Prisma.InputJsonValue;
      };

      // contentJson was validated by Fastify; cast back to the typed schema for DB
      const parsedContent = contentJson as unknown as ReturnType<typeof lessonContentSchema.parse>;

      const lesson = await prisma.lesson.create({
        data: {
          chapterId,
          titleKm,
          orderIndex,
          contentJson: parsedContent,
        },
      });

      return {
        success: true,
        data: lesson,
      };
    },
  );
}
