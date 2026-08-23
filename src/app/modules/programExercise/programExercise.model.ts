import { Schema, model } from 'mongoose';
import { TProgramExercise } from './programExercise.interface';

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
      required: function (this: TProgramExercise) {
        return !this.isPublic;
      },
    },

    isPublic: {
      type: Boolean,
      default: false,
    },

    name: {
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

    weight: {
      type: String,
      required: true,
      trim: true,
    },

    reps: {
      type: Number,
      required: true,
    },

    time: {
      type: String,
      required: true,
      trim: true,
    },

    frequency: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String,
      required: false,
      trim: true,
    },

    video: {
      type: String,
      required: false,
      trim: true,
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
