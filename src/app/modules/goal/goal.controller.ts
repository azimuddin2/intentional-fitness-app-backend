import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { GoalServices } from './goal.service';

const createGoal = catchAsync(async (req: Request, res: Response) => {
  const result = await GoalServices.createGoalIntoDB(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Goal added successfully',
    data: result,
  });
});

const getAllGoals = catchAsync(async (req: Request, res: Response) => {
  const result = await GoalServices.getAllGoalsFromDB(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Goals retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});

const getGoalById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await GoalServices.getGoalByIdFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Goal retrieved successfully',
    data: result,
  });
});

const updateGoal = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await GoalServices.updateGoalIntoDB(id, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Goal updated successfully',
    data: result,
  });
});

const deleteGoal = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await GoalServices.deleteGoalFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Goal deleted successfully',
    data: result,
  });
});

export const GoalControllers = {
  createGoal,
  getAllGoals,
  getGoalById,
  updateGoal,
  deleteGoal,
};
