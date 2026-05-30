import { z } from 'zod';

/* ✅ START QUIZ */
export const startQuizSchema = z.object({
  lessonId: z.string(), // ✅ FIXED (remove uuid)
  count: z.number().int().min(5).max(15).optional(),
});

/* ✅ SUBMIT QUIZ */
export const submitQuizSchema = z.object({
  sessionId: z.string(), // ✅ FIXED (not uuid anymore)
  answers: z
    .array(
      z.object({
        exerciseId: z.string(), // ✅ FIXED (not uuid)
        selectedChoice: z.string(),
      }),
    )
    .max(100),
});

/* ✅ GET RESULT */
export const getResultParamsSchema = z.object({
  id: z.string(), // ✅ FIXED
});

export type StartQuizInput = z.infer<typeof startQuizSchema>;
export type SubmitQuizInput = z.infer<typeof submitQuizSchema>;
export type GetResultParams = z.infer<typeof getResultParamsSchema>;

/* ✅ JSON SCHEMA (Fastify) */
export const startQuizJsonSchema = {
  type: 'object',
  required: ['lessonId'],
  properties: {
    lessonId: { type: 'string' }, // ✅ removed uuid
    count: { type: 'integer', minimum: 5, maximum: 15, default: 10 },
  },
  additionalProperties: false,
} as const;

export const submitQuizJsonSchema = {
  type: 'object',
  required: ['sessionId', 'answers'],
  properties: {
    sessionId: { type: 'string' }, // ✅ removed uuid
    answers: {
      type: 'array',
      maxItems: 100,
      items: {
        type: 'object',
        required: ['exerciseId', 'selectedChoice'],
        properties: {
          exerciseId: { type: 'string' }, // ✅ removed uuid
          selectedChoice: { type: 'string' },
        },
        additionalProperties: false,
      },
    },
  },
  additionalProperties: false,
} as const;

export const getResultParamsJsonSchema = {
  type: 'object',
  required: ['id'],
  properties: {
    id: { type: 'string' }, // ✅ removed uuid
  },
  additionalProperties: false,
} as const;
