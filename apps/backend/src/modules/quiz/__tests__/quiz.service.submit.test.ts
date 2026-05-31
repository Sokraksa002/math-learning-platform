// Mock prisma before imports
jest.mock('../../../lib/prisma', () => ({
  prisma: {
    $transaction: jest.fn(),
  },
}));

import { prisma } from '../../../lib/prisma';
import * as quizService from '../quiz.service';

const mockedPrisma = prisma as unknown as any;

describe('quiz.service submitQuiz', () => {
  beforeEach(() => jest.clearAllMocks());

  test('no answers -> score 0 and no updates to items', async () => {
    const mockTx = {
      quizSessionItem: { update: jest.fn() },
      quizSession: { update: jest.fn(), findUnique: jest.fn() },
    };

    mockedPrisma.$transaction.mockImplementation(async (cb: any) => cb(mockTx));

    // session has 0 items for this test
    mockTx.quizSession.findUnique.mockResolvedValue({ id: 'session-1', userId: 'user-1', items: [] });

    const result = await quizService.submitQuiz(
      'session-1',
      [],
      'user-1',
      'grade12-complex-lesson1',
    );

    expect(mockTx.quizSessionItem.update).not.toHaveBeenCalled();
    expect(mockTx.quizSession.update).toHaveBeenCalled();

    // Ensure update was called with score and completedAt set
    const updateCallArgs = mockTx.quizSession.update.mock.calls[0][0];
    expect(updateCallArgs.where).toEqual({ id: 'session-1' });
    expect(updateCallArgs.data.score).toBe(0);
    expect(updateCallArgs.data.completedAt).toBeDefined();

    expect(result.score).toBe(0);
    expect(result.total).toBe(0);
    expect(result.correct).toBe(0);
    expect(result.wrongAnswers.length).toBe(0);
  });

  test('all correct answers -> score 100', async () => {
    const answers = [
      { exerciseId: 'd07da1e3-fb38-405f-a1d5-8b65e296341a', selectedChoice: 'A' },
      { exerciseId: 'bd47903d-5bb5-462c-b90b-df7c7a098bd8', selectedChoice: 'B' },
    ];

    const mockTx = {
      quizSessionItem: { update: jest.fn() },
      quizSession: { update: jest.fn(), findUnique: jest.fn() },
    };

    mockedPrisma.$transaction.mockImplementation(async (cb: any) => cb(mockTx));

    // session has 2 items
    mockTx.quizSession.findUnique.mockResolvedValue({
      id: 's2',
      userId: 'user-1',
      items: [
        { id: 'i1', exerciseId: 'd07da1e3-fb38-405f-a1d5-8b65e296341a' },
        { id: 'i2', exerciseId: 'bd47903d-5bb5-462c-b90b-df7c7a098bd8' },
      ],
    });

    const result = await quizService.submitQuiz(
      's2',
      answers as any,
      'user-1',
      'grade12-complex-lesson1',
    );

    expect(mockTx.quizSessionItem.update).toHaveBeenCalledTimes(2);
    expect(mockTx.quizSession.update).toHaveBeenCalled();
    const callArgs2 = mockTx.quizSession.update.mock.calls[0][0];
    expect(callArgs2.where).toEqual({ id: 's2' });
    expect(callArgs2.data.score).toBe(100);
    expect(callArgs2.data.completedAt).toBeDefined();

    expect(result.score).toBe(100);
    expect(result.total).toBe(2);
    expect(result.correct).toBe(2);
    expect(result.wrongAnswers.length).toBe(0);
  });

  test('partial correct answers -> proper score and wrongAnswers', async () => {
    const answers = [
      { exerciseId: 'd07da1e3-fb38-405f-a1d5-8b65e296341a', selectedChoice: 'A' },
      { exerciseId: 'bd47903d-5bb5-462c-b90b-df7c7a098bd8', selectedChoice: 'X' },
    ];

    const mockTx = {
      quizSessionItem: { update: jest.fn() },
      quizSession: { update: jest.fn(), findUnique: jest.fn() },
    };

    mockedPrisma.$transaction.mockImplementation(async (cb: any) => cb(mockTx));

    // session has 2 items
    mockTx.quizSession.findUnique.mockResolvedValue({
      id: 's3',
      userId: 'user-1',
      items: [
        { id: 'i1', exerciseId: 'd07da1e3-fb38-405f-a1d5-8b65e296341a' },
        { id: 'i2', exerciseId: 'bd47903d-5bb5-462c-b90b-df7c7a098bd8' },
      ],
    });

    const result = await quizService.submitQuiz(
      's3',
      answers as any,
      'user-1',
      'grade12-complex-lesson1',
    );

    expect(mockTx.quizSessionItem.update).toHaveBeenCalledTimes(2);
    expect(mockTx.quizSession.update).toHaveBeenCalled();
    const callArgs3 = mockTx.quizSession.update.mock.calls[0][0];
    expect(callArgs3.where).toEqual({ id: 's3' });
    expect(callArgs3.data.score).toBe(50);
    expect(callArgs3.data.completedAt).toBeDefined();

    expect(result.score).toBe(50);
    expect(result.total).toBe(2);
    expect(result.correct).toBe(1);
    expect(result.wrongAnswers.length).toBe(1);
    expect(result.wrongAnswers[0].question).toBeDefined();
    // solutionKm should be present (null if exercise doesn't define it)
    expect(result.wrongAnswers[0]).toHaveProperty('solutionKm');
  });

  test('reject submit when session already completed', async () => {
    const mockTx = {
      quizSessionItem: { update: jest.fn() },
      quizSession: { update: jest.fn(), findUnique: jest.fn() },
    };

    mockedPrisma.$transaction.mockImplementation(async (cb: any) => cb(mockTx));

    // session already completed
    mockTx.quizSession.findUnique.mockResolvedValue({
      id: 'done',
      userId: 'user-1',
      items: [{ id: 'i1', exerciseId: 'd07da1e3-fb38-405f-a1d5-8b65e296341a' }],
      completedAt: new Date(),
    });

    await expect(
      quizService.submitQuiz('done', [], 'user-1', 'grade12-complex-lesson1'),
    ).rejects.toThrow('Already completed');
  });
});
