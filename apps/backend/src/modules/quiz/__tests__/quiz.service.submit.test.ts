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
      exercise: { findUnique: jest.fn() },
      quizSessionItem: { updateMany: jest.fn() },
      quizSession: { update: jest.fn(), findUnique: jest.fn() },
    };

    mockedPrisma.$transaction.mockImplementation(async (cb: any) => cb(mockTx));

    // session has 0 items for this test
    mockTx.quizSession.findUnique.mockResolvedValue({ id: 'session-1', items: [] });

    const result = await quizService.submitQuiz('session-1', []);

    expect(mockTx.exercise.findUnique).not.toHaveBeenCalled();
    expect(mockTx.quizSessionItem.updateMany).not.toHaveBeenCalled();
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
      { exerciseId: 'e1', selectedChoice: 'A' },
      { exerciseId: 'e2', selectedChoice: 'B' },
    ];

    const mockTx = {
      exercise: { findUnique: jest.fn() },
      quizSessionItem: { updateMany: jest.fn() },
      quizSession: { update: jest.fn(), findUnique: jest.fn() },
    };

    mockTx.exercise.findUnique.mockImplementation(({ where: { id } }: any) => {
      if (id === 'e1') return Promise.resolve({ id: 'e1', correctAnswer: 'A' });
      if (id === 'e2') return Promise.resolve({ id: 'e2', correctAnswer: 'B' });
      return Promise.resolve(null);
    });

    mockedPrisma.$transaction.mockImplementation(async (cb: any) => cb(mockTx));

    // session has 2 items
    mockTx.quizSession.findUnique.mockResolvedValue({ id: 's2', items: [{}, {}] });

    const result = await quizService.submitQuiz('s2', answers as any);

    expect(mockTx.exercise.findUnique).toHaveBeenCalledTimes(2);
    expect(mockTx.quizSessionItem.updateMany).toHaveBeenCalledTimes(2);
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
      { exerciseId: 'e1', selectedChoice: 'A' },
      { exerciseId: 'e2', selectedChoice: 'X' },
    ];

    const mockTx = {
      exercise: { findUnique: jest.fn() },
      quizSessionItem: { updateMany: jest.fn() },
      quizSession: { update: jest.fn(), findUnique: jest.fn() },
    };

    mockTx.exercise.findUnique.mockImplementation(({ where: { id } }: any) => {
      if (id === 'e1') return Promise.resolve({ id: 'e1', correctAnswer: 'A' });
      if (id === 'e2') return Promise.resolve({ id: 'e2', correctAnswer: 'B', questionKm: 'Q2' });
      return Promise.resolve(null);
    });

    mockedPrisma.$transaction.mockImplementation(async (cb: any) => cb(mockTx));

    // session has 2 items
    mockTx.quizSession.findUnique.mockResolvedValue({ id: 's3', items: [{}, {}] });

    const result = await quizService.submitQuiz('s3', answers as any);

    expect(mockTx.exercise.findUnique).toHaveBeenCalledTimes(2);
    expect(mockTx.quizSessionItem.updateMany).toHaveBeenCalledTimes(2);
    expect(mockTx.quizSession.update).toHaveBeenCalled();
    const callArgs3 = mockTx.quizSession.update.mock.calls[0][0];
    expect(callArgs3.where).toEqual({ id: 's3' });
    expect(callArgs3.data.score).toBe(50);
    expect(callArgs3.data.completedAt).toBeDefined();

    expect(result.score).toBe(50);
    expect(result.total).toBe(2);
    expect(result.correct).toBe(1);
    expect(result.wrongAnswers.length).toBe(1);
    expect(result.wrongAnswers[0].question).toBe('Q2');
    // solutionKm should be present (null if exercise doesn't define it)
    expect(result.wrongAnswers[0]).toHaveProperty('solutionKm');
  });

  test('reject submit when session already completed', async () => {
    const mockTx = {
      exercise: { findUnique: jest.fn() },
      quizSessionItem: { updateMany: jest.fn() },
      quizSession: { update: jest.fn(), findUnique: jest.fn() },
    };

    mockedPrisma.$transaction.mockImplementation(async (cb: any) => cb(mockTx));

    // session already completed
    mockTx.quizSession.findUnique.mockResolvedValue({
      id: 'done',
      items: [{}],
      completedAt: new Date(),
    });

    await expect(quizService.submitQuiz('done', [])).rejects.toThrow(
      'Quiz session already completed',
    );
  });
});
