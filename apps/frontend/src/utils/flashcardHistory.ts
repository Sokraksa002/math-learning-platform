export type FlashcardHistory = {
  date: string;
  correct: number;
  total: number;
};

const STORAGE_KEY = "flashcard-history";

export const getFlashcardHistory = (): FlashcardHistory[] => {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
};
