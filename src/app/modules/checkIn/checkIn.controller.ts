import { Request, Response } from 'express';

import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import AppError from '../../errors/AppError';

import { CheckInServices } from './checkIn.service';

const createCheckIn = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.userId;

  const result = await CheckInServices.createCheckInIntoDB(userId, req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Check-in added successfully',
    data: result,
  });
});

const getMyCheckIns = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.userId;

  const result = await CheckInServices.getMyCheckInsFromDB(userId, req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'My check-ins retrieved successfully',
    meta: result.meta,
    data: result.result,
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

const getCheckInById = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.userId;
  const { id } = req.params;

  const result = await CheckInServices.getCheckInByIdFromDB(userId, id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Check-in retrieved successfully',
    data: result,
  });
});

const updateCheckIn = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.userId;
  const { id } = req.params;

  const result = await CheckInServices.updateCheckInIntoDB(
    userId,
    id,
    req.body,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Check-in updated successfully',
    data: result,
  });
});

const deleteCheckIn = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.userId;
  const { id } = req.params;

  const result = await CheckInServices.deleteCheckInFromDB(userId, id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Check-in deleted successfully',
    data: result,
  });
});

export const CheckInControllers = {
  createCheckIn,
  getMyCheckIns,
  getCheckInsByMetric,
  getCheckInById,
  updateCheckIn,
  deleteCheckIn,
};
