import { z } from 'zod';

const createMetricValidationSchema = z.object({
  body: z.object({
    user: z.string({
      required_error: 'User is required',
    }),

    title: z.string({
      required_error: 'Metric title is required',
    }),

    description: z.string({
      required_error: 'Description is required',
    }),

    isActive: z.boolean().optional(),
  }),
});

const updateMetricValidationSchema = z.object({
  body: z.object({
    title: z.string().optional(),

    description: z.string().optional(),

    unit: z.string().optional(),

    isActive: z.boolean().optional(),
  }),
});

export const MetricValidations = {
  createMetricValidationSchema,
  updateMetricValidationSchema,
};
