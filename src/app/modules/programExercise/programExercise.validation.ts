import { z } from 'zod';

const setValidationSchema = z.object({
  weight: z
    .string({
      required_error: 'Weight is required',
      invalid_type_error: 'Weight must be a string',
    })
    .trim(),

  reps: z.number({
    required_error: 'Reps is required',
    invalid_type_error: 'Reps must be a number',
  }),

  time: z
    .string({
      required_error: 'Time is required',
      invalid_type_error: 'Time must be a string',
    })
    .trim(),

  rest: z
    .string({
      required_error: 'Rest is required',
      invalid_type_error: 'Rest must be a string',
    })
    .trim(),
});

const createProgramExerciseValidationSchema = z.object({
  body: z.object({
    user: z
      .string({
        required_error: 'User ID is required',
        invalid_type_error: 'User ID must be a string',
      })
      .trim(),

    program: z
      .string({
        required_error: 'Program ID is required',
        invalid_type_error: 'Program ID must be a string',
      })
      .trim(),

    title: z
      .string({
        required_error: 'Exercise title is required',
        invalid_type_error: 'Exercise title must be a string',
      })
      .min(2, 'Exercise title must be at least 2 characters')
      .max(100, 'Exercise title cannot exceed 100 characters')
      .trim(),

    colour: z
      .string({
        required_error: 'Colour is required',
        invalid_type_error: 'Colour must be a string',
      })
      .trim(),

    description: z
      .string({
        required_error: 'Description is required',
        invalid_type_error: 'Description must be a string',
      })
      .min(2, 'Description must be at least 2 characters')
      .trim(),

    equipmentSetup: z
      .string({
        required_error: 'Equipment / Setup is required',
        invalid_type_error: 'Equipment / Setup must be a string',
      })
      .trim(),

    workFeelIntention: z
      .string({
        required_error: 'Work Feel / Intention is required',
        invalid_type_error: 'Work Feel / Intention must be a string',
      })
      .trim(),

    trainingNotes: z
      .string({
        required_error: 'Training notes is required',
        invalid_type_error: 'Training notes must be a string',
      })
      .trim(),

    sets: z
      .array(setValidationSchema, {
        required_error: 'Sets are required',
        invalid_type_error: 'Sets must be an array',
      })
      .min(1, 'At least one set is required'),

    frequency: z
      .string({
        required_error: 'Frequency is required',
        invalid_type_error: 'Frequency must be a string',
      })
      .trim(),

    video: z
      .string({
        required_error: 'Video URL is required',
        invalid_type_error: 'Video URL must be a string',
      })
      .trim(),

    ratePerceivedExertion: z
      .number({
        invalid_type_error: 'Rate perceived exertion must be a number',
      })
      .min(1, 'Rate perceived exertion must be at least 1')
      .max(5, 'Rate perceived exertion cannot exceed 5')
      .optional(),

    clientFeedback: z
      .string({
        invalid_type_error: 'Client feedback must be a string',
      })
      .trim()
      .optional(),

    isCompleted: z
      .boolean({
        invalid_type_error: 'isCompleted must be a boolean',
      })
      .optional(),
  }),
});

const updateProgramExerciseValidationSchema = z.object({
  body: z.object({
    title: z
      .string({
        invalid_type_error: 'Exercise title must be a string',
      })
      .min(2, 'Exercise title must be at least 2 characters')
      .max(100, 'Exercise title cannot exceed 100 characters')
      .trim()
      .optional(),

    colour: z
      .string({
        invalid_type_error: 'Colour must be a string',
      })
      .trim()
      .optional(),

    description: z
      .string({
        invalid_type_error: 'Description must be a string',
      })
      .min(2, 'Description must be at least 2 characters')
      .trim()
      .optional(),

    equipmentSetup: z
      .string({
        invalid_type_error: 'Equipment / Setup must be a string',
      })
      .trim()
      .optional(),

    workFeelIntention: z
      .string({
        invalid_type_error: 'Work Feel / Intention must be a string',
      })
      .trim()
      .optional(),

    trainingNotes: z
      .string({
        invalid_type_error: 'Training notes must be a string',
      })
      .trim()
      .optional(),

    sets: z
      .array(setValidationSchema, {
        invalid_type_error: 'Sets must be an array',
      })
      .min(1, 'At least one set is required')
      .optional(),

    frequency: z
      .string({
        invalid_type_error: 'Frequency must be a string',
      })
      .trim()
      .optional(),

    video: z
      .string({
        invalid_type_error: 'Video URL must be a string',
      })
      .trim()
      .optional(),

    ratePerceivedExertion: z
      .number({
        invalid_type_error: 'Rate perceived exertion must be a number',
      })
      .min(1, 'Rate perceived exertion must be at least 1')
      .max(5, 'Rate perceived exertion cannot exceed 5')
      .optional(),

    clientFeedback: z
      .string({
        invalid_type_error: 'Client feedback must be a string',
      })
      .trim()
      .optional(),

    isCompleted: z
      .boolean({
        invalid_type_error: 'isCompleted must be a boolean',
      })
      .optional(),
  }),
});

export const ProgramExerciseValidations = {
  createProgramExerciseValidationSchema,
  updateProgramExerciseValidationSchema,
};
