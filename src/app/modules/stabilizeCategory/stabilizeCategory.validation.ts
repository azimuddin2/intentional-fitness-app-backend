import { z } from 'zod';

const createStabilizeCategoryValidationSchema = z.object({
  body: z.object({
    user: z.string({
      required_error: 'User ID is required',
      invalid_type_error: 'User ID must be a string',
    }),
    name: z
      .string({
        required_error: 'Category name is required',
        invalid_type_error: 'Category name must be a string',
      })
      .min(2, 'Category name must be at least 2 characters')
      .max(50, 'Category name cannot exceed 50 characters')
      .trim(),
  }),
});

const updateStabilizeCategoryValidationSchema = z.object({
  body: z.object({
    name: z
      .string({
        invalid_type_error: 'Category name must be a string',
      })
      .min(2, 'Category name must be at least 2 characters')
      .max(50, 'Category name cannot exceed 50 characters')
      .trim()
      .optional(),
  }),
});

export const StabilizeCategoryValidations = {
  createStabilizeCategoryValidationSchema,
  updateStabilizeCategoryValidationSchema,
};
