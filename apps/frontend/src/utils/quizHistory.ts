export type QuizHistory = {
  lesson: string;
  lessonId?: string;
  quizTitle?: string;
  chapterTitle?: string;
  score: number;
  totalQuestions?: number;
  date: string;
  answers?: {
    question: string;
    selected: string;
    correct: string;
    explanation: string;
  }[];
};

const STORAGE_KEY = "quiz-history";

export const getQuizHistory = (): QuizHistory[] => {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "[]") as QuizHistory[];
  } catch {
    return [];
  }
};

export const saveQuizHistory = (attempt: QuizHistory): void => {
  if (typeof window === "undefined") {
    return;
  }

  const history = getQuizHistory();
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify([attempt, ...history]));
};
