import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { DashboardServices } from './dashboard.service';
import sendResponse from '../../utils/sendResponse';

const getTotalUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await DashboardServices.getTotalUsersFromDB(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Total users retrieved successfully',
    data: result,
  });
});

const getTotalTrainers = catchAsync(async (req: Request, res: Response) => {
  const result = await DashboardServices.getTotalTrainersFromDB(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Total trainers retrieved successfully',
    data: result,
  });
});

export const DashboardControllers = {
  getTotalUsers,
  getTotalTrainers,
};
