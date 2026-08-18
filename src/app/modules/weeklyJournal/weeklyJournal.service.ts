import mongoose from 'mongoose';
import AppError from '../../errors/AppError';
import QueryBuilder from '../../builder/QueryBuilder';
import { WeeklyJournal } from './weeklyJournal.model';
import { WeeklyJournalCategory } from '../weeklyJournalCategory/weeklyJournalCategory.model';
import { User } from '../user/user.model';
import { TWellnessStatus } from './weeklyJournal.interface';

const createNewWeekIntoDB = async (clientId: string) => {
  if (!clientId || !mongoose.Types.ObjectId.isValid(clientId)) {
    throw new AppError(400, 'Invalid client ID');
  }

  const client = await User.findById(clientId);

  if (!client) {
    throw new AppError(404, 'Client not found');
  }

  if (client.isDeleted) {
    throw new AppError(400, 'This client account has been deleted');
  }

  if (!client.trainer) {
    throw new AppError(400, 'This client is not linked to any trainer');
  }

  const trainerId = client.trainer;

  const lastWeek = await WeeklyJournal.findOne({
    client: clientId,
    isDeleted: false,
  }).sort({ weekNumber: -1 });

  let weekNumber: number;
  let startDate: Date;

  if (!lastWeek) {
    weekNumber = 1;
    startDate = new Date();
  } else {
    weekNumber = lastWeek.weekNumber + 1;
    startDate = new Date(lastWeek.endDate.getTime() + 24 * 60 * 60 * 1000);
  }

  const endDate = new Date(startDate.getTime() + 6 * 24 * 60 * 60 * 1000);

  const categories = await WeeklyJournalCategory.find({
    trainer: trainerId,
    isDeleted: false,
  });

  const tasksTemplate = categories.map((cat) => ({
    category: cat._id,
    completed: false,
  }));

  const dailyEntries = Array.from({ length: 7 }, (_, i) => ({
    date: new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000),
    notes: '',
    tasks: tasksTemplate,
    wellness: {},
    isSubmitted: false,
  }));

  if (lastWeek) {
    lastWeek.isCurrent = false;
    await lastWeek.save();
  }

  const result = await WeeklyJournal.create({
    client: clientId,
    trainer: trainerId,
    weekNumber,
    startDate,
    endDate,
    dailyEntries,
    isCurrent: true,
  });

  if (!result) {
    throw new AppError(400, 'Failed to create new week');
  }

  return result;
};

const getAllWeeksByClientFromDB = async (
  clientId: string,
  query: Record<string, unknown>,
) => {
  if (!clientId || !mongoose.Types.ObjectId.isValid(clientId)) {
    throw new AppError(400, 'Invalid client ID');
  }

  const weeklyJournalQuery = new QueryBuilder(
    WeeklyJournal.find({
      client: clientId,
      isDeleted: false,
    }).select('weekNumber startDate endDate isCurrent createdAt'),
    query,
  )
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await weeklyJournalQuery.countTotal();
  const result = await weeklyJournalQuery.modelQuery;

  return { meta, result };
};

const getSingleWeekFromDB = async (weekId: string) => {
  if (!weekId || !mongoose.Types.ObjectId.isValid(weekId)) {
    throw new AppError(400, 'Invalid week ID');
  }

  const result = await WeeklyJournal.findOne({
    _id: weekId,
    isDeleted: false,
  }).populate('dailyEntries.tasks.category', 'name');

  if (!result) {
    throw new AppError(404, 'Week not found');
  }

  return result;
};

const updateReflectionIntoDB = async (
  weekId: string,
  clientId: string,
  payload: {
    insightFromSession?: string;
    feelingAfterAppointment?: string;
    goalsQuestionsConcerns?: string;
  },
) => {
  const isWeekExists = await WeeklyJournal.findOne({
    _id: weekId,
    client: clientId,
  });

  if (!isWeekExists) {
    throw new AppError(404, 'Week not found');
  }

  if (isWeekExists.isDeleted) {
    throw new AppError(400, 'This week has been deleted');
  }

  const hasAtLeastOneField = Object.values(payload).some(
    (value) => value !== undefined,
  );

  if (!hasAtLeastOneField) {
    throw new AppError(400, 'At least one field is required to update');
  }

  try {
    const updatedWeek = await WeeklyJournal.findByIdAndUpdate(weekId, payload, {
      new: true,
      runValidators: true,
    });

    if (!updatedWeek) {
      throw new AppError(400, 'Failed to update reflection');
    }

    return updatedWeek;
  } catch (error: any) {
    console.error('updateReflectionIntoDB Error:', error);
    throw new AppError(500, 'Failed to update reflection');
  }
};

const submitDailyEntryIntoDB = async (
  weekId: string,
  clientId: string,
  payload: {
    date: string;
    notes?: string;
    tasks: { category: string; completed: boolean }[];
    wellness?: {
      sleepQuality?: TWellnessStatus;
      emotionalStresses?: TWellnessStatus;
      foodQuality?: TWellnessStatus;
    };
  },
) => {
  const parsedDate = new Date(payload.date);

  if (isNaN(parsedDate.getTime())) {
    throw new AppError(400, 'Invalid date format');
  }

  const entryDate = parsedDate.toISOString().split('T')[0];

  const week = await WeeklyJournal.findOne({
    _id: weekId,
    client: clientId,
  });

  if (!week) {
    throw new AppError(404, 'Week not found');
  }

  if (week.isDeleted) {
    throw new AppError(400, 'This week has been deleted');
  }

  const entryIndex = week.dailyEntries.findIndex(
    (entry) => entry.date.toISOString().split('T')[0] === entryDate,
  );

  if (entryIndex === -1) {
    throw new AppError(404, 'Daily entry not found for this date');
  }

  const targetEntry = week.dailyEntries[entryIndex];

  const existingCategoryIds = targetEntry.tasks.map((t) =>
    t.category.toString(),
  );

  const hasInvalidCategory = payload.tasks.some(
    (t) => !existingCategoryIds.includes(t.category),
  );

  if (hasInvalidCategory) {
    throw new AppError(
      400,
      'One or more task categories do not belong to this entry',
    );
  }

  try {
    const updatedTasks = targetEntry.tasks.map((existingTask) => {
      const matchedTask = payload.tasks.find(
        (t) => t.category === existingTask.category.toString(),
      );

      return matchedTask
        ? { category: existingTask.category, completed: matchedTask.completed }
        : existingTask;
    });

    targetEntry.notes = payload.notes ?? targetEntry.notes;
    targetEntry.tasks = updatedTasks;
    targetEntry.wellness = {
      ...targetEntry.wellness,
      ...payload.wellness,
    };
    targetEntry.isSubmitted = true;

    await week.save();

    return targetEntry;
  } catch (error: any) {
    console.error('submitDailyEntryIntoDB Error:', error);
    throw new AppError(500, 'Failed to submit daily entry');
  }
};

export const WeeklyJournalServices = {
  createNewWeekIntoDB,
  getAllWeeksByClientFromDB,
  getSingleWeekFromDB,
  updateReflectionIntoDB,
  submitDailyEntryIntoDB,
};
