import { ObjectId } from 'mongoose';
import { TUser } from '../user/user.interface';

export type TDoc = {
  _id?: string;
  user: ObjectId | TUser;

  title: string;
  file?: string | null;

  createdAt?: string;
  updatedAt?: string;
};
