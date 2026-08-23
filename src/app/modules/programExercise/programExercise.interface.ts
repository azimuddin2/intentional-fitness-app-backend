import { ObjectId } from 'mongoose';

import { TUser } from '../user/user.interface';

export type TProgramExercise = {
  _id: ObjectId;
  trainer: ObjectId | TUser;
  user: ObjectId | TUser;
  isPublic: boolean;

  name: string;
  colour: string;
  description: string;

  equipmentSetup: string;
  workFeelIntention: string;
  trainingNotes: string;

  weight: string;
  reps: number;
  time: string;

  frequency: string;

  image?: string;
  video?: string;

  isDeleted: boolean;
};
