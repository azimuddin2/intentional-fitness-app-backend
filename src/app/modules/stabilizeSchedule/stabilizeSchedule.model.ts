import { Schema, model } from 'mongoose';
import {
  TStabilizeSchedule,
  TStabilizeScheduledExercise,
} from './stabilizeSchedule.interface';

const stabilizeScheduledExerciseSchema =
  new Schema<TStabilizeScheduledExercise>(
    {
      exercise: {
        type: Schema.Types.ObjectId,
        ref: 'StabilizeExercise',
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

const stabilizeScheduleSchema = new Schema<TStabilizeSchedule>(
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
    category: {
      type: Schema.Types.ObjectId,
      ref: 'StabilizeCategory',
      required: true,
    },
    exercises: {
      type: [stabilizeScheduledExerciseSchema],
      required: true,
      validate: {
        validator: (v: TStabilizeScheduledExercise[]) =>
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

export const StabilizeSchedule = model<TStabilizeSchedule>(
  'StabilizeSchedule',
  stabilizeScheduleSchema,
);
