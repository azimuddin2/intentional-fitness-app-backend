import { z } from 'zod';

const createProgramExerciseValidationSchema = z.object({
  body: z.object({
    user: z.string({
      required_error: 'User ID is required',
      invalid_type_error: 'User ID must be a string',
    }),

    isPublic: z.boolean({
      required_error: 'isPublic is required',
      invalid_type_error: 'isPublic must be a boolean',
    }),

    name: z
      .string({
        required_error: 'Exercise name is required',
        invalid_type_error: 'Exercise name must be a string',
      })
      .min(2, 'Exercise name must be at least 2 characters')
      .max(50, 'Exercise name cannot exceed 50 characters')
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

    frequency: z
      .string({
        required_error: 'Frequency is required',
        invalid_type_error: 'Frequency must be a string',
      })
      .trim(),

    image: z
      .string({
        invalid_type_error: 'Image must be a string',
      })
      .trim()
      .optional(),

    video: z
      .string({
        invalid_type_error: 'Video URL must be a string',
      })
      .trim()
      .optional(),
  }),
});

const updateProgramExerciseValidationSchema = z.object({
  body: z.object({
    isPublic: z
      .boolean({
        invalid_type_error: 'isPublic must be a boolean',
      })
      .optional(),

    name: z
      .string({
        invalid_type_error: 'Exercise name must be a string',
      })
      .min(2, 'Exercise name must be at least 2 characters')
      .max(50, 'Exercise name cannot exceed 50 characters')
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

    weight: z
      .string({
        invalid_type_error: 'Weight must be a string',
      })
      .trim()
      .optional(),

    reps: z
      .number({
        invalid_type_error: 'Reps must be a number',
      })
      .optional(),

    time: z
      .string({
        invalid_type_error: 'Time must be a string',
      })
      .trim()
      .optional(),

    frequency: z
      .string({
        invalid_type_error: 'Frequency must be a string',
      })
      .trim()
      .optional(),

    image: z
      .string({
        invalid_type_error: 'Image must be a string',
      })
      .trim()
      .optional(),

    video: z
      .string({
        invalid_type_error: 'Video URL must be a string',
      })
      .trim()
      .optional(),
  }),
});

export const ProgramExerciseValidations = {
  createProgramExerciseValidationSchema,
  updateProgramExerciseValidationSchema,
};
