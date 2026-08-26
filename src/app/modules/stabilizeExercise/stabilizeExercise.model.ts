import { Schema, model } from 'mongoose';
import {
  TStabilizeExercise,
  TSet,
  TVideo,
} from './stabilizeExercise.interface';

const setSchema = new Schema<TSet>(
  {
    weight: { type: String },
    reps: { type: Number },
    time: { type: String },
    rest: { type: String },
  },
  { _id: false },
);

const videoSchema = new Schema<TVideo>(
  {
    url: {
      type: String,
      required: true,
    },
    key: {
      type: String,
      required: true,
    },
  },
  { _id: false },
);

const stabilizeExerciseSchema = new Schema<TStabilizeExercise>(
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
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    video: {
      type: videoSchema,
      required: true,
    },
    equipment: {
      type: String,
      required: true,
      trim: true,
    },
    duration: {
      type: String,
      required: true,
      trim: true,
    },
    frequency: {
      type: String,
      required: true,
      trim: true,
    },
    trainingNotes: {
      type: String,
      required: true,
      trim: true,
    },
    workFeelIntention: {
      type: String,
      required: true,
      trim: true,
    },
    sets: {
      type: [setSchema],
      required: true,
      validate: {
        validator: (v: TSet[]) => Array.isArray(v) && v.length > 0,
        message: 'At least one set is required',
      },
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
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export const StabilizeExercise = model<TStabilizeExercise>(
  'StabilizeExercise',
  stabilizeExerciseSchema,
);
