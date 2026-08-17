import { Schema, model } from 'mongoose';
import { TWeeklyJournalCategory } from './weeklyJournalCategory.interface';

const weeklyJournalCategorySchema = new Schema<TWeeklyJournalCategory>(
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

weeklyJournalCategorySchema.index({ trainer: 1, name: 1 }, { unique: true });

export const WeeklyJournalCategory = model<TWeeklyJournalCategory>(
  'WeeklyJournalCategory',
  weeklyJournalCategorySchema,
);
