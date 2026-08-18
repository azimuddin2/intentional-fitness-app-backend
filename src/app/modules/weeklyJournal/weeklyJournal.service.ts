import mongoose from 'mongoose';
import AppError from '../../errors/AppError';
import QueryBuilder from '../../builder/QueryBuilder';
import { WeeklyJournal } from './weeklyJournal.model';
import { User } from '../user/user.model';
import { TWellnessStatus } from './weeklyJournal.interface';
import { WeeklyJournalTask } from '../weeklyJournalTask/weeklyJournalTask.model';

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

  /* ____________________ BLOCK IF AN ACTIVE WEEK ALREADY EXISTS ____________________ */
  const existingCurrentWeek = await WeeklyJournal.findOne({
    client: clientId,
    isCurrent: true,
    isDeleted: false,
  });

  if (existingCurrentWeek) {
    throw new AppError(
      400,
      `You already have an active week (Week ${existingCurrentWeek.weekNumber}). Please complete it before adding a new one.`,
    );
  }

  /* ____________________ FIND LAST WEEK (FOR NUMBERING/DATES) ____________________ */
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

  const tasks = await WeeklyJournalTask.find({
    trainer: trainerId,
    isDeleted: false,
  });

  const tasksTemplate = tasks.map((task) => ({
    task: task._id,
    completed: false,
  }));

  const dailyEntries = Array.from({ length: 7 }, (_, i) => ({
    date: new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000),
    notes: '',
    tasks: tasksTemplate,
    wellness: {},
    isSubmitted: false,
  }));

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
    }),
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
  }).populate('dailyEntries.tasks.task', 'name');

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
    tasks: { task: string; completed: boolean }[];
    wellness?: {
      sleepQuality?: TWellnessStatus;
      emotionalStresses?: TWellnessStatus;
      foodQuality?: TWellnessStatus;
    };
  },
) => {
  /* ____________________ VALIDATE IDS ____________________ */
  if (!weekId || !mongoose.Types.ObjectId.isValid(weekId)) {
    throw new AppError(400, 'Invalid week ID');
  }

  /* ____________________ VALIDATE DATE ____________________ */
  const parsedDate = new Date(payload.date);

  if (isNaN(parsedDate.getTime())) {
    throw new AppError(400, 'Invalid date format');
  }

  const entryDate = parsedDate.toISOString().split('T')[0];

  /* ____________________ VALIDATE OWNERSHIP ____________________ */
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

  /* ____________________ FIND TARGET DAILY ENTRY ____________________ */
  const entryIndex = week.dailyEntries.findIndex(
    (entry) => entry.date.toISOString().split('T')[0] === entryDate,
  );

  if (entryIndex === -1) {
    throw new AppError(404, 'Daily entry not found for this date');
  }

  const targetEntry = week.dailyEntries[entryIndex];

  /* ____________________ VALIDATE TASK IDS BELONG TO THIS ENTRY ____________________ */
  const existingTaskIds = targetEntry.tasks.map((t) => t.task.toString());

  const hasInvalidTask = payload.tasks.some(
    (t) => !existingTaskIds.includes(t.task),
  );

  if (hasInvalidTask) {
    throw new AppError(400, 'One or more tasks do not belong to this entry');
  }

  /* ____________________ MERGE TASKS (keep unmatched tasks unchanged) ____________________ */
  const updatedTasks = targetEntry.tasks.map((existingTask) => {
    const matchedTask = payload.tasks.find(
      (t) => t.task === existingTask.task.toString(),
    );

    return matchedTask
      ? { task: existingTask.task, completed: matchedTask.completed }
      : existingTask;
  });

  try {
    /* ____________________ UPDATE DAILY ENTRY ____________________ */
    targetEntry.notes = payload.notes ?? targetEntry.notes;
    targetEntry.tasks = updatedTasks as typeof targetEntry.tasks;
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
