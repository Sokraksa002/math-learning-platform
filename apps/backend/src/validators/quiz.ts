import { z } from "zod";

export const startQuizSchema = z.object({
  lessonId: z.string().uuid(),
  count: z.number().int().min(5).max(15).optional(),
});

export const submitQuizSchema = z.object({
  sessionId: z.string().uuid(),
  answers: z
    .array(
      z.object({
        exerciseId: z.string().uuid(),
        selectedChoice: z.string(),
      })
    )
    .max(100),
});

export const getResultParamsSchema = z.object({
  id: z.string().uuid(),
});

export type StartQuizInput = z.infer<typeof startQuizSchema>;
export type SubmitQuizInput = z.infer<typeof submitQuizSchema>;
export type GetResultParams = z.infer<typeof getResultParamsSchema>;

// JSON Schemas for Fastify (derived from the Zod schemas)
export const startQuizJsonSchema = {
  type: "object",
  required: ["lessonId"],
  properties: {
    lessonId: { type: "string", format: "uuid" },
  count: { type: "integer", minimum: 5, maximum: 15, default: 10 },
  },
  additionalProperties: false,
} as const;

export const submitQuizJsonSchema = {
  type: "object",
  required: ["sessionId", "answers"],
  properties: {
    sessionId: { type: "string", format: "uuid" },
    answers: {
      type: "array",
      maxItems: 100,
      items: {
        type: "object",
        required: ["exerciseId", "selectedChoice"],
        properties: {
          exerciseId: { type: "string", format: "uuid" },
          selectedChoice: { type: "string" },
        },
        additionalProperties: false,
      },
    },
  },
  additionalProperties: false,
} as const;

export const getResultParamsJsonSchema = {
  type: "object",
  required: ["id"],
  properties: {
    id: { type: "string", format: "uuid" },
  },
  additionalProperties: false,
} as const;
