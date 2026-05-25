/* =======================
   Content Block Types
======================= */

export type ContentBlock =
  | TextBlock
  | FlashcardBlock
  | FormulaBlock
  | QuizBlock;

/* =======================
   Lesson Content Wrapper
======================= */

export interface LessonContent {
  blocks: ContentBlock[];
}

/* =======================
   Block Definitions
======================= */

export interface TextBlock {
  type: "text";
  value: string;
}

export interface FlashcardBlock {
  type: "flashcard";
  question: string;
  answer: string;
}

export interface FormulaBlock {
  type: "formula";
  value: string;
}

export interface QuizBlock {
  type: "quiz";
  question: string;
  choices: string[];
  correctIndex: number;
  explanation?: string;
}