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

const removeExerciseFromStabilizeSchedule = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { exerciseId } = req.body;
    const trainerId = req.user.userId;

    const result =
      await StabilizeScheduleServices.removeExerciseFromStabilizeScheduleIntoDB(
        id,
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

const updateStabilizeScheduledExerciseFeedback = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const clientId = req.user.userId;
    const result =
      await StabilizeScheduleServices.updateStabilizeScheduledExerciseFeedbackIntoDB(
        id,
        clientId,
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

const deleteStabilizeSchedule = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result =
      await StabilizeScheduleServices.deleteStabilizeScheduleFromDB(id);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Schedule deleted successfully',
      data: result,
    });
  },
);

export const StabilizeScheduleControllers = {
  createStabilizeSchedule,
  addExerciseToStabilizeSchedule,
  removeExerciseFromStabilizeSchedule,
  getStabilizeScheduleByDate,
  updateStabilizeScheduledExerciseFeedback,
  deleteStabilizeSchedule,
};
