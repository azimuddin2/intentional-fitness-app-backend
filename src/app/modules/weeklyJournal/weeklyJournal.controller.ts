import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { WeeklyJournalServices } from './weeklyJournal.service';

const createNewWeek = catchAsync(async (req: Request, res: Response) => {
  const clientId = req.user._id;

  const result = await WeeklyJournalServices.createNewWeekIntoDB(clientId);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'New week created successfully',
    data: result,
  });
});

const getAllWeeksByClient = catchAsync(async (req: Request, res: Response) => {
  // role অনুযায়ী clientId ঠিক করা — user হলে নিজের, trainer হলে params থেকে
  const clientId =
    req.user.role === 'trainer' ? req.params.clientId : req.user._id;

  const result = await WeeklyJournalServices.getAllWeeksByClientFromDB(
    clientId,
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

const updateReflection = catchAsync(async (req: Request, res: Response) => {
  const { weekId } = req.params;
  const clientId = req.user._id;

  const result = await WeeklyJournalServices.updateReflectionIntoDB(
    weekId,
    clientId,
    req.body,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Reflection updated successfully',
    data: result,
  });
});

const submitDailyEntry = catchAsync(async (req: Request, res: Response) => {
  const { weekId } = req.params;
  const clientId = req.user._id;

  const result = await WeeklyJournalServices.submitDailyEntryIntoDB(
    weekId,
    clientId,
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
  getAllWeeksByClient,
  getSingleWeek,
  updateReflection,
  submitDailyEntry,
};
