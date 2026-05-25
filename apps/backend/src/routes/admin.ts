import { FastifyInstance } from 'fastify';

/**
 * Admin-only routes
 */
export async function adminRoutes(app: FastifyInstance) {
  app.get(
    '/admin/test',
    {
      preHandler: app.requireAdmin, // 👑 ADMIN ONLY
    },
    async () => {
      return {
        success: true,
        message: 'Admin access granted',
      };
    },
  );
}
