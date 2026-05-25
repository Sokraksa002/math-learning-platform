// src/plugins/auth.ts
import fp from "fastify-plugin";
import jwt from "@fastify/jwt";
import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";

async function authPlugin(app: FastifyInstance) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  // ✅ Register JWT plugin (await is REQUIRED)
  await app.register(jwt, {
    secret: process.env.JWT_SECRET,
    sign: {
      expiresIn: "7d",
    },
  });

  /**
   * 🔐 Auth guard: any logged‑in user
   */
  app.decorate(
    "authenticate",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        await request.jwtVerify();
      } catch {
        return reply.code(401).send({
          success: false,
          message: "Unauthorized",
        });
      }
    }
  );

  /**
   * 👑 Admin‑only guard
   */
  app.decorate(
    "requireAdmin",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        await request.jwtVerify();

        if (request.user.role !== "ADMIN") {
          return reply.code(403).send({
            success: false,
            message: "Admin access required",
          });
        }
      } catch {
        return reply.code(401).send({
          success: false,
          message: "Unauthorized",
        });
      }
    }
  );
}

// ✅ fastify‑plugin guarantees decorators exist before routes
export default fp(authPlugin);