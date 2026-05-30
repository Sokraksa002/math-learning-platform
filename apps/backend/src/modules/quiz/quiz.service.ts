import fs from 'fs';
import path from 'path';

/* ✅ ERROR CLASS */
export class QuizSessionCompletedError extends Error {
  constructor(message?: string) {
    super(message ?? 'Quiz session already completed');
    this.name = 'QuizSessionCompletedError';
  }
}

/* ✅ ANSWER TYPE */
export interface AnswerItem {
  exerciseId: string;
  selectedChoice: string;
}

/* ✅ JSON TYPES */
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

/* ✅ ✅ ✅ LOAD JSON (FIXED PATH 🔥) */
function loadLessonJson(lessonId: string): LessonJson {
  const parts = lessonId.split('-');

  if (parts.length < 3) {
    throw new Error('Invalid lessonId format');
  }

  const folder = `${parts[0]}-${parts[1]}`;
  const lessonFile = parts[2];

  const filePath = path.join(
    process.cwd(),
    'data/exercises', // ✅ ✅ FIXED HERE
    folder,
    `${lessonFile}.json`,
  );

  if (!fs.existsSync(filePath)) {
    throw new Error(`Lesson file not found: ${filePath}`);
  }

  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw);
}

/* ✅ START QUIZ */
export async function startQuiz(userId: string, lessonId: string, count?: number) {
  const data = loadLessonJson(lessonId);
  const exercises = data.exercises;

  if (!exercises.length) {
    throw new Error('No exercises found');
  }

  const max = count ?? 10;

  /* ✅ Shuffle */
  const shuffled = [...exercises].sort(() => Math.random() - 0.5);

  const selected = shuffled.slice(0, max);

  /* ✅ Transform for frontend */
  const items = selected.map((ex) => ({
    id: ex.id,
    exerciseId: ex.id,
    exercise: {
      id: ex.id,
      questionKm: ex.question,
      solutionKm: ex.explanation,
      correctAnswer: ['A', 'B', 'C', 'D'][ex.correctIndex],
      choices: {
        A: ex.choices[0],
        B: ex.choices[1],
        C: ex.choices[2],
        D: ex.choices[3],
      },
    },
  }));

  return {
    id: `session-${lessonId}-${Date.now()}`, // ✅ GOOD FORMAT
    lessonId,
    items,
  };
}

/* ✅ SUBMIT QUIZ */
export async function submitQuiz(sessionId: string, answers: AnswerItem[]) {
  const wrongAnswers: Array<{
    question?: string;
    correctAnswer?: string;
    selected?: string;
    solutionKm?: string;
  }> = [];

  let correctCount = 0;

  /* ✅ extract lessonId */
  const parts = sessionId.split('-');

  if (parts.length < 4) {
    throw new Error('Invalid sessionId');
  }

  const lessonId = `${parts[1]}-${parts[2]}-${parts[3]}`;

  const data = loadLessonJson(lessonId);
  const exercises = data.exercises;

  const exerciseMap = new Map<string, JsonExercise>(exercises.map((ex) => [ex.id, ex]));

  for (const ans of answers) {
    const ex = exerciseMap.get(ans.exerciseId);

    if (!ex) continue;

    const correctAnswer = ['A', 'B', 'C', 'D'][ex.correctIndex];

    const isCorrect = ans.selectedChoice === correctAnswer;

    if (isCorrect) {
      correctCount++;
    } else {
      wrongAnswers.push({
        question: ex.question,
        correctAnswer,
        selected: ans.selectedChoice,
        solutionKm: ex.explanation,
      });
    }
  }

  const total = answers.length;

  const score = total === 0 ? 0 : Math.round((correctCount / total) * 100);

  return {
    score,
    total,
    correct: correctCount,
    wrongAnswers,
  };
}

/* ✅ GET RESULT */
export async function getQuizResult(sessionId: string) {
  return {
    id: sessionId,
    items: [],
  };
}
