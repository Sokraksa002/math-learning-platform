import { prisma } from "../../lib/prisma";
import type { Prisma } from "@prisma/client";

/**
 * Answer item provided by frontend
 */
export interface AnswerItem {
  exerciseId: string; // id from exercises table
  selectedChoice: string;
}

/**
 * Start a quiz for a lesson:
 * - create a QuizSession
 * - create QuizSessionItems for each exercise in the lesson
 */
export async function startQuiz(userId: string, lessonId: string, count?: number) {
  // Delegate to service logic: select random exercises up to `count` (default handled in service)
  const exercises = await prisma.exercise.findMany({ where: { lessonId } });

  if (!exercises || exercises.length === 0) {
    throw new Error("No exercises found for the given lesson");
  }

  // Shuffle and select
  const DEFAULT_MAX = 10;
  const max = typeof count === "number" && count > 0 ? count : DEFAULT_MAX;

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
      userId,
      lessonId,
      score: 0,
      items: {
        create: selected.map((e) => ({ exerciseId: e.id })),
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
  const wrongAnswers: Array<{ question?: string; correctAnswer?: string; selected?: string }> = [];

  // Use a transaction so updates are atomic
  await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    for (const ans of answers) {
      const exercise = await tx.exercise.findUnique({
        where: { id: ans.exerciseId },
      });

      if (!exercise) {
        // skip unknown exercise
        continue;
      }

      const isCorrect = ans.selectedChoice === (exercise.correctAnswer as string);

      if (isCorrect) {
        correctCount++;
      } else {
        wrongAnswers.push({
          // `question` field doesn't exist on Exercise model — use localized `questionKm` as fallback
          question: exercise.questionKm ?? undefined,
          correctAnswer: exercise.correctAnswer,
          selected: ans.selectedChoice,
        });
      }

      // update the corresponding session item(s)
      await tx.quizSessionItem.updateMany({
        where: {
          sessionId,
          exerciseId: ans.exerciseId,
        },
        data: {
          selectedChoice: ans.selectedChoice,
          isCorrect,
        },
      });
    }

    const total = answers.length;
    const score = total === 0 ? 0 : Math.round((correctCount / total) * 100);

    // update session score
    await tx.quizSession.update({
      where: { id: sessionId },
      data: { score },
    });
  });

  return {
    score: answers.length === 0 ? 0 : Math.round((correctCount / answers.length) * 100),
    total: answers.length,
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
    include: {
      items: {
        include: {
          exercise: true,
        },
      },
    },
  });

  if (!session) {
    throw new Error("Quiz session not found");
  }

  return session;
}