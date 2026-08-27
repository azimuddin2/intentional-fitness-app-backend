import mongoose from 'mongoose';
import AppError from '../../errors/AppError';
import { UploadedFiles } from '../../interface/common.interface';
import { deleteFromS3, uploadManyToS3 } from '../../utils/awsS3FileUploader';
import { TrainingProgram } from '../trainingProgram/trainingProgram.model';
import { TProgramExercise } from './programExercise.interface';
import { ProgramExercise } from './programExercise.model';
import QueryBuilder from '../../builder/QueryBuilder';

const createProgramExerciseIntoDB = async (
  trainerId: string,
  payload: TProgramExercise,
  files: any,
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

  if (files) {
    const { image } = files as UploadedFiles;
    if (image?.length) {
      try {
        const uploaded = await uploadManyToS3([
          { file: image[0], path: `images/programExercise` },
        ]);
        payload.image = uploaded[0];
      } catch (error) {
        throw new AppError(500, 'Image upload failed');
      }
    }
  }

  const result = await ProgramExercise.create({
    ...payload,
    trainer: trainerId,
    program: isProgramExists._id,
  });

  if (!result) throw new AppError(400, 'Failed to create program exercise');
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
  files: any,
) => {
  const isExerciseExists = await ProgramExercise.findById(id);
  if (!isExerciseExists)
    throw new AppError(404, 'Program exercise does not exist');
  if (isExerciseExists.isDeleted)
    throw new AppError(400, 'This program exercise has been deleted');

  if (payload.title && payload.title !== isExerciseExists.title) {
    const isDuplicateTitle = await ProgramExercise.findOne({
      title: payload.title,
      trainer: isExerciseExists.trainer,
      user: isExerciseExists.user,
      program: isExerciseExists.program,
      isDeleted: false,
    });
    if (isDuplicateTitle)
      throw new AppError(400, 'Exercise title already exists in this program');
  }

  if (files) {
    const { image } = files as UploadedFiles;
    if (image?.length) {
      try {
        if (isExerciseExists.image?.key)
          await deleteFromS3(isExerciseExists.image.key);
        const uploaded = await uploadManyToS3([
          { file: image[0], path: `images/programExercise` },
        ]);
        payload.image = uploaded[0];
      } catch (error) {
        throw new AppError(500, 'Image update failed');
      }
    }
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
    if (!updatedExercise)
      throw new AppError(400, 'Program exercise update failed');
    return updatedExercise;
  } catch (error: any) {
    console.error('updateProgramExerciseIntoDB Error:', error);
    throw new AppError(500, 'Failed to update program exercise');
  }
};

const updateClientFeedbackIntoDB = async (
  id: string,
  clientId: string,
  payload: { ratePerceivedExertion?: number; clientFeedback?: string },
) => {
  const isExerciseExists = await ProgramExercise.findById(id);
  if (!isExerciseExists) throw new AppError(404, 'Program exercise not found');
  if (isExerciseExists.isDeleted)
    throw new AppError(400, 'This program exercise has been deleted');
  if (isExerciseExists.user?.toString() !== clientId) {
    throw new AppError(403, 'You are not allowed to update this exercise');
  }

  const updatedExercise = await ProgramExercise.findByIdAndUpdate(
    id,
    { ...payload, isCompleted: true },
    { new: true, runValidators: true },
  );

  if (!updatedExercise) throw new AppError(400, 'Failed to update feedback');
  return updatedExercise;
};

const deleteProgramExerciseFromDB = async (id: string) => {
  const isExerciseExists = await ProgramExercise.findById(id);
  if (!isExerciseExists) throw new AppError(404, 'Program exercise not found');
  if (isExerciseExists.isDeleted)
    throw new AppError(400, 'Program exercise is already deleted');

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
  updateClientFeedbackIntoDB,
  deleteProgramExerciseFromDB,
};
