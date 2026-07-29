import { TGender, TRole, TStatus } from './user.interface';

export const USER_ROLE = {
  user: 'user',
  trainer: 'trainer',
  admin: 'admin',
} as const;

export const UserRole: TRole[] = ['user', 'trainer', 'admin'];

export enum Login_With {
  google = 'google',
  apple = 'apple',
  credentials = 'credentials',
}

export const UserStatus: TStatus[] = ['ongoing', 'confirmed', 'blocked'];
export const Gender: TGender[] = ['male', 'female', 'other'];

export const userSearchableFields = ['name', 'email', 'phone'];
