import { ObjectId } from 'mongoose';
import { TUser } from '../user/user.interface';

export type TGoal = {
  _id?: string;
  user: ObjectId | TUser;
  title: string;
  description: string;
  isFavorite?: boolean;
  createdAt?: string;
  updatedAt?: string;
};
