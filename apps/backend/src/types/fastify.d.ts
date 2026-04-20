import "@fastify/jwt";
import type { FastifyRequest, FastifyReply } from "fastify";

declare module "@fastify/jwt" {
  interface FastifyJWT {
    user: {
      userId: string;
      role: "STUDENT" | "ADMIN";
    };
  }
}

declare module "fastify" {
  interface FastifyInstance {
    /**
     * Authentication guard added by auth plugin
     * Usage: preHandler: app.authenticate
     */
    authenticate(
      request: FastifyRequest,
      reply: FastifyReply
    ): Promise<void>;
  }
}