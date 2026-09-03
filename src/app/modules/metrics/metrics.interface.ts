import { ObjectId } from 'mongoose';
import { TUser } from '../user/user.interface';

export type TMetric = {
  _id?: string;
  user: ObjectId | TUser;
  trainer: ObjectId | TUser;
  title: string;
  description: string;
  unit?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
};
