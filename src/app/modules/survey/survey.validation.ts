import { z } from 'zod';

const createSurveyValidationSchema = z.object({
  body: z.object({
    title: z
      .string({ required_error: 'Survey title is required' })
      .min(1, 'Survey title cannot be empty'),
    description: z.string().optional(),
    status: z
      .enum(['active', 'draft', 'archived'])
      .optional()
      .default('active'),
    orderIndex: z.number().optional().default(0),

    isDeleted: z.boolean().optional().default(false),
  }),
});

const updateSurveyValidationSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Survey title cannot be empty').optional(),
    description: z.string().optional(),
    status: z.enum(['active', 'draft', 'archived']).optional(),
    orderIndex: z.number().optional(),
  }),
});

export const SurveyValidation = {
  createSurveyValidationSchema,
  updateSurveyValidationSchema,
};
