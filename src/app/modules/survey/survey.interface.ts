import { ObjectId } from 'mongoose';
import { TUser } from '../user/user.interface';

export type TSurveyStatus = 'active' | 'inactive';

export type TSurvey = {
  _id?: string;
  title: string;
  description?: string;
  status?: TSurveyStatus;
  orderIndex?: number;
  createdBy: ObjectId | TUser;
  createdAt?: string;
  updatedAt?: string;
};
