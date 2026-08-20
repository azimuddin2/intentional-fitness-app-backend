import { ObjectId } from 'mongoose';
import { TUser } from '../user/user.interface';

export type TStabilizeCategory = {
  _id: ObjectId;
  trainer: ObjectId | TUser;
  user: ObjectId | TUser;
  name: string;
  isDeleted: boolean;
};
