import { z } from 'zod';

/* =======================
   Individual Block Schemas
======================= */

export const textBlockSchema = z.object({
  type: z.literal('text'),
  value: z.string().min(1),
});

export const flashcardBlockSchema = z.object({
  type: z.literal('flashcard'),
  question: z.string().min(1),
  answer: z.string().min(1),
});

export const formulaBlockSchema = z.object({
  type: z.literal('formula'),
  value: z.string().min(1),
});

export const quizBlockSchema = z.object({
  type: z.literal('quiz'),
  question: z.string().min(1),
  choices: z.array(z.string().min(1)).min(2),
  correctIndex: z.number().int().nonnegative(),
  explanation: z.string().optional(),
});

/* =======================
   Discriminated Union
======================= */

export const contentBlockSchema = z.discriminatedUnion('type', [
  textBlockSchema,
  flashcardBlockSchema,
  formulaBlockSchema,
  quizBlockSchema,
]);

/* =======================
   Lesson Content Schema
======================= */

export const lessonContentSchema = z.object({
  blocks: z.array(contentBlockSchema).min(1),
});
export const lessonContentJsonSchema = {
  type: 'object',
  required: ['blocks'],
  properties: {
    blocks: {
      type: 'array',
      minItems: 1,
      items: {
        oneOf: [
          {
            type: 'object',
            required: ['type', 'value'],
            properties: { type: { const: 'text' }, value: { type: 'string', minLength: 1 } },
            additionalProperties: false,
          },
          {
            type: 'object',
            required: ['type', 'question', 'answer'],
            properties: {
              type: { const: 'flashcard' },
              question: { type: 'string', minLength: 1 },
              answer: { type: 'string', minLength: 1 },
            },
            additionalProperties: false,
          },
          {
            type: 'object',
            required: ['type', 'value'],
            properties: { type: { const: 'formula' }, value: { type: 'string', minLength: 1 } },
            additionalProperties: false,
          },
          {
            type: 'object',
            required: ['type', 'question', 'choices', 'correctIndex'],
            properties: {
              type: { const: 'quiz' },
              question: { type: 'string', minLength: 1 },
              choices: { type: 'array', minItems: 2, items: { type: 'string', minLength: 1 } },
              correctIndex: { type: 'integer', minimum: 0 },
              explanation: { type: 'string' },
            },
            additionalProperties: false,
          },
        ],
      },
    },
  },
  additionalProperties: false,
} as const;
``;
