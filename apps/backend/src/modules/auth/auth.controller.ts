import type { FastifyReply, FastifyRequest } from 'fastify';
import * as authService from './auth.service';
import { registerSchema, loginSchema } from '../../validators/auth';

/* ✅ REGISTER */
export async function register(req: FastifyRequest, reply: FastifyReply) {
  try {
    const payload = registerSchema.parse(req.body);

    const user = await authService.register(payload);

    const token = await reply.jwtSign({
      userId: user.id,
      role: user.role,
    });

    return reply.code(201).send({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
    });
  } catch (error: any) {
    const message = error?.message || 'Registration failed';
    const statusCode = message === 'Email already exists' ? 409 : 400;

    return reply.code(statusCode).send({
      success: false,
      message,
    });
  }
}

/* ✅ LOGIN */
export async function login(req: FastifyRequest, reply: FastifyReply) {
  try {
    const payload = loginSchema.parse(req.body);

    const user = await authService.login(payload);

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
          name: user.name,
          role: user.role,
        },
      },
    });
  } catch (error: any) {
    const message = error?.message || 'Login failed';
    const statusCode =
      message === 'Invalid credentials' || message === 'User password not set' ? 401 : 400;

    return reply.code(statusCode).send({
      success: false,
      message,
    });
  }
}

/* ✅ CURRENT USER */
export async function me(req: FastifyRequest, reply: FastifyReply) {
  return reply.send({
    success: true,
    user: req.user,
  });
}
