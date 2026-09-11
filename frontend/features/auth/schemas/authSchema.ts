import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(1, 'Password cannot be empty.'),
  remember: z.boolean().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(8, 'Password must be at least 8 characters long.'),
  role: z.enum(['CLIENT', 'FREELANCER'], {
    message: 'Role must be either CLIENT or FREELANCER.',
  }),
  terms: z.boolean().refine((val) => val === true, {
    message: 'You must accept the platform terms and escrow governance rules.',
  }),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
