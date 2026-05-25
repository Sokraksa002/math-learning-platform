import type { FastifyReply, FastifyRequest } from "fastify";
import * as authService from "./auth.service";
import { registerSchema, loginSchema } from "../../validators/auth";

export async function register(
  req: FastifyRequest,
  reply: FastifyReply
) {
  // Fastify has already validated the request body using the route schema
  const payload = req.body as unknown as ReturnType<typeof registerSchema.parse>;
  const user = await authService.register(payload as any);

  return reply.code(201).send(user);
}

export async function login(
  req: FastifyRequest,
  reply: FastifyReply
) {
  const payload = req.body as unknown as ReturnType<typeof loginSchema.parse>;
  const user = await authService.login(payload as any);

  const token = await reply.jwtSign({
    id: user.id,
  });

  return reply.send({
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
  });
}

export async function me(
  req: FastifyRequest,
  reply: FastifyReply
) {
  return reply.send(req.user);
}