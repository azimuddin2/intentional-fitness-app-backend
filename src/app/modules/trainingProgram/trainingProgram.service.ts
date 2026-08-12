import mongoose from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { TTrainingProgram } from './trainingProgram.interface';
import { TrainingProgram } from './trainingProgram.model';

const createTrainingProgramIntoDB = async (
  trainerId: string,
  payload: TTrainingProgram,
) => {
  const isCategoryExists = await TrainingProgram.findOne({
    name: payload.name,
    trainer: trainerId,
    isDeleted: false,
  });

  if (isCategoryExists) {
    throw new AppError(400, 'Training program already exists for this trainer');
  }

  const result = await TrainingProgram.create({
    ...payload,
    trainer: trainerId,
  });
  if (!result) {
    throw new AppError(400, 'Failed to create training program');
  }

  return result;
};

const getTrainingProgramsByTrainerFromDB = async (
  trainerId: string,
  query: Record<string, unknown>,
) => {
  if (!trainerId || !mongoose.Types.ObjectId.isValid(trainerId)) {
    throw new AppError(400, 'Invalid trainer ID');
  }

  const trainingProgramQuery = new QueryBuilder(
    TrainingProgram.find({
      trainer: trainerId,
      isDeleted: false,
    }).populate('trainer', 'name email'),
    query,
  )
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await trainingProgramQuery.countTotal();
  const result = await trainingProgramQuery.modelQuery;

  return { meta, result };
};

const getTrainingProgramByIdFromDB = async (id: string) => {
  const result = await TrainingProgram.findById(id)
    .populate('trainer', 'name email image')
    .populate('user', 'name email image');

  if (!result) {
    throw new AppError(404, 'Training program not found');
  }

  if (result.isDeleted) {
    throw new AppError(400, 'This training program has been deleted');
  }

  return result;
};

const updateTrainingProgramIntoDB = async (
  id: string,
  payload: Partial<TTrainingProgram>,
) => {
  const isProgramExists = await TrainingProgram.findById(id);

  if (!isProgramExists) {
    throw new AppError(404, 'Training program does not exist');
  }

  if (isProgramExists.isDeleted) {
    throw new AppError(400, 'This training program has been deleted');
  }

  if (payload.name && payload.name !== isProgramExists.name) {
    const isDuplicateName = await TrainingProgram.findOne({
      name: payload.name,
      trainer: isProgramExists.trainer,
      isDeleted: false,
    });

    if (isDuplicateName) {
      throw new AppError(
        400,
        'Training program name already exists for this trainer',
      );
    }
  }

  try {
    const updatedCategory = await TrainingProgram.findByIdAndUpdate(
      id,
      payload,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedCategory) {
      throw new AppError(400, 'Training program update failed');
    }

    return updatedCategory;
  } catch (error: any) {
    console.error('updateTrainingProgramIntoDB Error:', error);
    throw new AppError(500, 'Failed to update training program');
  }
};

const deleteTrainingProgramFromDB = async (id: string) => {
  const isProgramExists = await TrainingProgram.findById(id);

  if (!isProgramExists) {
    throw new AppError(404, 'Training program not found');
  }

  if (isProgramExists.isDeleted) {
    throw new AppError(400, 'Training program is already deleted');
  }

  const result = await TrainingProgram.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );

  if (!result) {
    throw new AppError(400, 'Failed to delete training program');
  }

  return result;
};

export const TrainingProgramServices = {
  createTrainingProgramIntoDB,
  getTrainingProgramsByTrainerFromDB,
  getTrainingProgramByIdFromDB,
  updateTrainingProgramIntoDB,
  deleteTrainingProgramFromDB,
};
