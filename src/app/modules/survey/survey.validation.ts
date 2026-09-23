import { z } from 'zod';
import { SurveyStatus } from './survey.constant';

const createSurveyValidationSchema = z.object({
  body: z.object({
    title: z
      .string({ required_error: 'Survey title is required' })
      .min(1, 'Survey title cannot be empty'),
    description: z.string({ required_error: 'Survey description is requred' }),
    status: z
      .enum([...SurveyStatus] as [string, ...string[]])
      .optional()
      .default('active'),
  }),
});

const updateSurveyValidationSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Survey title cannot be empty').optional(),
    description: z.string().optional(),
    status: z.enum([...SurveyStatus] as [string, ...string[]]).optional(),
  }),
});

export const SurveyValidation = {
  createSurveyValidationSchema,
  updateSurveyValidationSchema,
};
