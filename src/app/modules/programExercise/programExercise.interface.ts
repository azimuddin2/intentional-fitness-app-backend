import { ObjectId } from 'mongoose';
import { TUser } from '../user/user.interface';
import { TTrainingProgram } from '../trainingProgram/trainingProgram.interface';

export type TSet = {
  weight: string;
  reps: number;
  time: string;
  rest: string;
};

export type TImage = {
  url: string;
  key: string;
};

export type TProgramExercise = {
  _id: ObjectId;
  trainer: ObjectId | TUser;
  user: ObjectId | TUser;
  program: ObjectId | TTrainingProgram;

  title: string;
  colour: string;
  description: string;

  equipmentSetup: string;
  workFeelIntention: string;
  trainingNotes: string;

  sets: TSet[];

  frequency: string;

  images: TImage[];
  deleteKey: string[];
  video: string;

  isDeleted: boolean;
};
