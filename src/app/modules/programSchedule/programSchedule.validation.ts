import { z } from 'zod';

const createProgramScheduleValidationSchema = z.object({
  body: z.object({
    user: z.string({
      required_error: 'User ID is required',
      invalid_type_error: 'User ID must be a string',
    }),

    program: z.string({
      required_error: 'Program ID is required',
      invalid_type_error: 'Program ID must be a string',
    }),

    exercises: z
      .array(z.string({ invalid_type_error: 'Exercise ID must be a string' }), {
        required_error: 'At least one exercise is required',
      })
      .min(1, 'At least one exercise is required'),

    date: z.coerce.date({
      required_error: 'Date is required',
      invalid_type_error: 'Date must be a valid date',
    }),
  }),
});

const addExerciseToProgramScheduleValidationSchema = z.object({
  body: z.object({
    exercises: z
      .array(z.string({ invalid_type_error: 'Exercise ID must be a string' }), {
        required_error: 'At least one exercise is required',
      })
      .min(1, 'At least one exercise is required'),
  }),
});

const updateProgramScheduledExerciseFeedbackValidationSchema = z.object({
  body: z.object({
    exerciseId: z.string({
      required_error: 'Exercise ID is required',
      invalid_type_error: 'Exercise ID must be a string',
    }),
    ratePerceivedExertion: z
      .number({
        invalid_type_error: 'Rate of Perceived Exertion must be a number',
      })
      .min(1, 'Rate of Perceived Exertion cannot be less than 1')
      .max(5, 'Rate of Perceived Exertion cannot exceed 5')
      .optional(),
    clientFeedback: z
      .string({ invalid_type_error: 'Client feedback must be a string' })
      .trim()
      .optional(),
  }),
});

export const ProgramScheduleValidations = {
  createProgramScheduleValidationSchema,
  addExerciseToProgramScheduleValidationSchema,
  updateProgramScheduledExerciseFeedbackValidationSchema,
};
