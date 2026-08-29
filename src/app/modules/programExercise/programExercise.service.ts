import mongoose from 'mongoose';
import AppError from '../../errors/AppError';
import { deleteFromS3, uploadToS3 } from '../../utils/awsS3FileUploader';
import { TrainingProgram } from '../trainingProgram/trainingProgram.model';
import { TProgramExercise } from './programExercise.interface';
import { ProgramExercise } from './programExercise.model';
import QueryBuilder from '../../builder/QueryBuilder';

const createProgramExerciseIntoDB = async (
  trainerId: string,
  payload: TProgramExercise,
  file: any,
) => {
  const isProgramExists = await TrainingProgram.findOne({
    _id: payload.program,
    trainer: trainerId,
    user: payload.user,
    isDeleted: false,
  });

  if (!isProgramExists) {
    throw new AppError(404, 'Training Program not found for this user');
  }

  const isExerciseExists = await ProgramExercise.findOne({
    title: payload.title,
    trainer: trainerId,
    user: payload.user,
    program: isProgramExists._id,
    isDeleted: false,
  });

  if (isExerciseExists) {
    throw new AppError(400, 'This exercise already exists in this program');
  }

  if (file) {
    const uploadedUrl = await uploadToS3({
      file,
      fileName: `images/program/exercise/${Date.now()}-${Math.floor(
        1000 + Math.random() * 9000,
      )}`,
    });

    payload.image = uploadedUrl;
  }

  const result = await ProgramExercise.create({
    ...payload,
    trainer: trainerId,
    program: isProgramExists._id,
  });

  if (!result) {
    throw new AppError(400, 'Failed to create program exercise');
  }

  return result;
};

const getProgramExercisesForClientFromDB = async (
  clientId: string,
  programId: string,
  query: Record<string, unknown>,
) => {
  if (!clientId || !mongoose.Types.ObjectId.isValid(clientId)) {
    throw new AppError(400, 'Invalid client ID');
  }

  if (!programId || !mongoose.Types.ObjectId.isValid(programId)) {
    throw new AppError(400, 'Invalid category ID');
  }

  const programExerciseQuery = new QueryBuilder(
    ProgramExercise.find({
      program: programId,
      isDeleted: false,
      user: clientId,
    }),
    query,
  )
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await programExerciseQuery.countTotal();
  const result = await programExerciseQuery.modelQuery;

  return { meta, result };
};

const getProgramExerciseByIdFromDB = async (id: string) => {
  const result = await ProgramExercise.findById(id);

  if (!result) {
    throw new AppError(404, 'Program exercise not found');
  }

  if (result.isDeleted) {
    throw new AppError(400, 'This program exercise has been deleted');
  }

  return result;
};

const updateProgramExerciseIntoDB = async (
  id: string,
  payload: Partial<TProgramExercise>,
  file: any,
) => {
  const isExerciseExists = await ProgramExercise.findById(id);

  if (!isExerciseExists) {
    throw new AppError(404, 'Program exercise does not exist');
  }

  if (isExerciseExists.isDeleted) {
    throw new AppError(400, 'This Program exercise has been deleted');
  }

  // Check duplicate exercise title
  if (payload.title && payload.title !== isExerciseExists.title) {
    const isDuplicateName = await ProgramExercise.findOne({
      title: payload.title,
      trainer: isExerciseExists.trainer,
      user: isExerciseExists.user,
      program: isExerciseExists.program,
      isDeleted: false,
      _id: { $ne: id },
    });

    if (isDuplicateName) {
      throw new AppError(400, 'Exercise title already exists in this program');
    }
  }

  // 📸 Handle image upload
  if (file) {
    const uploadedUrl = await uploadToS3({
      file,
      fileName: `images/program/exercise/${Date.now()}-${Math.floor(
        1000 + Math.random() * 9000,
      )}`,
    });

    // 🧹 Delete old image if exists
    if (isExerciseExists.image) {
      await deleteFromS3(isExerciseExists.image);
    }

    payload.image = uploadedUrl;
  }

  try {
    const updatedExercise = await ProgramExercise.findByIdAndUpdate(
      id,
      payload,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedExercise) {
      throw new AppError(400, 'Program exercise update failed');
    }

    return updatedExercise;
  } catch (error: any) {
    throw new AppError(500, error.message || 'Program exercise update failed');
  }
};

const deleteProgramExerciseFromDB = async (id: string) => {
  const isExerciseExists = await ProgramExercise.findById(id);

  if (!isExerciseExists) {
    throw new AppError(404, 'Program exercise not found');
  }
  if (isExerciseExists.isDeleted) {
    throw new AppError(400, 'Program exercise is already deleted');
  }

  const result = await ProgramExercise.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  if (!result) throw new AppError(400, 'Failed to delete program exercise');
  return result;
};

export const ProgramExerciseServices = {
  createProgramExerciseIntoDB,
  getProgramExercisesForClientFromDB,
  getProgramExerciseByIdFromDB,
  updateProgramExerciseIntoDB,
  deleteProgramExerciseFromDB,
};
