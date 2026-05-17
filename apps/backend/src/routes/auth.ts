import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import * as bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";
import { registerSchema, loginSchema, registerJsonSchema, loginJsonSchema } from "../validators/auth";

/**
 * Authentication routes
 * Prefix: /api/auth
 */
export async function authRoutes(app: FastifyInstance) {
  /**
   * POST /api/auth/register
   * Create a new user (NO JWT here)
   */
  app.post(
    "/register",
    { schema: { body: registerJsonSchema } },
    async (request: FastifyRequest, reply: FastifyReply) => {
      // Fastify has already validated `request.body` against registerJsonSchema
      const { email, name, password } = request.body as { email: string; name: string; password: string };

      try {
        const existingUser = await prisma.user.findUnique({
          where: { email },
        });

        if (existingUser) {
          return reply.code(409).send({
            success: false,
            message: "Email already exists",
          });
        }

        const passwordHash = await bcrypt.hash(password, 12);

        const user = await prisma.user.create({
          data: {
            email,
            name,
            passwordHash,
          },
        });

        return reply.code(201).send({
          success: true,
          data: {
            user: {
              id: user.id,
              email: user.email,
              role: user.role,
              createdAt: user.createdAt,
            },
          },
          message: "Registration successful",
        });
      } catch (error) {
        console.error("[auth/register]", error);
        return reply.code(500).send({
          success: false,
          message: "Internal server error",
        });
      }
    }
  );

  /**
   * POST /api/auth/login
   * Authenticate user and ISSUE JWT
   */
  app.post(
    "/login",
    { schema: { body: loginJsonSchema } },
    async (request: FastifyRequest, reply: FastifyReply) => {
      // Fastify has already validated `request.body` against loginJsonSchema
      const { email, password } = request.body as { email: string; password: string };

      try {
        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          return reply.code(401).send({
            success: false,
            message: "Invalid email or password",
          });
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
          return reply.code(401).send({
            success: false,
            message: "Invalid email or password",
          });
        }

        // ✅ JWT SIGNING (plugin must be registered before routes)
        const token = await reply.jwtSign({
          userId: user.id,
          role: user.role,
        });

        return reply.send({
          success: true,
          data: {
            token,
            user: {
              id: user.id,
              email: user.email,
              role: user.role,
            },
          },
          message: "Login successful",
        });
      } catch (error) {
        console.error("[auth/login]", error);
        return reply.code(500).send({
          success: false,
          message: "Internal server error",
        });
      }
    }
  );
}