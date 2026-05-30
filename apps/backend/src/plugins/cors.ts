import cors from '@fastify/cors';
import { FastifyInstance } from 'fastify';

/**
 * CORS plugin
 * Allows frontend to communicate with backend
 */
export async function corsPlugin(app: FastifyInstance) {
  const isDev = process.env.NODE_ENV !== 'production';

  // In development allow all origins to simplify local testing (Vite ports vary).
  // In production use the configured CLIENT_URL or default to the production host.
  const originOption: any = isDev ? true : process.env.CLIENT_URL || 'http://localhost:5173';

  await app.register(cors, {
    origin: originOption,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  });
}
