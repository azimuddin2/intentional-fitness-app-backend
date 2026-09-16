import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ProgramScheduleServices } from './programSchedule.service';

const createProgramSchedule = catchAsync(
  async (req: Request, res: Response) => {
    const trainerId = req.user.userId;

    const result = await ProgramScheduleServices.createProgramScheduleIntoDB(
      trainerId,
      req.body,
    );

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: 'Exercises scheduled successfully for the selected date',
      data: result,
    });
  },
);

const addExerciseToProgramSchedule = catchAsync(
  async (req: Request, res: Response) => {
    const { scheduleId } = req.params;
    const trainerId = req.user.userId;

    const result =
      await ProgramScheduleServices.addExerciseToProgramScheduleIntoDB(
        scheduleId,
        trainerId,
        req.body.exercises,
      );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Exercise added to schedule successfully',
      data: result,
    });
  },
);

const getAllProgramSchedules = catchAsync(
  async (req: Request, res: Response) => {
    const { userId, programId } = req.params;
    const result = await ProgramScheduleServices.getAllProgramSchedulesFromDB(
      userId,
      programId,
    );
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'All upcoming schedules fetched successfully',
      data: result,
    });
  },
);

const getProgramScheduleByDate = catchAsync(
  async (req: Request, res: Response) => {
    const { userId, programId } = req.params;
    const { date } = req.query;
    const result = await ProgramScheduleServices.getProgramScheduleByDateFromDB(
      userId,
      programId,
      date as string,
    );
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Schedule retrieved successfully',
      data: result,
    });
  },
);

const getTodayScheduleForUser = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user.userId;
    const { programId } = req.params;

    const result = await ProgramScheduleServices.getTodayScheduleForUserFromDB(
      userId,
      programId,
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Today's exercises fetched successfully",
      data: result,
    });
  },
);

const getSingleScheduledExercise = catchAsync(
  async (req: Request, res: Response) => {
    const { scheduleId, exerciseId } = req.params;

    const result =
      await ProgramScheduleServices.getSingleScheduledExerciseFromDB(
        scheduleId,
        exerciseId,
      );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Exercise fetched successfully',
      data: result,
    });
  },
);

const removeExerciseFromProgramSchedule = catchAsync(
  async (req: Request, res: Response) => {
    const { scheduleId } = req.params;
    const { exerciseId } = req.body;
    const trainerId = req.user.userId;

    const result =
      await ProgramScheduleServices.removeExerciseFromProgramScheduleIntoDB(
        scheduleId,
        trainerId,
        exerciseId,
      );
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Exercise removed from schedule successfully',
      data: result,
    });
  },
);

const updateProgramScheduledExerciseFeedback = catchAsync(
  async (req: Request, res: Response) => {
    const { scheduleId } = req.params;
    const userId = req.user.userId;
    const result =
      await ProgramScheduleServices.updateProgramScheduledExerciseFeedbackIntoDB(
        scheduleId,
        userId,
        req.body,
      );
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Feedback submitted successfully',
      data: result,
    });
  },
);

export const ProgramScheduleControllers = {
  createProgramSchedule,
  addExerciseToProgramSchedule,
  getAllProgramSchedules,
  getProgramScheduleByDate,
  getTodayScheduleForUser,
  getSingleScheduledExercise,
  removeExerciseFromProgramSchedule,
  updateProgramScheduledExerciseFeedback,
};
