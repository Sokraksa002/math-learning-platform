import { FastifyInstance } from 'fastify';
import { generateFlashcardWithAi } from '../lib/ai/generateFlashcard';

export async function aiDebugRoutes(fastify: FastifyInstance) {
  fastify.post('/debug/ai/generate', async (request, reply) => {
    const body = request.body as any;
    const question = body?.question;
    if (!question || typeof question !== 'string') {
      return reply.code(400).send({ error: 'Missing question string in body' });
    }

    try {
      const res = await generateFlashcardWithAi(question);
      return reply.code(200).send({ success: true, data: res });
    } catch (err: any) {
      request.log.error(err);
      return reply.code(500).send({ success: false, message: err?.message ?? 'AI error' });
    }
  });
}
