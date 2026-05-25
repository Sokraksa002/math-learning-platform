import cors from '@fastify/cors';
import { FastifyInstance } from 'fastify';

/**
 * CORS plugin
 * Allows frontend to communicate with backend
 */
export async function corsPlugin(app: FastifyInstance) {
  await app.register(cors, {
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  });
}
