import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { StabilizeCategoryServices } from './stabilizeCategory.service';
import AppError from '../../errors/AppError';

const createStabilizeCategory = catchAsync(
  async (req: Request, res: Response) => {
    const trainerId = req.user.userId;

    const result =
      await StabilizeCategoryServices.createStabilizeCategoryIntoDB(
        trainerId,
        req.body,
      );

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: 'Stabilize category created successfully',
      data: result,
    });
  },
);

const getStabilizeCategoriesByTrainer = catchAsync(
  async (req: Request, res: Response) => {
    const trainerId = req.user.userId;

    if (!trainerId) {
      throw new AppError(400, 'Trainer ID is required');
    }

    const result =
      await StabilizeCategoryServices.getStabilizeCategoriesByTrainerFromDB(
        trainerId,
        req.query,
      );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Stabilize categories retrieved successfully',
      meta: result.meta,
      data: result.result,
    });
  },
);

const getStabilizeCategoryById = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result =
      await StabilizeCategoryServices.getStabilizeCategoryByIdFromDB(id);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Stabilize category retrieved successfully',
      data: result,
    });
  },
);

const updateStabilizeCategory = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result =
      await StabilizeCategoryServices.updateStabilizeCategoryIntoDB(
        id,
        req.body,
      );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Stabilize category updated successfully',
      data: result,
    });
  },
);

const deleteStabilizeCategory = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result =
      await StabilizeCategoryServices.deleteStabilizeCategoryFromDB(id);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Stabilize category deleted successfully',
      data: result,
    });
  },
);

export const StabilizeCategoryControllers = {
  createStabilizeCategory,
  getStabilizeCategoriesByTrainer,
  getStabilizeCategoryById,
  updateStabilizeCategory,
  deleteStabilizeCategory,
};
