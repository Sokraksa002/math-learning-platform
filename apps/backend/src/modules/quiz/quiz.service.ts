import { prisma } from "../../lib/prisma";
import type { Prisma, Exercise } from "@prisma/client";

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
 * Start a quiz for a lesson:
 * - create a QuizSession
 * - create QuizSessionItems for each exercise in the lesson
 */
export async function startQuiz(userId: string, lessonId: string, count?: number) {
  // Default: limit to 10 questions when not specified.
  const DEFAULT_MAX = 10;
  const max = typeof count === "number" && count > 0 ? count : DEFAULT_MAX;

  const exercises = await prisma.exercise.findMany({ where: { lessonId } });

  if (!exercises || exercises.length === 0) {
    throw new Error("No exercises found for the given lesson");
  }

  // Shuffle exercises using Fisher-Yates and take up to `max` items
  const shuffled = exercises.slice();
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = shuffled[i];
    shuffled[i] = shuffled[j];
    shuffled[j] = tmp;
  }

  const selected = shuffled.slice(0, Math.min(max, shuffled.length));

  const session = await prisma.quizSession.create({
    data: {
      // Debug: log userId and lessonId to diagnose FK issues in integration tests
      // (temporary - will be removed once root cause is identified)
      userId,
      lessonId,
      score: 0,
      items: {
        create: selected.map((e: Exercise) => ({ exerciseId: e.id })),
      },
    },
    include: { items: true },
  });

  return session;
}

/**
 * Submit quiz answers and calculate score
 */
export async function submitQuiz(sessionId: string, answers: AnswerItem[]) {
  let correctCount = 0;
  const wrongAnswers: Array<{ question?: string; correctAnswer?: string; selected?: string; solutionKm?: string | null }> = [];
  let finalTotal = 0;
  let finalScore = 0;

  await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
  // Load session to know the total number of items (unanswered count as incorrect)
  const session = (await tx.quizSession.findUnique({ where: { id: sessionId }, include: { items: true } })) as Prisma.QuizSessionGetPayload<{ include: { items: true } }> | null;
  if (!session) throw new Error('Quiz session not found');

    // Prevent re-submission if already completed
    if (session.completedAt) {
      throw new QuizSessionCompletedError('Quiz session already completed');
    }

    const sessionTotal = session?.items?.length ?? 0;

    for (const ans of answers) {
      const exercise = await tx.exercise.findUnique({ where: { id: ans.exerciseId } });
      if (!exercise) continue;

      const isCorrect = ans.selectedChoice === (exercise.correctAnswer as string);
      if (isCorrect) correctCount++;
      else {
        wrongAnswers.push({
          // `question` field doesn't exist on Exercise model — use localized `questionKm` as fallback
          question: exercise.questionKm ?? undefined,
          correctAnswer: exercise.correctAnswer,
          selected: ans.selectedChoice,
          solutionKm: exercise.solutionKm ?? null,
        });
      }

      await tx.quizSessionItem.updateMany({
        where: { sessionId, exerciseId: ans.exerciseId },
        data: { selectedChoice: ans.selectedChoice, isCorrect },
      });
    }

    // Compute score relative to total session items (unanswered are incorrect)
    const total = sessionTotal;
  const score = total === 0 ? 0 : Math.round((correctCount / total) * 100);
    const completedAt = new Date();
    await tx.quizSession.update({ where: { id: sessionId }, data: { score, completedAt } });

    // capture for returning after transaction
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
 * Get quiz result including items and exercise details
 */
export async function getQuizResult(sessionId: string) {
  const session = await prisma.quizSession.findUnique({
    where: { id: sessionId },
    include: { items: { include: { exercise: true } } },
  });

  if (!session) throw new Error("Quiz session not found");
  return session;
}