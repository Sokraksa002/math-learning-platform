import { z } from 'zod';

/* ✅ START QUIZ */
export const startQuizSchema = z.object({
  lessonId: z.string(),
  count: z.number().int().min(5).max(15).optional(),
});

/* ✅ SUBMIT QUIZ (✅ ADD lessonId) */
export const submitQuizSchema = z.object({
  sessionId: z.string(),
  lessonId: z.string(),
  answers: z
    .array(
      z.object({
        exerciseId: z.string(),
        selectedChoice: z.string(),
      }),
    )
    .max(100),
});

/* ✅ GET RESULT */
export const getResultParamsSchema = z.object({
  id: z.string(),
});

/* ✅ TYPES */
export type StartQuizInput = z.infer<typeof startQuizSchema>;
export type SubmitQuizInput = z.infer<typeof submitQuizSchema>;
export type GetResultParams = z.infer<typeof getResultParamsSchema>;

/* ================= JSON SCHEMA ================= */

/* ✅ START */
export const startQuizJsonSchema = {
  type: 'object',
  required: ['lessonId'],
  properties: {
    lessonId: { type: 'string' },
    count: { type: 'integer', minimum: 5, maximum: 15, default: 10 },
  },
  additionalProperties: false,
} as const;

/* ✅ SUBMIT (✅ ADD lessonId) */
export const submitQuizJsonSchema = {
  type: 'object',
  required: ['sessionId', 'answers', 'lessonId'],
  properties: {
    sessionId: { type: 'string' },
    lessonId: { type: 'string' },

    answers: {
      type: 'array',
      maxItems: 100,
      items: {
        type: 'object',
        required: ['exerciseId', 'selectedChoice'],
        properties: {
          exerciseId: { type: 'string' },
          selectedChoice: { type: 'string' },
        },
        additionalProperties: false,
      },
    },
  },
  additionalProperties: false,
} as const;

/* ✅ RESULT */
export const getResultParamsJsonSchema = {
  type: 'object',
  required: ['id'],
  properties: {
    id: { type: 'string' },
  },
  additionalProperties: false,
} as const;
