import { FastifyInstance } from 'fastify';
import * as controller from './auth.controller';
import { registerJsonSchema, loginJsonSchema } from '../../validators/auth';

export async function authRoutes(app: FastifyInstance) {
  console.log('✅ Auth routes loaded');

  /* ✅ REGISTER */
  app.post(
    '/auth/register',
    {
      schema: { body: registerJsonSchema },
    },
    controller.register,
  );

  /* ✅ LOGIN */
  app.post(
    '/auth/login',
    {
      schema: { body: loginJsonSchema },
    },
    controller.login,
  );

  /* ✅ GET CURRENT USER */
  app.get('/auth/me', { preHandler: app.authenticate }, controller.me);
}
