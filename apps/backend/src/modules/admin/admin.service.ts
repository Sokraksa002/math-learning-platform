import { prisma } from '../../lib/prisma';
import type { Exercise } from '@prisma/client';

export type LessonSummary = {
  id: string;
  titleKm: string;
  chapterId: string;
  exerciseCount: number;
};

export async function listLessonsWithExerciseCounts(): Promise<LessonSummary[]> {
  const rows = await prisma.lesson.findMany({
    select: {
      id: true,
      titleKm: true,
      chapterId: true,
      _count: { select: { exercises: true } },
    },
    orderBy: { orderIndex: 'asc' },
  });

  return rows.map((r) => ({
    id: r.id,
    titleKm: r.titleKm,
    chapterId: r.chapterId,
    exerciseCount: r._count.exercises,
  }));
}

export async function getLessonWithExercises(lessonId: string) {
  return prisma.lesson.findUnique({
    where: { id: lessonId },
    include: {
      exercises: {
        select: { id: true, questionKm: true, solutionKm: true, correctAnswer: true, createdAt: true },
        orderBy: { createdAt: 'asc' },
      },
    },
  });
}

export async function createExercise(data: {
  lessonId: string;
  questionKm: string;
  solutionKm: string;
  correctAnswer: string;
}): Promise<Exercise> {
  // ensure lesson exists
  const lesson = await prisma.lesson.findUnique({ where: { id: data.lessonId } });
  if (!lesson) throw new Error('Lesson not found');

  return prisma.exercise.create({ data: {
    lessonId: data.lessonId,
    questionKm: data.questionKm,
    solutionKm: data.solutionKm,
    correctAnswer: data.correctAnswer,
  } });
}

export async function moveExercise(exerciseId: string, newLessonId: string) {
  const exercise = await prisma.exercise.findUnique({ where: { id: exerciseId } });
  if (!exercise) return null;

  const lesson = await prisma.lesson.findUnique({ where: { id: newLessonId } });
  if (!lesson) throw new Error('Target lesson not found');

  return prisma.exercise.update({ where: { id: exerciseId }, data: { lessonId: newLessonId } });
}

export async function deleteExercise(exerciseId: string) {
  const ex = await prisma.exercise.findUnique({ where: { id: exerciseId } });
  if (!ex) return null;
  return prisma.exercise.delete({ where: { id: exerciseId } });
}
