import { ObjectId } from 'mongoose';
import { TRole } from '../user/user.interface';

export type TLoginUser = {
  email: string;
  password: string;
  fcmToken?: string;
};

export type TChangePassword = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export type TResetPassword = {
  newPassword: string;
  confirmPassword: string;
};

export type TJwtPayload = {
  userId: ObjectId | string;
  name: string;
  email: string;
  role: TRole;
  iat?: number;
  exp?: number;
};
