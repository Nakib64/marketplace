import { z } from 'zod';

export const portfolioImageSchema = z.object({
  id: z.string(),
  imageUrl: z.string().url('Please enter a valid image URL'),
  subtitle: z.string().max(150, 'Caption cannot exceed 150 characters').optional().default(''),
  isUploading: z.boolean().optional(),
});

export const portfolioFormSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(150, 'Title cannot exceed 150 characters'),
  details: z
    .string()
    .min(10, 'Please provide at least 10 characters describing the project'),
  liveLink: z
    .string()
    .url('Please enter a valid URL (e.g. https://example.com)')
    .or(z.literal(''))
    .optional(),
});

export type PortfolioImageItem = z.infer<typeof portfolioImageSchema>;
export type PortfolioFormData = z.infer<typeof portfolioFormSchema>;
