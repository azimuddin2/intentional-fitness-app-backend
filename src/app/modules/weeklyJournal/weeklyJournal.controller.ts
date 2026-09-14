import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { WeeklyJournalServices } from './weeklyJournal.service';

const createNewWeek = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.userId;
  const result = await WeeklyJournalServices.createNewWeekIntoDB(userId);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'New week created successfully',
    data: result,
  });
});

const getMyWeeks = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.userId;

  const result = await WeeklyJournalServices.getAllWeeksFromDB(
    userId,
    req.query,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Weekly journals retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});

const getWeeksByUserId = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;

  if (!userId) {
    throw new Error('User ID is required');
  }

  const result = await WeeklyJournalServices.getAllWeeksFromDB(
    userId,
    req.query,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Weekly journals retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});

const getSingleWeek = catchAsync(async (req: Request, res: Response) => {
  const { weekId } = req.params;

  const result = await WeeklyJournalServices.getSingleWeekFromDB(weekId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Week retrieved successfully',
    data: result,
  });
});

const updateWeekSummary = catchAsync(async (req: Request, res: Response) => {
  const { weekId } = req.params;
  const userId = req.user.userId;

  const result = await WeeklyJournalServices.updateWeekSummaryIntoDB(
    weekId,
    userId,
    req.body,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Week summary updated successfully',
    data: result,
  });
});

const submitDailyEntry = catchAsync(async (req: Request, res: Response) => {
  const { weekId } = req.params;
  const userId = req.user.userId;

  const result = await WeeklyJournalServices.submitDailyEntryIntoDB(
    weekId,
    userId,
    req.body,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Daily entry submitted successfully',
    data: result,
  });
});

export const WeeklyJournalController = {
  createNewWeek,
  getMyWeeks,
  getWeeksByUserId,
  getSingleWeek,
  updateWeekSummary,

  submitDailyEntry,
};
