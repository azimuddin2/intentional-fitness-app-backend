import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { TrainingProgramServices } from './trainingProgram.service';
import AppError from '../../errors/AppError';

const createTrainingProgram = catchAsync(
  async (req: Request, res: Response) => {
    const trainerId = req.user.userId;

    const result = await TrainingProgramServices.createTrainingProgramIntoDB(
      trainerId,
      req.body,
    );

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: 'Training program created successfully',
      data: result,
    });
  },
);

const getTrainingProgramsByTrainer = catchAsync(
  async (req: Request, res: Response) => {
    const trainerId = req.user.userId;

    if (!trainerId) {
      throw new AppError(400, 'Trainer ID is required');
    }

    const result =
      await TrainingProgramServices.getTrainingProgramsByTrainerFromDB(
        trainerId,
        req.query,
      );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Training programs retrieved successfully',
      meta: result.meta,
      data: result.result,
    });
  },
);

const getTrainingProgramById = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result =
      await TrainingProgramServices.getTrainingProgramByIdFromDB(id);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Training program retrieved successfully',
      data: result,
    });
  },
);

const updateTrainingProgram = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await TrainingProgramServices.updateTrainingProgramIntoDB(
      id,
      req.body,
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Training program updated successfully',
      data: result,
    });
  },
);

const deleteTrainingProgram = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result =
      await TrainingProgramServices.deleteTrainingProgramFromDB(id);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Training program deleted successfully',
      data: result,
    });
  },
);

export const TrainingProgramControllers = {
  createTrainingProgram,
  getTrainingProgramsByTrainer,
  getTrainingProgramById,
  updateTrainingProgram,
  deleteTrainingProgram,
};
