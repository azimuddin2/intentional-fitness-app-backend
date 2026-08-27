import { Schema, model } from 'mongoose';
import { TProgramExercise, TSet } from './programExercise.interface';

const setSchema = new Schema<TSet>(
  {
    weight: {
      type: String,
      required: true,
    },
    reps: {
      type: Number,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    rest: {
      type: String,
      required: true,
    },
  },
  { _id: false },
);

const programExerciseSchema = new Schema<TProgramExercise>(
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
    title: {
      type: String,
      required: true,
      trim: true,
    },
    colour: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    equipmentSetup: {
      type: String,
      required: true,
      trim: true,
    },
    workFeelIntention: {
      type: String,
      required: true,
      trim: true,
    },
    trainingNotes: {
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
    frequency: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
      trim: true,
    },
    video: {
      type: String,
      required: true,
      trim: true,
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

export const ProgramExercise = model<TProgramExercise>(
  'ProgramExercise',
  programExerciseSchema,
);
