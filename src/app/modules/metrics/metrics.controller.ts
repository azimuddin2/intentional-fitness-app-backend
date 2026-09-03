import { Request, Response } from 'express';

import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import AppError from '../../errors/AppError';

import { MetricServices } from './metrics.service';

const createMetric = catchAsync(async (req: Request, res: Response) => {
  const trainerId = req.user.userId;
  const { user } = req.body;

  if (!user) {
    throw new AppError(400, 'User ID is required');
  }

  const result = await MetricServices.createMetricIntoDB(
    trainerId,
    user,
    req.body,
  );

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Metric added successfully',
    data: result,
  });
});

const getMyMetrics = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.userId;

  const result = await MetricServices.getMyMetricsFromDB(userId, req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'My metrics retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});

const getMetricsByUser = catchAsync(async (req: Request, res: Response) => {
  const userId = req.query.user as string;

  if (!userId) {
    throw new AppError(400, 'User ID is required');
  }

  const result = await MetricServices.getMetricsByUserFromDB(userId, req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Metrics retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});

const getMetricById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await MetricServices.getMetricByIdFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Metric retrieved successfully',
    data: result,
  });
});

const updateMetric = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await MetricServices.updateMetricIntoDB(id, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Metric updated successfully',
    data: result,
  });
});

const deleteMetric = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await MetricServices.deleteMetricFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Metric deleted successfully',
    data: result,
  });
});

export const MetricControllers = {
  createMetric,
  getMyMetrics,
  getMetricsByUser,
  getMetricById,
  updateMetric,
  deleteMetric,
};
