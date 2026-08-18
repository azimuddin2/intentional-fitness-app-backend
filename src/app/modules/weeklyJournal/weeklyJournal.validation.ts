import { z } from 'zod';
import { Types } from 'mongoose';
import { WellnessStatus } from './weeklyJournal.constant';

const objectIdSchema = z.string().refine((val) => Types.ObjectId.isValid(val), {
  message: 'Invalid category id',
});

const updateReflectionValidationSchema = z.object({
  body: z.object({
    insightFromSession: z
      .string({ invalid_type_error: 'Insight from session must be a string' })
      .trim()
      .optional(),
    feelingAfterAppointment: z
      .string({
        invalid_type_error: 'Feeling after appointment must be a string',
      })
      .trim()
      .optional(),
    goalsQuestionsConcerns: z
      .string({
        invalid_type_error: 'Goals, questions, concerns must be a string',
      })
      .trim()
      .optional(),
  }),
});

const dailyTaskValidationSchema = z.object({
  category: objectIdSchema,
  completed: z.boolean({
    required_error: 'Completed status is required',
    invalid_type_error: 'Completed must be a boolean',
  }),
});

const wellnessValidationSchema = z.object({
  sleepQuality: z
    .enum([...WellnessStatus] as [string, ...string[]], {
      invalid_type_error: 'Sleep quality must be green, yellow or red',
    })
    .optional(),
  emotionalStresses: z
    .enum([...WellnessStatus] as [string, ...string[]], {
      invalid_type_error: 'Emotional stresses must be green, yellow or red',
    })
    .optional(),
  foodQuality: z
    .enum([...WellnessStatus] as [string, ...string[]], {
      invalid_type_error: 'Food quality must be green, yellow or red',
    })
    .optional(),
});

const submitDailyEntryValidationSchema = z.object({
  body: z.object({
    date: z
      .string({
        required_error: 'Date is required',
        invalid_type_error: 'Date must be a string',
      })
      .trim(),
    notes: z
      .string({ invalid_type_error: 'Notes must be a string' })
      .trim()
      .optional(),
    tasks: z
      .array(dailyTaskValidationSchema, {
        required_error: 'Tasks are required',
      })
      .min(1, 'At least one task is required'),
    wellness: wellnessValidationSchema.optional(),
  }),
});

export const WeeklyJournalValidations = {
  updateReflectionValidationSchema,
  submitDailyEntryValidationSchema,
};
