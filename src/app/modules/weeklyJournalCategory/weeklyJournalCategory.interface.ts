import { ObjectId } from 'mongoose';
import { TUser } from '../user/user.interface';

export type TWeeklyJournalCategory = {
  _id: ObjectId;
  trainer: ObjectId | TUser;
  name: string;
  isDeleted: boolean;
};
