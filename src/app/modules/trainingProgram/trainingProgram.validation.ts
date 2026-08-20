import { z } from 'zod';

const createTrainingProgramValidationSchema = z.object({
  body: z.object({
    user: z.string({
      required_error: 'User ID is required',
      invalid_type_error: 'User ID must be a string',
    }),
    name: z
      .string({
        required_error: 'Training program name is required',
        invalid_type_error: 'Training program name must be a string',
      })
      .min(3, 'Training program name must be at least 3 characters')
      .max(50, 'Training program name cannot exceed 50 characters')
      .trim(),
  }),
});

const updateTrainingProgramValidationSchema = z.object({
  body: z.object({
    name: z
      .string({
        invalid_type_error: 'Training program name must be a string',
      })
      .min(3, 'Training program name must be at least 3 characters')
      .max(50, 'Training program name cannot exceed 50 characters')
      .trim()
      .optional(),
  }),
});

export const TrainingProgramValidations = {
  createTrainingProgramValidationSchema,
  updateTrainingProgramValidationSchema,
};
