import { ObjectId } from 'mongoose';
import { TUser } from '../user/user.interface';
import { TStabilizeCategory } from '../stabilizeCategory/stabilizeCategory.interface';
import { TStabilizeExercise } from '../stabilizeExercise/stabilizeExercise.interface';
import { TTrainingProgram } from '../trainingProgram/trainingProgram.interface';

export type TSchedule = {
  _id: ObjectId;
  trainer: ObjectId | TUser;
  user: ObjectId | TUser;

  category: ObjectId | TStabilizeCategory | TTrainingProgram;
  exercises: ObjectId[] | TStabilizeExercise[];
  date: Date;

  ratePerceivedExertion?: number;
  clientFeedback?: string;
  isCompleted: boolean;

  isDeleted: boolean;
};
