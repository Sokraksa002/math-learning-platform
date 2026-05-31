// Mock the prisma module before importing anything that uses it
jest.mock('../../../lib/prisma', () => ({
  prisma: {
    user: { findUnique: jest.fn() },
    lesson: { findFirst: jest.fn() },
    quizSession: { create: jest.fn(), findUnique: jest.fn() },
    quizSessionItem: { create: jest.fn() },
    $transaction: jest.fn(),
  },
}));

import * as quizService from '../quiz.service';
import { prisma } from '../../../lib/prisma';

const mockedPrisma = prisma as unknown as any;

describe('quiz.service', () => {
  beforeEach(() => jest.clearAllMocks());

  test('startQuiz selects up to default count', async () => {
    mockedPrisma.user.findUnique.mockResolvedValue({ id: 'u1' });
    mockedPrisma.lesson.findFirst.mockResolvedValue({ id: 'real-lesson-id' });
    mockedPrisma.quizSession.create.mockResolvedValue({ id: 's1' });
    mockedPrisma.quizSessionItem.create.mockResolvedValue({ id: 'item-1' });

    const session = await quizService.startQuiz('u1', 'math-grade12-lesson5-graphs');

    expect(mockedPrisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: 'u1' },
      select: { id: true },
    });
    expect(mockedPrisma.lesson.findFirst).toHaveBeenCalled();
    expect(mockedPrisma.quizSession.create).toHaveBeenCalled();
    expect(session).toBeDefined();
  });
});
