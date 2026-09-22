import { Schema, model } from 'mongoose';
import { TWorkout, WorkoutModel, TWorkoutPoint } from './workout.interface';
import { WorkoutStatus, WorkoutType } from './workout.constant';

const workoutPointSchema = new Schema<TWorkoutPoint>(
  {
    lat: {
      type: Number,
      required: [true, 'Latitude is required'],
    },
    long: {
      type: Number,
      required: [true, 'Longitude is required'],
    },
    timestamp: {
      type: Date,
      required: [true, 'Timestamp is required'],
    },
  },
  { _id: false },
);

const workoutSchema = new Schema<TWorkout, WorkoutModel>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    type: {
      type: String,
      enum: {
        values: WorkoutType,
        message: '{VALUE} is not valid',
      },
      required: [true, 'Workout type is required'],
    },
    status: {
      type: String,
      enum: {
        values: WorkoutStatus,
        message: '{VALUE} is not valid',
      },
      default: 'completed',
    },
    startTime: {
      type: Date,
      required: [true, 'Start time is required'],
    },
    endTime: {
      type: Date,
      default: null,
    },
    distance: {
      type: Number,
      default: 0,
    },
    duration: {
      type: Number,
      default: 0,
    },
    avgPace: {
      type: Number,
      default: null,
    },
    points: {
      type: [workoutPointSchema],
      default: [],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export const Workout = model<TWorkout, WorkoutModel>('Workout', workoutSchema);
