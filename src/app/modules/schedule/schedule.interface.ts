import { ObjectId } from 'mongoose';
import { TUser } from '../user/user.interface';
import { TStabilizeCategory } from '../stabilizeCategory/stabilizeCategory.interface';
import { TStabilizeExercise } from '../stabilizeExercise/stabilizeExercise.interface';

export type TSchedule = {
  _id: ObjectId;
  trainer: ObjectId | TUser;
  user: ObjectId | TUser;
  category: ObjectId | TStabilizeCategory;
  exercises: ObjectId[] | TStabilizeExercise[];
  date: Date;
  isDeleted: boolean;
};
