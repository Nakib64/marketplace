import { z } from 'zod';

export const createJobSchema = z.object({
  title: z
    .string()
    .min(5, 'Title must be at least 5 characters')
    .max(150, 'Title cannot exceed 150 characters'),
  category: z.string().min(1, 'Please select a domain category'),
  subCategory: z.string().optional(),
  description: z
    .string()
    .min(20, 'Please provide at least 20 characters describing project scope & deliverables'),
  budget: z
    .number({ invalid_type_error: 'Budget must be a valid number' })
    .min(1, 'Budget must be at least $1'),
  skills: z
    .array(z.string())
    .min(1, 'Please add at least one technical skill tag'),
});

export type CreateJobFormData = z.infer<typeof createJobSchema>;
