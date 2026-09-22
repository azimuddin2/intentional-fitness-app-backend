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

const getUserOverviewChart = catchAsync(async (req: Request, res: Response) => {
  const year = req.query.year ? Number(req.query.year) : undefined;

  const result = await DashboardServices.getUserOverviewChart(year);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User yearly overview chart retrieved successfully',
    data: result,
  });
});

const getTrainerOverviewChart = catchAsync(
  async (req: Request, res: Response) => {
    const year = req.query.year ? Number(req.query.year) : undefined;

    const result = await DashboardServices.getTrainerOverviewChart(year);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Trainer yearly overview chart retrieved successfully',
      data: result,
    });
  },
);

const getRecentUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await DashboardServices.getRecentUsersFromDB();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Recent users retrieved successfully',
    data: result,
  });
});

export const DashboardControllers = {
  getTotalUsers,
  getTotalTrainers,
  getUserOverviewChart,
  getTrainerOverviewChart,
  getRecentUsers,
};
