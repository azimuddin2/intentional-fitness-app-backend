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

const videoValidationSchema = z.object({
  url: z.string({
    required_error: 'Video URL is required',
    invalid_type_error: 'Video URL must be a string',
  }),
  key: z.string({
    required_error: 'Video key is required',
    invalid_type_error: 'Video key must be a string',
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
    video: videoValidationSchema,
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
    rpe: z
      .number({
        required_error: 'Rate of Perceived Exertion is required',
        invalid_type_error: 'RPE must be a number',
      })
      .min(0, 'RPE cannot be less than 0')
      .max(10, 'RPE cannot exceed 10'),
    sets: z
      .array(setValidationSchema, {
        required_error: 'At least one set is required',
      })
      .min(1, 'At least one set is required'),
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
    name: z
      .string({ invalid_type_error: 'Exercise name must be a string' })
      .min(2, 'Exercise name must be at least 2 characters')
      .max(50, 'Exercise name cannot exceed 50 characters')
      .trim()
      .optional(),
    description: z
      .string({ invalid_type_error: 'Description must be a string' })
      .min(2, 'Description must be at least 2 characters')
      .trim()
      .optional(),
    video: videoValidationSchema.optional(),
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
    rpe: z
      .number({ invalid_type_error: 'RPE must be a number' })
      .min(0, 'RPE cannot be less than 0')
      .max(10, 'RPE cannot exceed 10')
      .optional(),
    sets: z
      .array(setValidationSchema)
      .min(1, 'At least one set is required')
      .optional(),
  }),
});

export const StabilizeExerciseValidations = {
  createStabilizeExerciseValidationSchema,
  updateStabilizeExerciseValidationSchema,
};
