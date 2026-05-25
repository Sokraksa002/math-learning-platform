import Fastify from 'fastify';
import authPlugin from '../../../plugins/auth';
import createAuthToken from '../../../tests/utils/createAuthToken';
import { flashcardRoutes } from '../flashcard.routes';

import * as aiModule from '../../../lib/ai/generateFlashcard';
import * as prismaModule from '../../../lib/prisma';

describe('POST /flashcard/generate', () => {
  beforeEach(() => jest.clearAllMocks());

  test('creates flashcard and returns it (200)', async () => {
    const app = Fastify();
    process.env.JWT_SECRET = process.env.JWT_SECRET ?? 'test-secret';
    await app.register(authPlugin as any);
    app.register(flashcardRoutes as any);
    await app.ready();

    const token = await createAuthToken(app, { userId: 'user-1', role: 'STUDENT' });

    const aiResult = { question: 'សំណួរ', answer: 'ចម្លើយ', steps: ['ជំហាន 1'] };
    jest.spyOn(aiModule, 'generateFlashcardWithAi').mockResolvedValue(aiResult);

    const created = {
      id: 'fb1',
      userId: 'user-1',
      chapterId: 'ch1',
      questionKm: aiResult.question,
      answerJson: aiResult,
      isUserGenerated: true,
      createdAt: new Date().toISOString(),
    };

    jest.spyOn(prismaModule.prisma.flashcard, 'create').mockResolvedValue(created as any);

    const res = await app.inject({
      method: 'POST',
      url: '/flashcard/generate',
      payload: { chapterId: '00000000-0000-0000-0000-000000000000', question: 'បង្ហាញដំណោះស្រាយ' },
      headers: { authorization: `Bearer ${token}` },
    });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.payload);
    expect(body).toMatchObject({ id: 'fb1', userId: 'user-1', chapterId: 'ch1' });

    await app.close();
  });

  test('returns 429 when AI rate-limited', async () => {
    const app = Fastify();
    process.env.JWT_SECRET = process.env.JWT_SECRET ?? 'test-secret';
    await app.register(authPlugin as any);
    app.register(flashcardRoutes as any);
    await app.ready();

    const token = await createAuthToken(app, { userId: 'user-2', role: 'STUDENT' });

    jest
      .spyOn(aiModule, 'generateFlashcardWithAi')
      .mockRejectedValue(new aiModule.AiRateLimitError('rate limit'));

    const res = await app.inject({
      method: 'POST',
      url: '/flashcard/generate',
      payload: { chapterId: '00000000-0000-0000-0000-000000000000', question: 'Question 1' },
      headers: { authorization: `Bearer ${token}` },
    });

    expect(res.statusCode).toBe(429);
    const body = JSON.parse(res.payload);
    expect(body).toHaveProperty('error');
    expect(body.error.code).toBe('RATE_LIMIT');

    await app.close();
  });

  test('returns 422 on AI parse error', async () => {
    const app = Fastify();
    process.env.JWT_SECRET = process.env.JWT_SECRET ?? 'test-secret';
    await app.register(authPlugin as any);
    app.register(flashcardRoutes as any);
    await app.ready();

    const token = await createAuthToken(app, { userId: 'user-3', role: 'STUDENT' });

    jest
      .spyOn(aiModule, 'generateFlashcardWithAi')
      .mockRejectedValue(new aiModule.AiParseError('invalid json', '{bad}'));

    const res = await app.inject({
      method: 'POST',
      url: '/flashcard/generate',
      payload: { chapterId: '00000000-0000-0000-0000-000000000000', question: 'Question 1' },
      headers: { authorization: `Bearer ${token}` },
    });

    expect(res.statusCode).toBe(422);
    const body = JSON.parse(res.payload);
    expect(body.error.code).toBe('AI_PARSE_ERROR');

    await app.close();
  });

  test('returns 502 when AI provider fails', async () => {
    const app = Fastify();
    process.env.JWT_SECRET = process.env.JWT_SECRET ?? 'test-secret';
    await app.register(authPlugin as any);
    app.register(flashcardRoutes as any);
    await app.ready();

    const token = await createAuthToken(app, { userId: 'user-4', role: 'STUDENT' });

    jest
      .spyOn(aiModule, 'generateFlashcardWithAi')
      .mockRejectedValue(new aiModule.AiProviderError('provider error'));

    const res = await app.inject({
      method: 'POST',
      url: '/flashcard/generate',
      payload: { chapterId: '00000000-0000-0000-0000-000000000000', question: 'Question 1' },
      headers: { authorization: `Bearer ${token}` },
    });

    expect(res.statusCode).toBe(502);
    const body = JSON.parse(res.payload);
    expect(body.error.code).toBe('AI_UNAVAILABLE');

    await app.close();
  });

  test('requires authentication (401)', async () => {
    const app = Fastify();
    // register routes but do not register auth plugin
    app.register(flashcardRoutes as any);
    await app.ready();

    const res = await app.inject({
      method: 'POST',
      url: '/flashcard/generate',
      payload: { chapterId: '00000000-0000-0000-0000-000000000000', question: 'Question 1' },
    });
    expect(res.statusCode).toBe(401);

    await app.close();
  });
});
