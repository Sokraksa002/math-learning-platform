// src/plugins/auth.ts
import fp from "fastify-plugin";
import jwt from "@fastify/jwt";
import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";

async function authPlugin(app: FastifyInstance) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  await app.register(jwt, {
    secret: process.env.JWT_SECRET,
    sign: {
      expiresIn: "7d",
    },
  });

  app.decorate(
    "authenticate",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        await request.jwtVerify();
      } catch {
        reply.code(401).send({
          success: false,
          message: "Unauthorized",
        });
      }
    }
  );
}

// ✅ THIS is what makes decorators reliable
export default fp(authPlugin);