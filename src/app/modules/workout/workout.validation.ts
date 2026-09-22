import { z } from 'zod';
import { WorkoutType } from './workout.constant';

const workoutPointValidationSchema = z.object({
  lat: z.number({
    required_error: 'Latitude is required',
    invalid_type_error: 'Latitude must be a number',
  }),

  long: z.number({
    required_error: 'Longitude is required',
    invalid_type_error: 'Longitude must be a number',
  }),

  timestamp: z
    .string({
      required_error: 'Timestamp is required',
    })
    .datetime(),
});

const createWorkoutValidationSchema = z.object({
  body: z.object({
    type: z.enum([...WorkoutType] as [string, ...string[]], {
      required_error: 'Workout type is required',
    }),

    startTime: z
      .string({
        required_error: 'Start time is required',
      })
      .datetime(),

    endTime: z
      .string({
        required_error: 'End time is required',
      })
      .datetime(),

    distance: z
      .number({
        required_error: 'Distance is required',
        invalid_type_error: 'Distance must be a number',
      })
      .min(0, 'Distance cannot be negative'),

    duration: z
      .number({
        required_error: 'Duration is required',
        invalid_type_error: 'Duration must be a number',
      })
      .min(0, 'Duration cannot be negative'),

    avgPace: z.number().nullable().optional(),

    points: z.array(workoutPointValidationSchema).optional(),
  }),
});

export const WorkoutValidations = {
  createWorkoutValidationSchema,
};
