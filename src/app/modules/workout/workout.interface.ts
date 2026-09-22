import { Model, ObjectId } from 'mongoose';

export type TWorkoutType = 'running' | 'walking';

export type TWorkoutStatus = 'ongoing' | 'paused' | 'completed';

export type TWorkoutPoint = {
  lat: number;
  long: number;
  timestamp: Date;
};

export type TWorkout = {
  _id: ObjectId;
  user: ObjectId;

  type: TWorkoutType;
  status: TWorkoutStatus;

  startTime: Date;
  endTime?: Date | null;

  distance: number;
  duration: number;

  avgPace: number | null;

  points: TWorkoutPoint[];

  isDeleted: boolean;
};

export type WorkoutModel = Model<TWorkout>;
