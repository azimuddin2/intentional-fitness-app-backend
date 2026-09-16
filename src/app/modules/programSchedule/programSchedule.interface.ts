import { ObjectId } from 'mongoose';
import { TUser } from '../user/user.interface';
import { TProgramExercise } from '../programExercise/programExercise.interface';
import { TTrainingProgram } from '../trainingProgram/trainingProgram.interface';

export type TProgramScheduledExercise = {
  exercise: ObjectId | TProgramExercise;
  isCompleted: boolean;
  ratePerceivedExertion?: number;
  clientFeedback?: string;
};

export type TProgramSchedule = {
  _id: ObjectId;
  trainer: ObjectId | TUser;
  user: ObjectId | TUser;
  program: ObjectId | TTrainingProgram;
  exercises: TProgramScheduledExercise[];
  date: Date;
  isDeleted: boolean;
};
