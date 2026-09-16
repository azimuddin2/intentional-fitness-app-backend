import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { StabilizeScheduleServices } from './stabilizeSchedule.service';

const createStabilizeSchedule = catchAsync(
  async (req: Request, res: Response) => {
    const trainerId = req.user.userId;

    const result =
      await StabilizeScheduleServices.createStabilizeScheduleIntoDB(
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

const addExerciseToStabilizeSchedule = catchAsync(
  async (req: Request, res: Response) => {
    const { scheduleId } = req.params;
    const trainerId = req.user.userId;

    const result =
      await StabilizeScheduleServices.addExerciseToStabilizeScheduleIntoDB(
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

const getAllStabilizeSchedules = catchAsync(
  async (req: Request, res: Response) => {
    const { userId, categoryId } = req.params;
    const result =
      await StabilizeScheduleServices.getAllStabilizeSchedulesFromDB(
        userId,
        categoryId,
      );
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'All upcoming schedules fetched successfully',
      data: result,
    });
  },
);

const getStabilizeScheduleByDate = catchAsync(
  async (req: Request, res: Response) => {
    const { userId, categoryId } = req.params;
    const { date } = req.query;
    const result =
      await StabilizeScheduleServices.getStabilizeScheduleByDateFromDB(
        userId,
        categoryId,
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
    const { categoryId } = req.params;

    const result =
      await StabilizeScheduleServices.getTodayScheduleForUserFromDB(
        userId,
        categoryId,
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
      await StabilizeScheduleServices.getSingleScheduledExerciseFromDB(
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

const removeExerciseFromStabilizeSchedule = catchAsync(
  async (req: Request, res: Response) => {
    const { scheduleId } = req.params;
    const { exerciseId } = req.body;
    const trainerId = req.user.userId;

    const result =
      await StabilizeScheduleServices.removeExerciseFromStabilizeScheduleIntoDB(
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

const updateStabilizeScheduledExerciseFeedback = catchAsync(
  async (req: Request, res: Response) => {
    const { scheduleId } = req.params;
    const userId = req.user.userId;
    const result =
      await StabilizeScheduleServices.updateStabilizeScheduledExerciseFeedbackIntoDB(
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

export const StabilizeScheduleControllers = {
  createStabilizeSchedule,
  addExerciseToStabilizeSchedule,
  getAllStabilizeSchedules,
  getStabilizeScheduleByDate,
  getTodayScheduleForUser,
  getSingleScheduledExercise,
  removeExerciseFromStabilizeSchedule,
  updateStabilizeScheduledExerciseFeedback,
};
