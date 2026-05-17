// Mock the prisma module before importing anything that uses it
jest.mock('../../../lib/prisma', () => ({
  prisma: {
    exercise: { findMany: jest.fn() },
    quizSession: { create: jest.fn(), findUnique: jest.fn() },
    quizSessionItem: { updateMany: jest.fn() },
    $transaction: jest.fn(),
  },
}));

import * as quizService from '../quiz.service';
import { prisma } from '../../../lib/prisma';

const mockedPrisma = prisma as unknown as any;

describe('quiz.service', () => {
  beforeEach(() => jest.clearAllMocks());

  test('startQuiz selects up to default count', async () => {
    const exercises = Array.from({ length: 5 }).map((_, i) => ({ id: `e${i}`, lessonId: 'l1' }));
    mockedPrisma.exercise.findMany.mockResolvedValue(exercises);
    mockedPrisma.quizSession.create.mockResolvedValue({ id: 's1', items: [] });

    const session = await quizService.startQuiz('u1', 'l1');

    expect(mockedPrisma.exercise.findMany).toHaveBeenCalledWith({ where: { lessonId: 'l1' } });
    expect(mockedPrisma.quizSession.create).toHaveBeenCalled();
    expect(session).toBeDefined();
  });
});
