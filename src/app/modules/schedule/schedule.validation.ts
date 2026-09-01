import { z } from 'zod';

const sourceTypeEnum = z.enum(['StabilizeCategory', 'TrainingProgram'], {
  required_error: 'Source type is required',
  invalid_type_error:
    'Source type must be either StabilizeCategory or TrainingProgram',
});

const exerciseSourceTypeEnum = z.enum(
  ['StabilizeExercise', 'ProgramExercise'],
  {
    required_error: 'Exercise source type is required',
    invalid_type_error:
      'Exercise source type must be either StabilizeExercise or ProgramExercise',
  },
);

// Trainer কর্তৃক Schedule তৈরি/exercise assign করার সময় ব্যবহার হবে
const createScheduleValidationSchema = z.object({
  body: z.object({
    user: z.string({
      required_error: 'User ID is required',
      invalid_type_error: 'User ID must be a string',
    }),

    sourceType: sourceTypeEnum,
    source: z.string({
      required_error: 'Source ID is required',
      invalid_type_error: 'Source ID must be a string',
    }),

    exerciseSourceType: exerciseSourceTypeEnum,
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

// পুরনো Schedule-এ নতুন exercise যোগ করার সময় ব্যবহার হবে (একই date-এ)
const addExerciseToScheduleValidationSchema = z.object({
  body: z.object({
    exercises: z
      .array(z.string({ invalid_type_error: 'Exercise ID must be a string' }), {
        required_error: 'At least one exercise is required',
      })
      .min(1, 'At least one exercise is required'),
  }),
});

// Client কর্তৃক নির্দিষ্ট Exercise-এর completion/feedback দেওয়ার সময় ব্যবহার হবে
const updateScheduledExerciseFeedbackValidationSchema = z.object({
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

export const ScheduleValidations = {
  createScheduleValidationSchema,
  addExerciseToScheduleValidationSchema,
  updateScheduledExerciseFeedbackValidationSchema,
};
