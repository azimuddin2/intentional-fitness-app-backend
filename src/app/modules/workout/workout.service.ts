import AppError from '../../errors/AppError';
import { TWorkout } from './workout.interface';
import { Workout } from './workout.model';

const createWorkoutIntoDB = async (
  userId: string,
  payload: Partial<TWorkout>,
) => {
  const result = await Workout.create({ ...payload, user: userId });

  if (!result) {
    throw new AppError(400, 'Failed to save workout');
  }

  return result;
};

const getMyWorkoutsFromDB = async (userId: string) => {
  const result = await Workout.find({ user: userId, isDeleted: false });

  return result;
};

export const WorkoutServices = {
  createWorkoutIntoDB,
  getMyWorkoutsFromDB,
};
