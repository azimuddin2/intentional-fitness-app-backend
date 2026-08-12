import { Schema, model } from 'mongoose';
import { TTrainingProgram } from './trainingProgram.interface';

const trainingProgramSchema = new Schema<TTrainingProgram>(
  {
    trainer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

trainingProgramSchema.index({ trainer: 1, name: 1 }, { unique: true });

export const TrainingProgram = model<TTrainingProgram>(
  'TrainingProgram',
  trainingProgramSchema,
);
