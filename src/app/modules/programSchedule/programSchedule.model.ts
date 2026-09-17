import { Schema, model } from 'mongoose';
import {
  TProgramSchedule,
  TProgramScheduledExercise,
} from './programSchedule.interface';

const programScheduledExerciseSchema = new Schema<TProgramScheduledExercise>(
  {
    exercise: {
      type: Schema.Types.ObjectId,
      ref: 'ProgramExercise',
      required: true,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    ratePerceivedExertion: {
      type: Number,
      min: 1,
      max: 5,
      default: null,
    },
    clientFeedback: {
      type: String,
      trim: true,
      default: null,
    },
  },
  { _id: false },
);

const programScheduleSchema = new Schema<TProgramSchedule>(
  {
    trainer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    program: {
      type: Schema.Types.ObjectId,
      ref: 'TrainingProgram',
      required: true,
    },
    exercises: {
      type: [programScheduledExerciseSchema],
      required: true,
      validate: {
        validator: (v: TProgramScheduledExercise[]) =>
          Array.isArray(v) && v.length > 0,
        message: 'At least one exercise is required',
      },
    },
    date: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true },
);

export const ProgramSchedule = model<TProgramSchedule>(
  'ProgramSchedule',
  programScheduleSchema,
);
