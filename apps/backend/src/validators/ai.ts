import { z } from 'zod';

export const generateFlashcardsSchema = z.object({
  lessonId: z.string().uuid(),
  save: z.boolean().optional(),
});

export const generateFlashcardsJsonSchema = {
  type: 'object',
  required: ['lessonId'],
  properties: {
    lessonId: { type: 'string' },
    save: { type: 'boolean', default: false },
  },
  additionalProperties: false,
} as const;

export type GenerateFlashcardsInput = z.infer<typeof generateFlashcardsSchema>;
