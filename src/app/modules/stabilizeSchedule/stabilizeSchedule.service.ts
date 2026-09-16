import mongoose from 'mongoose';
import AppError from '../../errors/AppError';
import { TStabilizeScheduledExercise } from './stabilizeSchedule.interface';
import { StabilizeSchedule } from './stabilizeSchedule.model';
import { verifyCategory, verifyExercises } from './stabilizeSchedule.utils';
import { User } from '../user/user.model';

// Creating a new schedule — assigning an exercise for the first time on a specific date.
const createStabilizeScheduleIntoDB = async (
  trainerId: string,
  payload: {
    user: string;
    category: string;
    exercises: string[];
    date: Date;
  },
) => {
  if (!payload.user || !mongoose.Types.ObjectId.isValid(payload.user)) {
    throw new AppError(400, 'Invalid user ID');
  }

  const user = await User.findById(payload.user);
  if (!user) {
    throw new AppError(404, 'User not found');
  }

  if (!payload.category || !mongoose.Types.ObjectId.isValid(payload.category)) {
    throw new AppError(400, 'Invalid category ID');
  }

  await verifyCategory(trainerId, payload.user, payload.category);

  await verifyExercises(
    trainerId,
    payload.user,
    payload.category,
    payload.exercises,
  );

  const isScheduleExists = await StabilizeSchedule.findOne({
    trainer: trainerId,
    user: payload.user,
    category: payload.category,
    date: payload.date,
  });

  if (isScheduleExists) {
    throw new AppError(
      400,
      'A schedule already exists for this date. Use the add-exercise endpoint instead.',
    );
  }

  const scheduledExercises: TStabilizeScheduledExercise[] =
    payload.exercises.map((exerciseId) => ({
      exercise: exerciseId as any,
      isCompleted: false,
    }));

  const result = await StabilizeSchedule.create({
    trainer: trainerId,
    user: payload.user,
    category: payload.category,
    exercises: scheduledExercises,
    date: payload.date,
  });

  if (!result) {
    throw new AppError(400, 'Failed to create schedule');
  }

  return result;
};

// Adding a new exercise to an existing schedule (for the same date) — excluding duplicates.
const addExerciseToStabilizeScheduleIntoDB = async (
  scheduleId: string,
  trainerId: string,
  exerciseIds: string[],
) => {
  if (!scheduleId || !mongoose.Types.ObjectId.isValid(scheduleId)) {
    throw new AppError(400, 'Invalid schedule ID');
  }

  const schedule = await StabilizeSchedule.findOne({
    _id: scheduleId,
    trainer: trainerId,
  });

  if (!schedule) {
    throw new AppError(404, 'Schedule not found');
  }

  await verifyExercises(
    trainerId,
    schedule.user.toString(),
    schedule.category.toString(),
    exerciseIds,
  );

  const existingIds = schedule.exercises.map((e) =>
    (e.exercise as any).toString(),
  );

  const newExerciseIds = exerciseIds.filter((id) => !existingIds.includes(id));

  const newScheduledExercises: TStabilizeScheduledExercise[] =
    newExerciseIds.map((exerciseId) => ({
      exercise: exerciseId as any,
      isCompleted: false,
    }));

  schedule.exercises.push(...(newScheduledExercises as any));
  await schedule.save();

  return schedule;
};

const getAllStabilizeSchedulesFromDB = async (
  userId: string,
  categoryId: string,
) => {
  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    throw new AppError(400, 'Invalid user ID');
  }

  if (!categoryId || !mongoose.Types.ObjectId.isValid(categoryId)) {
    throw new AppError(400, 'Invalid category ID');
  }

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const result = await StabilizeSchedule.find({
    user: userId,
    category: categoryId,
    date: { $gte: todayStart },
  })
    .populate('category')
    .populate('exercises.exercise')
    .sort({ date: 1 });

  return result;
};

const getStabilizeScheduleByDateFromDB = async (
  userId: string,
  categoryId: string,
  date: string,
) => {
  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    throw new AppError(400, 'Invalid user ID');
  }

  if (!categoryId || !mongoose.Types.ObjectId.isValid(categoryId)) {
    throw new AppError(400, 'Invalid category ID');
  }

  const targetDate = new Date(date);

  if (isNaN(targetDate.getTime())) {
    throw new AppError(400, 'Invalid date');
  }

  targetDate.setHours(0, 0, 0, 0);

  const nextDate = new Date(targetDate);
  nextDate.setDate(nextDate.getDate() + 1);

  const result = await StabilizeSchedule.findOne({
    user: userId,
    category: categoryId,
    date: { $gte: targetDate, $lt: nextDate },
  })
    .populate('category')
    .populate('exercises.exercise');

  return result;
};

