import { Schema, model } from 'mongoose';
import {
  TWeeklyJournal,
  TDailyEntry,
  TDailyTask,
} from './weeklyJournal.interface';
import { WellnessStatus } from './weeklyJournal.constant';

const dailyTaskSchema = new Schema<TDailyTask>(
  {
    category: {
      type: Schema.Types.ObjectId,
      ref: 'WeeklyJournalCategory',
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false },
);

const dailyEntrySchema = new Schema<TDailyEntry>(
  {
    date: {
      type: Date,
      required: true,
    },
    notes: {
      type: String,
      default: '',
    },
    tasks: {
      type: [dailyTaskSchema],
      default: [],
    },
    wellness: {
      sleepQuality: {
        type: String,
        enum: {
          values: WellnessStatus,
          message: '{VALUE} is not valid',
        },
      },
      emotionalStresses: {
        type: String,
        enum: {
          values: WellnessStatus,
          message: '{VALUE} is not valid',
        },
      },
      foodQuality: {
        type: String,
        enum: {
          values: WellnessStatus,
          message: '{VALUE} is not valid',
        },
      },
    },
    isSubmitted: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false },
);

const weeklyJournalSchema = new Schema<TWeeklyJournal>(
  {
    client: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    trainer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    weekNumber: {
      type: Number,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    insightFromSession: {
      type: String,
      default: '',
    },
    feelingAfterAppointment: {
      type: String,
      default: '',
    },
    goalsQuestionsConcerns: {
      type: String,
      default: '',
    },
    dailyEntries: {
      type: [dailyEntrySchema],
      default: [],
    },
    isCurrent: {
      type: Boolean,
      default: false,
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

// akta client-er duita week number duplicate hote parbe na
weeklyJournalSchema.index({ client: 1, weekNumber: 1 }, { unique: true });

// current week khujar jonno druto query
weeklyJournalSchema.index({ client: 1, isCurrent: 1 });

export const WeeklyJournal = model<TWeeklyJournal>(
  'WeeklyJournal',
  weeklyJournalSchema,
);
