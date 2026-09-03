import { z } from 'zod';

const createCheckInValidationSchema = z.object({
  body: z.object({
    metric: z.string({
      required_error: 'Metric is required',
    }),

    note: z.string().optional(),

    photo: z.string().optional(),

    checkInDate: z.string({
      required_error: 'Check-in date is required',
    }),
  }),
});

const updateCheckInValidationSchema = z.object({
  body: z.object({
    note: z.string().optional(),

    photo: z.string().optional(),

    checkInDate: z.string().optional(),
  }),
});

export const CheckInValidations = {
  createCheckInValidationSchema,
  updateCheckInValidationSchema,
};
