import { Schema, model } from 'mongoose';
import { TStabilizeCategory } from './stabilizeCategory.interface';

const stabilizeCategorySchema = new Schema<TStabilizeCategory>(
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

stabilizeCategorySchema.index({ trainer: 1, name: 1 }, { unique: true });

export const StabilizeCategory = model<TStabilizeCategory>(
  'StabilizeCategory',
  stabilizeCategorySchema,
);
