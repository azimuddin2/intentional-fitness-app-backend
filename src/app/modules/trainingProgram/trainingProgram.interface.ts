import { ObjectId } from 'mongoose';
import { TUser } from '../user/user.interface';

export type TTrainingProgram = {
  _id: ObjectId;
  trainer: ObjectId | TUser;
  name: string;
  isDeleted: boolean;
};
