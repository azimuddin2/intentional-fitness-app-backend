import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { WorkoutServices } from './workout.service';

const createWorkout = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.userId;

  const result = await WorkoutServices.createWorkoutIntoDB(userId, req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Workout saved successfully',
    data: result,
  });
});

const getMyWorkouts = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.userId;

  const result = await WorkoutServices.getMyWorkoutsFromDB(userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Workouts retrieved successfully',
    data: result,
  });
});

export const WorkoutControllers = {
  createWorkout,
  getMyWorkouts,
};
