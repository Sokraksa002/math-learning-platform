import type { FastifyReply, FastifyRequest } from "fastify";
import * as authService from "./auth.service";

export async function register(
  req: FastifyRequest,
  reply: FastifyReply
) {
  const user = await authService.register(req.body as any);

  return reply.code(201).send(user);
}

export async function login(
  req: FastifyRequest,
  reply: FastifyReply
) {
  const user = await authService.login(req.body as any);

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