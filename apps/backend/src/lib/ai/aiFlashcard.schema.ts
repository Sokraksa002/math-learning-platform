import { z } from 'zod';

export const aiFlashcardSchema = z.array(
  z.object({
    question: z.string().min(3),
    answer: z.string().min(3),
  }),
);
