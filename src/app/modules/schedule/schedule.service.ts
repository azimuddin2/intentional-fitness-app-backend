import AppError from '../../errors/AppError';
import { StabilizeCategory } from '../stabilizeCategory/stabilizeCategory.model';
import { TrainingProgram } from '../trainingProgram/trainingProgram.model';
import { StabilizeExercise } from '../stabilizeExercise/stabilizeExercise.model';
import { ProgramExercise } from '../programExercise/programExercise.model';
import { TSchedule, TScheduledExercise } from './schedule.interface';
import { Schedule } from './schedule.model';

const verifySource = async (trainerId, userId, sourceType, sourceId) => {
  const SourceModel =
    sourceType === 'StabilizeCategory' ? StabilizeCategory : TrainingProgram;
  const source = await SourceModel.findOne({
    _id: sourceId,
    trainer: trainerId,
    user: userId,
    isDeleted: false,
  });
  if (!source) throw new AppError(404, `${sourceType} not found for this user`);
  return source;
};

const verifyExercises = async (
  trainerId,
  userId,
  sourceId,
  exerciseSourceType,
  exerciseIds,
) => {
  const ExerciseModel =
    exerciseSourceType === 'StabilizeExercise'
      ? StabilizeExercise
      : ProgramExercise;
  const sourceField =
    exerciseSourceType === 'StabilizeExercise' ? 'category' : 'program';
  const validExercises = await ExerciseModel.find({
    _id: { $in: exerciseIds },
    trainer: trainerId,
    user: userId,
    [sourceField]: sourceId,
    isDeleted: false,
  });
  if (validExercises.length !== exerciseIds.length) {
    throw new AppError(
      400,
      'One or more exercises are invalid or do not belong to this source',
    );
  }
};

const createScheduleIntoDB = async (trainerId, payload) => {
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

  const scheduledExercises = payload.exercises.map((exerciseId) => ({
    exercise: exerciseId,
    isCompleted: false,
  }));

  const result = await Schedule.create({
    trainer: trainerId,
    user: payload.user,
    sourceType: payload.sourceType,
    source: payload.source,
    exerciseSourceType: payload.exerciseSourceType,
    exercises: scheduledExercises,
    date: payload.date,
  });

  if (!result) throw new AppError(400, 'Failed to create schedule');
  return result;
};

const addExerciseToScheduleIntoDB = async (
  scheduleId,
  trainerId,
  exerciseIds,
) => {
  const schedule = await Schedule.findOne({
    _id: scheduleId,
    trainer: trainerId,
    isDeleted: false,
  });
  if (!schedule) throw new AppError(404, 'Schedule not found');

  await verifyExercises(
    trainerId,
    schedule.user.toString(),
    schedule.source.toString(),
    schedule.exerciseSourceType,
    exerciseIds,
  );

  const existingIds = schedule.exercises.map((e) => e.exercise.toString());
  const newExerciseIds = exerciseIds.filter((id) => !existingIds.includes(id));
  const newScheduledExercises = newExerciseIds.map((exerciseId) => ({
    exercise: exerciseId,
    isCompleted: false,
  }));

  schedule.exercises.push(...newScheduledExercises);
  await schedule.save();
  return schedule;
};

const getScheduleByDateFromDB = async (clientId, sourceId, date) => {
  const targetDate = new Date(date);
  targetDate.setHours(0, 0, 0, 0);
  const nextDate = new Date(targetDate);
  nextDate.setDate(nextDate.getDate() + 1);

  return Schedule.findOne({
    user: clientId,
    source: sourceId,
    date: { $gte: targetDate, $lt: nextDate },
    isDeleted: false,
  })
    .populate('source')
    .populate('exercises.exercise');
};

const updateScheduledExerciseFeedbackIntoDB = async (
  scheduleId,
  clientId,
  payload,
) => {
  const schedule = await Schedule.findOne({
    _id: scheduleId,
    user: clientId,
    isDeleted: false,
  });
  if (!schedule) throw new AppError(404, 'Schedule not found');

  const exerciseEntry = schedule.exercises.find(
    (e) => e.exercise.toString() === payload.exerciseId,
  );
  if (!exerciseEntry)
    throw new AppError(404, 'Exercise not found in this schedule');

  exerciseEntry.isCompleted = true;
  if (payload.ratePerceivedExertion !== undefined)
    exerciseEntry.ratePerceivedExertion = payload.ratePerceivedExertion;
  if (payload.clientFeedback !== undefined)
    exerciseEntry.clientFeedback = payload.clientFeedback;

  await schedule.save();
  return schedule;
};

const deleteScheduleFromDB = async (id) => {
  const isScheduleExists = await Schedule.findById(id);
  if (!isScheduleExists) throw new AppError(404, 'Schedule not found');
  if (isScheduleExists.isDeleted)
    throw new AppError(400, 'Schedule is already deleted');

  const result = await Schedule.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  if (!result) throw new AppError(400, 'Failed to delete schedule');
  return result;
};

export const ScheduleServices = {
  createScheduleIntoDB,
  addExerciseToScheduleIntoDB,
  getScheduleByDateFromDB,
  updateScheduledExerciseFeedbackIntoDB,
  deleteScheduleFromDB,
};
