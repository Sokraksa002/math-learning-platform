export type QuizHistory = {
  lesson: string;
  score: number;
  date: string;
};

const STORAGE_KEY = "quiz-history";

export const getQuizHistory = (): QuizHistory[] => {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
};
