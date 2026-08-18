import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { WeeklyJournalTaskService } from './weeklyJournalTask.service';

const createTask = catchAsync(async (req: Request, res: Response) => {
  const trainerId = req.user.userId;
  const { name } = req.body;

  const result = await WeeklyJournalTaskService.createTaskIntoDB(
    trainerId,
    name,
  );

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Task created successfully',
    data: result,
  });
});

const getTasks = catchAsync(async (req: Request, res: Response) => {
  const trainerId = req.user._id;

  const result =
    await WeeklyJournalTaskService.getTasksByTrainerFromDB(trainerId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Tasks retrieved successfully',
    data: result,
  });
});

const updateTask = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;

  const result = await WeeklyJournalTaskService.updateTaskInDB(id, name);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Task updated successfully',
    data: result,
  });
});

const deleteTask = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await WeeklyJournalTaskService.deleteTaskFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Task deleted successfully',
    data: result,
  });
});

export const WeeklyJournalTaskController = {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
};
