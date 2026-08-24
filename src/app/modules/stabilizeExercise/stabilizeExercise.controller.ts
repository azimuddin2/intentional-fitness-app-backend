import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { StabilizeExerciseServices } from './stabilizeExercise.service';

const createStabilizeExercise = catchAsync(
  async (req: Request, res: Response) => {
    const trainerId = req.user.userId;

    const result =
      await StabilizeExerciseServices.createStabilizeExerciseIntoDB(
        trainerId,
        req.body,
        req.files,
      );

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: 'Stabilize exercise created successfully',
      data: result,
    });
  },
);

const getStabilizeExercisesForClient = catchAsync(
  async (req: Request, res: Response) => {
    const { clientId, categoryId } = req.params;

    const result =
      await StabilizeExerciseServices.getStabilizeExercisesForClientFromDB(
        clientId,
        categoryId,
      );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Stabilize exercises retrieved successfully',
      data: result,
    });
  },
);

const getStabilizeExerciseById = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result =
      await StabilizeExerciseServices.getStabilizeExerciseByIdFromDB(id);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Stabilize exercise retrieved successfully',
      data: result,
    });
  },
);

const updateStabilizeExercise = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result =
      await StabilizeExerciseServices.updateStabilizeExerciseIntoDB(
        id,
        req.body,
        req.files,
      );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Stabilize exercise updated successfully',
      data: result,
    });
  },
);

const deleteStabilizeExercise = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result =
      await StabilizeExerciseServices.deleteStabilizeExerciseFromDB(id);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Stabilize exercise deleted successfully',
      data: result,
    });
  },
);

export const StabilizeExerciseControllers = {
  createStabilizeExercise,
  getStabilizeExercisesForClient,
  getStabilizeExerciseById,
  updateStabilizeExercise,
  deleteStabilizeExercise,
};
