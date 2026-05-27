import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../lib/prisma';

export async function meRoutes(app: FastifyInstance) {
  app.get(
    '/me',
    { preHandler: app.authenticate },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const user = await prisma.user.findUnique({
          where: { id: request.user.userId },
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            createdAt: true,
          },
        });

        if (!user) {
          return reply.code(404).send({
            success: false,
            message: 'User not found',
          });
        }

        return reply.send({
          success: true,
          data: user,
        });
      } catch (error) {
        console.error('[me]', error);
        return reply.code(500).send({
          success: false,
          message: 'Internal server error',
        });
      }
    },
  );
}
