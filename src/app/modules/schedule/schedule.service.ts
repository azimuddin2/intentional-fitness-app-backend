import mongoose from 'mongoose';
import AppError from '../../errors/AppError';
import {
  TScheduledExercise,
  TSourceType,
  TExerciseSourceType,
} from './schedule.interface';
import { Schedule } from './schedule.model';
import { verifyExercises, verifySource } from './schedule.utils';

const createScheduleIntoDB = async (
  trainerId: string,
  payload: {
    user: string;
    sourceType: TSourceType;
    source: string;
    exerciseSourceType: TExerciseSourceType;
    exercises: string[];
    date: Date;
  },
) => {
  if (!payload.user || !mongoose.Types.ObjectId.isValid(payload.user)) {
    throw new AppError(400, 'Invalid user ID');
  }

  if (!payload.source || !mongoose.Types.ObjectId.isValid(payload.source)) {
    throw new AppError(400, 'Invalid source ID');
  }

  await verifySource(
    trainerId,
    payload.user,
    payload.sourceType,
    payload.source,
  );

  await verifyExercises(
    trainerId,
    payload.user,
    payload.source,
    payload.exerciseSourceType,
    payload.exercises,
  );

  const isScheduleExists = await Schedule.findOne({
    trainer: trainerId,
    user: payload.user,
    source: payload.source,
    date: payload.date,
    isDeleted: false,
  });

  if (isScheduleExists) {
    throw new AppError(
      400,
      'A schedule already exists for this date. Use the add-exercise endpoint instead.',
    );
  }

  const scheduledExercises: TScheduledExercise[] = payload.exercises.map(
    (exerciseId) => ({
      exercise: exerciseId as any,
      exerciseSourceType: payload.exerciseSourceType,
      isCompleted: false,
    }),
  );

  const result = await Schedule.create({
    trainer: trainerId,
    user: payload.user,
    sourceType: payload.sourceType,
    source: payload.source,
    exercises: scheduledExercises,
    date: payload.date,
  });

  if (!result) {
    throw new AppError(400, 'Failed to create schedule');
  }

  return result;
};

const addExerciseToScheduleIntoDB = async (
  scheduleId: string,
  trainerId: string,
  exerciseSourceType: TExerciseSourceType,
  exerciseIds: string[],
) => {
  if (!scheduleId || !mongoose.Types.ObjectId.isValid(scheduleId)) {
    throw new AppError(400, 'Invalid schedule ID');
  }

  const schedule = await Schedule.findOne({
    _id: scheduleId,
    trainer: trainerId,
    isDeleted: false,
  });

  if (!schedule) {
    throw new AppError(404, 'Schedule not found');
  }

  await verifyExercises(
    trainerId,
    schedule.user.toString(),
    schedule.source.toString(),
    exerciseSourceType,
    exerciseIds,
  );

  const existingIds = schedule.exercises.map((e) =>
    (e.exercise as any).toString(),
  );

  const newExerciseIds = exerciseIds.filter((id) => !existingIds.includes(id));

  const newScheduledExercises: TScheduledExercise[] = newExerciseIds.map(
    (exerciseId) => ({
      exercise: exerciseId as any,
      exerciseSourceType,
      isCompleted: false,
    }),
  );

  schedule.exercises.push(...(newScheduledExercises as any));
  await schedule.save();

  return schedule;
};

const removeExerciseFromScheduleIntoDB = async (
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

  const schedule = await Schedule.findOne({
    _id: scheduleId,
    trainer: trainerId,
    isDeleted: false,
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

const getScheduleByDateFromDB = async (
  clientId: string,
  sourceId: string,
  date: string,
) => {
  if (!clientId || !mongoose.Types.ObjectId.isValid(clientId)) {
    throw new AppError(400, 'Invalid client ID');
  }

  if (!sourceId || !mongoose.Types.ObjectId.isValid(sourceId)) {
    throw new AppError(400, 'Invalid source ID');
  }

  const targetDate = new Date(date);

  if (isNaN(targetDate.getTime())) {
    throw new AppError(400, 'Invalid date');
  }

  targetDate.setHours(0, 0, 0, 0);

  const nextDate = new Date(targetDate);
  nextDate.setDate(nextDate.getDate() + 1);

  const result = await Schedule.findOne({
    user: clientId,
    source: sourceId,
    date: { $gte: targetDate, $lt: nextDate },
    isDeleted: false,
  })
    .populate('source')
    .populate('exercises.exercise');

  return result;
};

const updateScheduledExerciseFeedbackIntoDB = async (
  scheduleId: string,
  clientId: string,
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

  const schedule = await Schedule.findOne({
    _id: scheduleId,
    user: clientId,
    isDeleted: false,
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

const deleteScheduleFromDB = async (id: string) => {
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(400, 'Invalid schedule ID');
  }

  const isScheduleExists = await Schedule.findById(id);

  if (!isScheduleExists) {
    throw new AppError(404, 'Schedule not found');
  }

  if (isScheduleExists.isDeleted) {
    throw new AppError(400, 'Schedule is already deleted');
  }

  const result = await Schedule.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );

  if (!result) {
    throw new AppError(400, 'Failed to delete schedule');
  }

  return result;
};

export const ScheduleServices = {
  createScheduleIntoDB,
  addExerciseToScheduleIntoDB,
  removeExerciseFromScheduleIntoDB,
  getScheduleByDateFromDB,
  updateScheduledExerciseFeedbackIntoDB,
  deleteScheduleFromDB,
};
