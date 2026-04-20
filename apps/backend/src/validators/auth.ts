import { z } from "zod";

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