import { ObjectId } from 'mongoose';
import { TUser } from '../user/user.interface';
import { TStabilizeExercise } from '../stabilizeExercise/stabilizeExercise.interface';
import { TStabilizeCategory } from '../stabilizeCategory/stabilizeCategory.interface';

export type TStabilizeScheduledExercise = {
  exercise: ObjectId | TStabilizeExercise;
  isCompleted: boolean;
  ratePerceivedExertion?: number;
  clientFeedback?: string;
};

export type TStabilizeSchedule = {
  _id: ObjectId;
  trainer: ObjectId | TUser;
  user: ObjectId | TUser;
  category: ObjectId | TStabilizeCategory;
  exercises: TStabilizeScheduledExercise[];
  date: Date;
};
