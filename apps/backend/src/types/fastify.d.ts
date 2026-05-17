import "@fastify/jwt";
import type { FastifyRequest, FastifyReply } from "fastify";

/**
 * Extend JWT payload (request.user)
 */
declare module "@fastify/jwt" {
  interface FastifyJWT {
    user: {
      userId: string;
      role: "STUDENT" | "ADMIN";
    };
  }
}

/**
 * Extend FastifyInstance with decorators
 */
declare module "fastify" {
  interface FastifyInstance {
    /**
     * Authentication guard (any logged‑in user)
     * Usage: preHandler: app.authenticate
     */
    authenticate(
      request: FastifyRequest,
      reply: FastifyReply
    ): Promise<void>;

    /**
     * Admin‑only guard
     * Usage: preHandler: app.requireAdmin
     */
    requireAdmin(
      request: FastifyRequest,
      reply: FastifyReply
    ): Promise<void>;
  }
}