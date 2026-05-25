import { z } from 'zod';

/**
 * Validation schema for user registration
 */
export const registerSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  password: z.string().min(6),
});

/**
 * Validation schema for user login
 */
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const registerJsonSchema = {
  type: 'object',
  required: ['email', 'name', 'password'],
  properties: {
    email: { type: 'string', format: 'email' },
    name: { type: 'string', minLength: 2 },
    password: { type: 'string', minLength: 6 },
  },
  additionalProperties: false,
} as const;

export const loginJsonSchema = {
  type: 'object',
  required: ['email', 'password'],
  properties: {
    email: { type: 'string', format: 'email' },
    password: { type: 'string', minLength: 1 },
  },
  additionalProperties: false,
} as const;
