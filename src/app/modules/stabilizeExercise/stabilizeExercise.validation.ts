import { z } from 'zod';

const setValidationSchema = z.object({
  weight: z.string({
    required_error: 'Weight is required',
    invalid_type_error: 'Weight must be a string',
  }),
  reps: z.number({
    required_error: 'Reps is required',
    invalid_type_error: 'Reps must be a number',
  }),
  time: z.string({
    required_error: 'Time is required',
    invalid_type_error: 'Time must be a string',
  }),
  rest: z.string({
    required_error: 'Rest is required',
    invalid_type_error: 'Rest must be a string',
  }),
});

const createStabilizeExerciseValidationSchema = z.object({
  body: z.object({
    user: z.string({
      required_error: 'User ID is required',
      invalid_type_error: 'User ID must be a string',
    }),
    isPublic: z.boolean({
      required_error: 'isPublic is required',
      invalid_type_error: 'isPublic must be a boolean',
    }),
    category: z.string({
      required_error: 'Category ID is required',
      invalid_type_error: 'Category ID must be a string',
    }),
    title: z
      .string({
        required_error: 'Exercise title is required',
        invalid_type_error: 'Exercise title must be a string',
      })
      .min(2, 'Exercise title must be at least 2 characters')
      .max(50, 'Exercise title cannot exceed 50 characters')
      .trim(),
    description: z
      .string({
        required_error: 'Description is required',
        invalid_type_error: 'Description must be a string',
      })
      .min(2, 'Description must be at least 2 characters')
      .trim(),
    equipment: z
      .string({
        required_error: 'Equipment is required',
        invalid_type_error: 'Equipment must be a string',
      })
      .trim(),
    duration: z
      .string({
        required_error: 'Duration is required',
        invalid_type_error: 'Duration must be a string',
      })
      .trim(),
    frequency: z
      .string({
        required_error: 'Frequency is required',
        invalid_type_error: 'Frequency must be a string',
      })
      .trim(),
    trainingNotes: z
      .string({
        required_error: 'Training notes is required',
        invalid_type_error: 'Training notes must be a string',
      })
      .trim(),
    workFeelIntention: z
      .string({
        required_error: 'Work feel intention is required',
        invalid_type_error: 'Work feel intention must be a string',
      })
      .trim(),
    sets: z
      .array(setValidationSchema, {
        required_error: 'At least one set is required',
      })
      .min(1, 'At least one set is required'),
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
    isCompleted: z
      .boolean({ invalid_type_error: 'isCompleted must be a boolean' })
      .optional(),
  }),
});

const updateStabilizeExerciseValidationSchema = z.object({
  body: z.object({
    isPublic: z
      .boolean({ invalid_type_error: 'isPublic must be a boolean' })
      .optional(),
    category: z
      .string({ invalid_type_error: 'Category ID must be a string' })
      .optional(),
    title: z
      .string({ invalid_type_error: 'Exercise title must be a string' })
      .min(2, 'Exercise title must be at least 2 characters')
      .max(50, 'Exercise title cannot exceed 50 characters')
      .trim()
      .optional(),
    description: z
      .string({ invalid_type_error: 'Description must be a string' })
      .min(2, 'Description must be at least 2 characters')
      .trim()
      .optional(),
    equipment: z
      .string({ invalid_type_error: 'Equipment must be a string' })
      .trim()
      .optional(),
    duration: z
      .string({ invalid_type_error: 'Duration must be a string' })
      .trim()
      .optional(),
    frequency: z
      .string({ invalid_type_error: 'Frequency must be a string' })
      .trim()
      .optional(),
    trainingNotes: z
      .string({ invalid_type_error: 'Training notes must be a string' })
      .trim()
      .optional(),
    workFeelIntention: z
      .string({ invalid_type_error: 'Work feel intention must be a string' })
      .trim()
      .optional(),
    sets: z
      .array(setValidationSchema)
      .min(1, 'At least one set is required')
      .optional(),
  }),
});

const updateClientFeedbackValidationSchema = z.object({
  body: z.object({
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

export const StabilizeExerciseValidations = {
  createStabilizeExerciseValidationSchema,
  updateStabilizeExerciseValidationSchema,
  updateClientFeedbackValidationSchema,
};
