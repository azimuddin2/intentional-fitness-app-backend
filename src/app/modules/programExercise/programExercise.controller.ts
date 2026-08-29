import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ProgramExerciseServices } from './programExercise.service';

const createProgramExercise = catchAsync(
  async (req: Request, res: Response) => {
    const trainerId = req.user.userId;

    const result = await ProgramExerciseServices.createProgramExerciseIntoDB(
      trainerId,
      req.body,
      req.file,
    );

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: 'Program exercise created successfully',
      data: result,
    });
  },
);

const getProgramExercisesForClient = catchAsync(
  async (req: Request, res: Response) => {
    const { clientId, programId } = req.params;

    const result =
      await ProgramExerciseServices.getProgramExercisesForClientFromDB(
        clientId,
        programId,
        req.query,
      );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Program exercises retrieved successfully',
      data: result,
    });
  },
);

const getProgramExerciseById = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const result =
      await ProgramExerciseServices.getProgramExerciseByIdFromDB(id);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Program exercise retrieved successfully',
      data: result,
    });
  },
);

const updateProgramExercise = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await ProgramExerciseServices.updateProgramExerciseIntoDB(
      id,
      req.body,
      req.file,
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Program exercise updated successfully',
      data: result,
    });
  },
);

const deleteProgramExercise = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result =
      await ProgramExerciseServices.deleteProgramExerciseFromDB(id);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Program exercise deleted successfully',
      data: result,
    });
  },
);

export const ProgramExerciseControllers = {
  createProgramExercise,
  getProgramExercisesForClient,
  getProgramExerciseById,
  updateProgramExercise,
  deleteProgramExercise,
};
