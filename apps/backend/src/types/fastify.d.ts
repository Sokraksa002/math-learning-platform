import '@fastify/jwt';
import type { FastifyRequest, FastifyReply } from 'fastify';

// ================= AUTH USER TYPE =================
type AuthUser = {
  userId: string;
  role: 'STUDENT' | 'ADMIN';
};

// ================= JWT TYPES =================
declare module '@fastify/jwt' {
  interface FastifyJWT {
    /**
     * Data stored inside JWT token
     * (when you call reply.jwtSign)
     */
    payload: AuthUser;

    /**
     * Data available after request.jwtVerify()
     */
    user: AuthUser;
  }
}

// ================= FASTIFY DECORATORS =================
declare module 'fastify' {
  interface FastifyInstance {
    /**
     * ✅ Protect route (logged-in users only)
     * Example:
     * preHandler: app.authenticate
     */
    authenticate(request: FastifyRequest, reply: FastifyReply): Promise<void>;

    /**
     * ✅ Admin-only route protection
     * Example:
     * preHandler: app.requireAdmin
     */
    requireAdmin(request: FastifyRequest, reply: FastifyReply): Promise<void>;
  }
}
