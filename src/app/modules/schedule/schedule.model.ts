import { Schema, model } from 'mongoose';
import { TSchedule, TScheduledExercise } from './schedule.interface';

const scheduledExerciseSchema = new Schema<TScheduledExercise>(
  {
    exercise: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: 'exerciseSourceType',
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    ratePerceivedExertion: {
      type: Number,
      min: 1,
      max: 5,
    },
    clientFeedback: {
      type: String,
      trim: true,
    },
  },
  { _id: false },
);

const scheduleSchema = new Schema<TSchedule>(
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
    sourceType: {
      type: String,
      enum: ['StabilizeCategory', 'TrainingProgram'],
      required: true,
    },
    source: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: 'sourceType',
    },
    exerciseSourceType: {
      type: String,
      enum: ['StabilizeExercise', 'ProgramExercise'],
      required: true,
    },
    exercises: {
      type: [scheduledExerciseSchema],
      required: true,
      validate: {
        validator: (v) => Array.isArray(v) && v.length > 0,
        message: 'At least one exercise is required',
      },
    },
    date: {
      type: Date,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

scheduleSchema.index(
  { trainer: 1, user: 1, source: 1, date: 1 },
  { unique: true },
);

export const Schedule = model<TSchedule>('Schedule', scheduleSchema);
