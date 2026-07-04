import { z } from 'zod';

export const registerBodySchema = z.object({
  name: z.string().trim().min(2).max(80),
  username: z
    .string()
    .trim()
    .min(3)
    .max(40)
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can contain only letters, numbers, and underscores')
    .transform((value) => value.toLowerCase()),
  email: z
    .string()
    .trim()
    .email()
    .transform((value) => value.toLowerCase()),
  password: z.string().min(8).max(128),
});

export const loginBodySchema = z.object({
  email: z
    .string()
    .trim()
    .email()
    .transform((value) => value.toLowerCase()),
  password: z.string().min(1).max(128),
});

export const changePasswordBodySchema = z.object({
  currentPassword: z.string().min(1).max(128),
  newPassword: z.string().min(8).max(128),
});

export const registerSchema = z.object({
  body: registerBodySchema,
});

export const loginSchema = z.object({
  body: loginBodySchema,
});

export const changePasswordSchema = z.object({
  body: changePasswordBodySchema,
});
