import { FastifyInstance } from 'fastify';
import * as controller from './auth.controller';
import { registerJsonSchema, loginJsonSchema } from '../../validators/auth';

export async function authRoutes(app: FastifyInstance) {
  app.post('/auth/register', { schema: { body: registerJsonSchema } }, controller.register);
  app.post('/auth/login', { schema: { body: loginJsonSchema } }, controller.login);
  app.get('/auth/me', { preHandler: app.authenticate }, controller.me);
}
