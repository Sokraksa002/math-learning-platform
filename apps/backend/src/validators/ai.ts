import { z } from 'zod';

/* ✅ FIXED: ADD topic */
export const generateFlashcardsSchema = z.object({
  lessonId: z.string().uuid(),
  topic: z.string().min(3),
  save: z.boolean().optional(),
});

/* ✅ FIXED JSON SCHEMA */
export const generateFlashcardsJsonSchema = {
  type: 'object',
  required: ['lessonId', 'topic'],
  properties: {
    lessonId: { type: 'string' },
    topic: { type: 'string', minLength: 3 },
    save: { type: 'boolean', default: false },
  },
  additionalProperties: false,
} as const;

export type GenerateFlashcardsInput = z.infer<typeof generateFlashcardsSchema>;
