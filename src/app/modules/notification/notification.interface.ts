import { Types } from 'mongoose';
import { TRole } from '../user/user.interface';

export type TType = 'exercise' | 'program' | 'homework' | 'goal';

export interface INotification {
  sender: Types.ObjectId;
  receiver: Types.ObjectId;
  receiverEmail: string;
  receiverRole: TRole;
  message: string;
  fcmToken?: string;
  type?: TType;
  title?: string;
  isRead?: boolean;
  link?: string;
}
