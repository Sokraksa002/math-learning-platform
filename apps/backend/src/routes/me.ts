// Who am I according to the server?”

// This is useful for:

// front‑end profile page
// checking login persistence
// debugging JWT

import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";

/**
 * Protected route to get current user info
 */
export async function meRoutes(app: FastifyInstance) {
  app.get(
    "/me",
    {
      preHandler: app.authenticate, // 🔐 JWT REQUIRED
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      return reply.send({
        success: true,
        data: {
          userId: request.user.userId,
          role: request.user.role,
        },
      });
    }
  );
}
``