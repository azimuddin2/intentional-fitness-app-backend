import { z } from 'zod';

const createDocValidationSchema = z.object({
  body: z.object({
    user: z.string({
      required_error: 'User is required',
    }),
    title: z.string({
      required_error: 'Title is required',
    }),
  }),
});

const updateDocValidationSchema = z.object({
  body: z.object({
    title: z.string().optional(),
  }),
});

export const DocValidations = {
  createDocValidationSchema,
  updateDocValidationSchema,
};
