import fs from 'fs';
import path from 'path';
import { prisma } from '../../lib/prisma';

/* ================= TYPES ================= */

export interface AnswerItem {
  exerciseId: string;
  selectedChoice: string;
}

interface JsonExercise {
  id: string;
  question: string;
  choices: string[];
  correctIndex: number;
  explanation: string;
}

interface LessonJson {
  lessonId: string;
  exercises: JsonExercise[];
}

const lessonTitleAliases: Array<{ tokens: string[]; titleKm: string }> = [
  { tokens: ['complex'], titleKm: 'Complex Numbers' },
  { tokens: ['conics'], titleKm: 'Conic Sections' },
  { tokens: ['derivatives'], titleKm: 'Derivatives' },
  { tokens: ['differential'], titleKm: 'Differential Equations' },
  { tokens: ['functions', 'graphs'], titleKm: 'Functions' },
  { tokens: ['integrals'], titleKm: 'Integrals' },
  { tokens: ['limits', 'continuity'], titleKm: 'Limits' },
  { tokens: ['probability'], titleKm: 'Probability' },
];

function resolveLessonTitleFromQuizId(quizLessonId: string): string {
  const normalized = quizLessonId.toLowerCase();

  for (const alias of lessonTitleAliases) {
    if (alias.tokens.some((token) => normalized.includes(token))) {
      return alias.titleKm;
    }
  }

  throw new Error(`Lesson not found in database for ${quizLessonId}`);
}

/* ================= HELPERS ================= */

/* ✅ Read all JSON files */
function walkJsonFiles(dir: string): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...walkJsonFiles(fullPath));
    } else if (entry.isFile() && fullPath.endsWith('.json') && !fullPath.endsWith('.bak')) {
      files.push(fullPath);
    }
  }

  return files;
}

/* ✅ Load JSON lesson */
function loadLessonJson(lessonId: string): LessonJson {
  const baseDir = path.join(process.cwd(), 'data', 'exercises');
  const files = walkJsonFiles(baseDir);

  const normalizedLessonId = lessonId.toLowerCase();

  for (const file of files) {
    const raw = fs.readFileSync(file, 'utf-8');
    const parsed = JSON.parse(raw);

    if (parsed.lessonId && parsed.lessonId.toLowerCase() === normalizedLessonId) {
      return parsed as LessonJson;
    }
  }

  throw new Error(`Lesson file not found for ${lessonId}`);
}

/* ✅ Map quiz lessonId → DB lesson */
export async function getLessonByQuizId(quizLessonId: string) {
  const titleKm = resolveLessonTitleFromQuizId(quizLessonId);

  const lesson = await prisma.lesson.findFirst({
    where: {
      titleKm: {
        contains: titleKm,
        mode: 'insensitive',
      },
    },
    select: {
      id: true,
      titleKm: true,
    },
  });

  if (!lesson) {
    throw new Error(`Lesson not found in database for ${quizLessonId}`);
  }

  return lesson;
}

/* ================= START QUIZ ================= */

export async function startQuiz(userId: string, lessonId: string, count?: number) {
  console.log('START QUIZ:', lessonId);

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) throw new Error('Unauthorized');

  /* ✅ Load JSON */
  const data = loadLessonJson(lessonId);
  const exercises = data.exercises;

  if (!exercises.length) {
    throw new Error('No exercises found');
  }

  /* ✅ Shuffle */
  const shuffled = [...exercises].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, count ?? 10);

  /* ✅ Get DB lesson */
  const realLesson = await getLessonByQuizId(lessonId);

  /* ✅ Create session */
  const session = await prisma.quizSession.create({
    data: {
      userId,
      lessonId: realLesson.id,
    },
  });

  /* ✅ Create session items */
  for (const ex of selected) {
    await prisma.quizSessionItem.create({
      data: {
        sessionId: session.id,
        exerciseId: ex.id,
        selectedChoice: null,
        isCorrect: null,
      },
    });
  }

  /* ✅ Prepare response */
  const items = selected.map((ex) => ({
    exerciseId: ex.id,
    question: ex.question,
    correctAnswer: ['A', 'B', 'C', 'D'][ex.correctIndex],
    solutionKm: ex.explanation,
    choices: {
      A: ex.choices?.[0] ?? '',
      B: ex.choices?.[1] ?? '',
      C: ex.choices?.[2] ?? '',
      D: ex.choices?.[3] ?? '',
    },
  }));

  return {
    sessionId: session.id,
    lessonId,
    lessonTitle: realLesson.titleKm, // ✅ clean title from DB
    items,
  };
}

/* ================= SUBMIT QUIZ ================= */

export async function submitQuiz(
  sessionId: string,
  answers: AnswerItem[],
  userId: string,
  lessonId: string,
) {
  return prisma.$transaction(async (tx) => {
    const session = await tx.quizSession.findUnique({
      where: { id: sessionId },
      include: { items: true },
    });

    if (!session) throw new Error('Session not found');

    if (session.userId !== userId) {
      throw new Error('Unauthorized');
    }

    if (session.completedAt) {
      throw new Error('Already completed');
    }

    const data = loadLessonJson(lessonId);
    const exercises = data.exercises;

    const map = new Map(exercises.map((ex) => [ex.id, ex]));
    let correct = 0;

    const wrongAnswers: {
      question: string;
      correctAnswer: string;
      selected: string;
      solutionKm: string;
    }[] = [];

    for (let i = 0; i < session.items.length; i++) {
      const item = session.items[i];
      const userAnswer = answers[i]; // ✅ FIXED: match by index

      if (!userAnswer) continue;

      const ex = map.get(item.exerciseId);
      if (!ex) continue;

      const correctAnswer = ['A', 'B', 'C', 'D'][ex.correctIndex];

      const isCorrect = userAnswer.selectedChoice === correctAnswer;

      if (isCorrect) {
        correct++;
      } else {
        wrongAnswers.push({
          question: ex.question,
          correctAnswer,
          selected: userAnswer.selectedChoice,
          solutionKm: ex.explanation,
        });
      }

      await tx.quizSessionItem.update({
        where: { id: item.id },
        data: {
          selectedChoice: userAnswer.selectedChoice,
          isCorrect,
        },
      });
    }

    const total = session.items.length;
    const score = total === 0 ? 0 : Math.round((correct / total) * 100);

    await tx.quizSession.update({
      where: { id: session.id },
      data: {
        score,
        completedAt: new Date(),
      },
    });

    return {
      total,
      correct,
      score,
      wrongAnswers,
    };
  });
}

/* ================= RESULT ================= */

export async function getQuizResult(sessionId: string) {
  const session = await prisma.quizSession.findUnique({
    where: { id: sessionId },
  });

  if (!session) throw new Error('Result not found');

  return {
    sessionId,
    score: session.score,
    completedAt: session.completedAt,
  };
}
