import { ObjectId } from 'mongoose';

import { TUser } from '../user/user.interface';
import { TMetric } from '../metrics/metrics.interface';

export type TCheckIn = {
  _id?: string;
  user: ObjectId | TUser;
  metric: ObjectId | TMetric;

  proofType?: 'text' | 'photo';
  note?: string;
  photo?: string;
  checkInDate: string;

  createdAt?: string;
  updatedAt?: string;
};