const getSingleScheduledExerciseFromDB = async (
  scheduleId: string,
  exerciseId: string,
) => {
  if (!scheduleId || !mongoose.Types.ObjectId.isValid(scheduleId)) {
    throw new AppError(400, 'Invalid schedule ID');
  }

  if (!exerciseId || !mongoose.Types.ObjectId.isValid(exerciseId)) {
    throw new AppError(400, 'Invalid exercise ID');
  }

  const schedule = await StabilizeSchedule.findOne({
    _id: scheduleId,
  }).populate('exercises.exercise');

  if (!schedule) {
    throw new AppError(404, 'Schedule not found');
  }

  const scheduledExercise = schedule.exercises.find(
    (e) => (e.exercise as any)._id.toString() === exerciseId,
  );

  if (!scheduledExercise) {
    throw new AppError(404, 'Exercise not found in this schedule');
  }

  return scheduledExercise;
};

const removeExerciseFromStabilizeScheduleIntoDB = async (
  scheduleId: string,
  trainerId: string,
  exerciseId: string,
) => {
  if (!scheduleId || !mongoose.Types.ObjectId.isValid(scheduleId)) {
    throw new AppError(400, 'Invalid schedule ID');
  }

  if (!exerciseId || !mongoose.Types.ObjectId.isValid(exerciseId)) {
    throw new AppError(400, 'Invalid exercise ID');
  }

  const schedule = await StabilizeSchedule.findOne({
    _id: scheduleId,
    trainer: trainerId,
  });

  if (!schedule) {
    throw new AppError(404, 'Schedule not found');
  }

  const exerciseExists = schedule.exercises.some(
    (e) => (e.exercise as any).toString() === exerciseId,
  );

  if (!exerciseExists) {
    throw new AppError(404, 'Exercise not found in this schedule');
  }

  if (schedule.exercises.length === 1) {
    throw new AppError(
      400,
      'Cannot remove the last exercise. Delete the schedule instead.',
    );
  }

  schedule.exercises = schedule.exercises.filter(
    (e) => (e.exercise as any).toString() !== exerciseId,
  ) as any;

  await schedule.save();

  return schedule;
};

const updateStabilizeScheduledExerciseFeedbackIntoDB = async (
  scheduleId: string,
  userId: string,
  payload: {
    exerciseId: string;
    ratePerceivedExertion?: number;
    clientFeedback?: string;
  },
) => {
  if (!scheduleId || !mongoose.Types.ObjectId.isValid(scheduleId)) {
    throw new AppError(400, 'Invalid schedule ID');
  }

  if (
    !payload.exerciseId ||
    !mongoose.Types.ObjectId.isValid(payload.exerciseId)
  ) {
    throw new AppError(400, 'Invalid exercise ID');
  }

  const schedule = await StabilizeSchedule.findOne({
    _id: scheduleId,
    user: userId,
  });

  if (!schedule) {
    throw new AppError(404, 'Schedule not found');
  }

  const exerciseEntry = schedule.exercises.find(
    (e) => (e.exercise as any).toString() === payload.exerciseId,
  );

  if (!exerciseEntry) {
    throw new AppError(404, 'Exercise not found in this schedule');
  }

  exerciseEntry.isCompleted = true;

  if (payload.ratePerceivedExertion !== undefined) {
    exerciseEntry.ratePerceivedExertion = payload.ratePerceivedExertion;
  }

  if (payload.clientFeedback !== undefined) {
    exerciseEntry.clientFeedback = payload.clientFeedback;
  }

  await schedule.save();

  return schedule;
};

const deleteStabilizeScheduleFromDB = async (id: string) => {
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(400, 'Invalid schedule ID');
  }

  const isScheduleExists = await StabilizeSchedule.findById(id);

  if (!isScheduleExists) {
    throw new AppError(404, 'Schedule not found');
  }

  const result = await StabilizeSchedule.findByIdAndDelete(id);

  if (!result) {
    throw new AppError(400, 'Failed to delete schedule');
  }

  return result;
};

export const StabilizeScheduleServices = {
  createStabilizeScheduleIntoDB,
  addExerciseToStabilizeScheduleIntoDB,
  getAllStabilizeSchedulesFromDB,
  getStabilizeScheduleByDateFromDB,
  getSingleScheduledExerciseFromDB,
  removeExerciseFromStabilizeScheduleIntoDB,
  updateStabilizeScheduledExerciseFeedbackIntoDB,
  deleteStabilizeScheduleFromDB,
};
