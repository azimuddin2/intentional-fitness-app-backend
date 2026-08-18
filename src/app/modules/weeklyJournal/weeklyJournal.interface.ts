import { ObjectId } from 'mongoose';
import { TUser } from '../user/user.interface';
import { TWeeklyJournalTask } from '../weeklyJournalTask/weeklyJournalTask.interface';

export type TWellnessStatus = 'green' | 'yellow' | 'red';

export type TDailyTask = {
  task: ObjectId | TWeeklyJournalTask;
  completed: boolean;
};

export type TDailyEntry = {
  date: Date;
  notes: string;
  tasks: TDailyTask[];
  wellness: {
    sleepQuality?: TWellnessStatus;
    emotionalStresses?: TWellnessStatus;
    foodQuality?: TWellnessStatus;
  };
  isSubmitted: boolean;
};

export type TWeeklyJournal = {
  _id: ObjectId;
  client: ObjectId | TUser;
  trainer: ObjectId | TUser;
  weekNumber: number;
  startDate: Date;
  endDate: Date;
  insightFromSession: string;
  feelingAfterAppointment: string;
  goalsQuestionsConcerns: string;
  dailyEntries: TDailyEntry[];
  isCurrent: boolean;
  isDeleted: boolean;
};
