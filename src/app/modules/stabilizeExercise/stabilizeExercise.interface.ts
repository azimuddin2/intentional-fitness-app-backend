import { ObjectId } from 'mongoose';
import { TUser } from '../user/user.interface';
import { TStabilizeCategory } from '../stabilizeCategory/stabilizeCategory.interface';

export type TImage = {
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
  category: ObjectId | TStabilizeCategory;

  title: string;
  description: string;

  images: TImage[];
  deleteKey: string[];
  video: string;

  equipment: string;
  duration: string;
  frequency: string;
  trainingNotes: string;
  workFeelIntention: string;
  sets: TSet[];

  isDeleted: boolean;
};
