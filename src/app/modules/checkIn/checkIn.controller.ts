import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import AppError from '../../errors/AppError';
import { CheckInServices } from './checkIn.service';

const createCheckIn = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.userId;

  const result = await CheckInServices.createCheckInIntoDB(
    userId,
    req.body,
    req.file,
  );

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Check-In successfully',
    data: result,
  });
});

const getCheckInsByMetric = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.userId;
  const { metricId } = req.params;

  if (!metricId) {
    throw new AppError(400, 'Metric ID is required');
  }

  const result = await CheckInServices.getCheckInsByMetricFromDB(
    userId,
    metricId,
    req.query,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Metric check-in history retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});

const getCheckInsByUser = catchAsync(async (req: Request, res: Response) => {
  const { metricId, userId } = req.params;

  if (!metricId) {
    throw new AppError(400, 'Metric ID is required');
  }

  if (!userId) {
    throw new AppError(400, 'User ID is required');
  }
  const result = await CheckInServices.getCheckInsByUserFromDB(
    userId,
    metricId,
    req.query,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'My check-ins retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});

export const CheckInControllers = {
  createCheckIn,
  getCheckInsByMetric,
  getCheckInsByUser,
};
