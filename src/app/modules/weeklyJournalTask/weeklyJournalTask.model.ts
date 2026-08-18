import { Schema, model } from 'mongoose';
import { TWeeklyJournalTask } from './weeklyJournalTask.interface';

const weeklyJournalTaskSchema = new Schema<TWeeklyJournalTask>(
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

weeklyJournalTaskSchema.index({ trainer: 1, name: 1 }, { unique: true });

export const WeeklyJournalTask = model<TWeeklyJournalTask>(
  'WeeklyJournalTask',
  weeklyJournalTaskSchema,
);
