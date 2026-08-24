import { ObjectId } from 'mongoose';
import { TUser } from '../user/user.interface';
import { TStabilizeCategory } from '../stabilizeCategory/stabilizeCategory.interface';

export type TVideo = {
  url: string;
  key: string;
};

export type TSet = {
  weight: string;
  reps: number;
  time: string;
  rest: string;
};

export type TStabilizeExercise = {
  _id: ObjectId;
  trainer: ObjectId | TUser;
  user: ObjectId | TUser;
  isPublic: boolean;
  category: ObjectId | TStabilizeCategory;

  title: string;
  description: string;
  video: TVideo;

  equipment: string;
  duration: string;
  frequency: string;
  trainingNotes: string;
  rpe: number;

  sets: TSet[];

  isDeleted: boolean;
};
