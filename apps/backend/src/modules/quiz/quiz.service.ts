import { prisma } from '../../lib/prisma';
import type { Prisma, Exercise } from '@prisma/client';

export class QuizSessionCompletedError extends Error {
  constructor(message?: string) {
    super(message ?? 'Quiz session already completed');
    this.name = 'QuizSessionCompletedError';
  }
}

/**
 * Answer item provided by frontend
 */
export interface AnswerItem {
  exerciseId: string;
  selectedChoice: string;
}

/**
 * ✅ Start Quiz
 * - create session
 * - include exercise details (IMPORTANT ✅)
 */
export async function startQuiz(userId: string, lessonId: string, count?: number) {
  const DEFAULT_MAX = 10;
  const max = typeof count === 'number' && count > 0 ? count : DEFAULT_MAX;

  const exercises = await prisma.exercise.findMany({
    where: { lessonId },
  });

  if (!exercises || exercises.length === 0) {
    throw new Error('No exercises found for the given lesson');
  }

  // ✅ Shuffle
  const shuffled = exercises.slice();
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const selected = shuffled.slice(0, Math.min(max, shuffled.length));

  // ✅ Create session
  const session = await prisma.quizSession.create({
    data: {
      userId,
      lessonId,
      score: 0,
      items: {
        create: selected.map((e: Exercise) => ({
          exerciseId: e.id,
        })),
      },
    },

    // 🔥 IMPORTANT: include exercise data so frontend can display
    include: {
      items: {
        include: {
          exercise: true,
        },
      },
    },
  });

  return session;
}

/**
 * ✅ Submit Quiz
 */
export async function submitQuiz(sessionId: string, answers: AnswerItem[]) {
  let correctCount = 0;
  const wrongAnswers: Array<{
    question?: string;
    correctAnswer?: string;
    selected?: string;
    solutionKm?: string | null;
  }> = [];

  let finalTotal = 0;
  let finalScore = 0;

  await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const session = await tx.quizSession.findUnique({
      where: { id: sessionId },
      include: { items: true },
    });

    if (!session) throw new Error('Quiz session not found');

    if (session.completedAt) {
      throw new QuizSessionCompletedError();
    }

    const total = session.items.length;

    for (const ans of answers) {
      const exercise = await tx.exercise.findUnique({
        where: { id: ans.exerciseId },
      });

      if (!exercise) continue;

      const isCorrect = ans.selectedChoice === exercise.correctAnswer;

      if (isCorrect) {
        correctCount++;
      } else {
        wrongAnswers.push({
          question: exercise.questionKm,
          correctAnswer: exercise.correctAnswer,
          selected: ans.selectedChoice,
          solutionKm: exercise.solutionKm,
        });
      }

      await tx.quizSessionItem.updateMany({
        where: { sessionId, exerciseId: ans.exerciseId },
        data: {
          selectedChoice: ans.selectedChoice,
          isCorrect,
        },
      });
    }

    const score = total === 0 ? 0 : Math.round((correctCount / total) * 100);

    await tx.quizSession.update({
      where: { id: sessionId },
      data: {
        score,
        completedAt: new Date(),
      },
    });

    finalTotal = total;
    finalScore = score;
  });

  return {
    score: finalScore,
    total: finalTotal,
    correct: correctCount,
    wrongAnswers,
  };
}

/**
 * ✅ Get Quiz Result
 */
export async function getQuizResult(sessionId: string) {
  const session = await prisma.quizSession.findUnique({
    where: { id: sessionId },
    include: {
      items: {
        include: {
          exercise: true, // ✅ includes full question info
        },
      },
    },
  });

  if (!session) throw new Error('Quiz session not found');

  return session;
}
