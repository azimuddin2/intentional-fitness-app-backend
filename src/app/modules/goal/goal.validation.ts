import { z } from 'zod';

const createGoalValidationSchema = z.object({
  body: z.object({
    user: z.string({
      required_error: 'User ID is required',
      invalid_type_error: 'User ID must be a string',
    }),
    title: z.string({
      required_error: 'Goal title is required',
    }),
    description: z.string({
      required_error: 'Description is required',
    }),
    isFavorite: z.boolean().optional(),
  }),
});

const updateGoalValidationSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    isFavorite: z.boolean().optional(),
  }),
});

export const GoalValidations = {
  createGoalValidationSchema,
  updateGoalValidationSchema,
};
