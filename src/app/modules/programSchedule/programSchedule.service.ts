import mongoose from 'mongoose';
import AppError from '../../errors/AppError';
import { TProgramScheduledExercise } from './programSchedule.interface';
import { ProgramSchedule } from './programSchedule.model';
import { verifyProgram, verifyExercises } from './programSchedule.utils';
import { User } from '../user/user.model';

// Creating a new schedule — assigning an exercise for the first time on a specific date.
const createProgramScheduleIntoDB = async (
  trainerId: string,
  payload: {
    user: string;
    program: string;
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

  if (!payload.program || !mongoose.Types.ObjectId.isValid(payload.program)) {
    throw new AppError(400, 'Invalid program ID');
  }

  await verifyProgram(trainerId, payload.user, payload.program);

  await verifyExercises(
    trainerId,
    payload.user,
    payload.program,
    payload.exercises,
  );

  const isScheduleExists = await ProgramSchedule.findOne({
    trainer: trainerId,
    user: payload.user,
    program: payload.program,
    date: payload.date,
  });

  if (isScheduleExists) {
    throw new AppError(
      400,
      'A schedule already exists for this date. Use the add-exercise endpoint instead.',
    );
  }

  const scheduledExercises: TProgramScheduledExercise[] = payload.exercises.map(
    (exerciseId) => ({
      exercise: exerciseId as any,
      isCompleted: false,
    }),
  );

  const result = await ProgramSchedule.create({
    trainer: trainerId,
    user: payload.user,
    program: payload.program,
    exercises: scheduledExercises,
    date: payload.date,
  });

  if (!result) {
    throw new AppError(400, 'Failed to create schedule');
  }

  return result;
};

// Adding a new exercise to an existing schedule (for the same date) — excluding duplicates.
const addExerciseToProgramScheduleIntoDB = async (
  scheduleId: string,
  trainerId: string,
  exerciseIds: string[],
) => {
  if (!scheduleId || !mongoose.Types.ObjectId.isValid(scheduleId)) {
    throw new AppError(400, 'Invalid schedule ID');
  }

  const schedule = await ProgramSchedule.findOne({
    _id: scheduleId,
    trainer: trainerId,
  });

  if (!schedule) {
    throw new AppError(404, 'Schedule not found');
  }

  await verifyExercises(
    trainerId,
    schedule.user.toString(),
    schedule.program.toString(),
    exerciseIds,
  );

  const existingIds = schedule.exercises.map((e) =>
    (e.exercise as any).toString(),
  );

  const newExerciseIds = exerciseIds.filter((id) => !existingIds.includes(id));

  const newScheduledExercises: TProgramScheduledExercise[] = newExerciseIds.map(
    (exerciseId) => ({
      exercise: exerciseId as any,
      isCompleted: false,
    }),
  );

  schedule.exercises.push(...(newScheduledExercises as any));
  await schedule.save();

  return schedule;
};

const getAllProgramSchedulesFromDB = async (
  userId: string,
  programId: string,
) => {
  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    throw new AppError(400, 'Invalid user ID');
  }

  if (!programId || !mongoose.Types.ObjectId.isValid(programId)) {
    throw new AppError(400, 'Invalid program ID');
  }

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const result = await ProgramSchedule.find({
    user: userId,
    program: programId,
    date: { $gte: todayStart },
  })
    .populate('program')
    .populate('exercises.exercise')
    .sort({ date: 1 });

  return result;
};

const getProgramScheduleByDateFromDB = async (
  userId: string,
  programId: string,
  date: string,
) => {
  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    throw new AppError(400, 'Invalid user ID');
  }

  if (!programId || !mongoose.Types.ObjectId.isValid(programId)) {
    throw new AppError(400, 'Invalid program ID');
  }

  const targetDate = new Date(date);

  if (isNaN(targetDate.getTime())) {
    throw new AppError(400, 'Invalid date');
  }

  targetDate.setHours(0, 0, 0, 0);

  const nextDate = new Date(targetDate);
  nextDate.setDate(nextDate.getDate() + 1);

  const result = await ProgramSchedule.findOne({
    user: userId,
    program: programId,
    date: { $gte: targetDate, $lt: nextDate },
  })
    .populate('program')
    .populate('exercises.exercise');

  return result;
};

const getTodayScheduleForUserFromDB = async (
  userId: string,
  programId: string,
) => {
  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    throw new AppError(400, 'Invalid user ID');
  }

  if (!programId || !mongoose.Types.ObjectId.isValid(programId)) {
    throw new AppError(400, 'Invalid program ID');
  }

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayEnd = new Date(todayStart);
  todayEnd.setDate(todayEnd.getDate() + 1);

  const result = await ProgramSchedule.findOne({
    user: userId,
    program: programId,
    date: { $gte: todayStart, $lt: todayEnd },
  })
    .populate('program')
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

  const schedule = await ProgramSchedule.findOne({
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

const removeExerciseFromProgramScheduleIntoDB = async (
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

  const schedule = await ProgramSchedule.findOne({
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
    await ProgramSchedule.findByIdAndDelete(scheduleId);

    return null;
  }

  schedule.exercises = schedule.exercises.filter(
    (e) => (e.exercise as any).toString() !== exerciseId,
  ) as any;

  await schedule.save();

  return schedule;
};

const updateProgramScheduledExerciseFeedbackIntoDB = async (
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

  const schedule = await ProgramSchedule.findOne({
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

export const ProgramScheduleServices = {
  createProgramScheduleIntoDB,
  addExerciseToProgramScheduleIntoDB,
  getAllProgramSchedulesFromDB,
  getProgramScheduleByDateFromDB,
  getTodayScheduleForUserFromDB,
  getSingleScheduledExerciseFromDB,
  removeExerciseFromProgramScheduleIntoDB,
  updateProgramScheduledExerciseFeedbackIntoDB,
};
