import mongoose from 'mongoose';
import AppError from '../../errors/AppError';
import { UploadedFiles } from '../../interface/common.interface';
import {
  deleteManyFromS3,
  uploadManyToS3,
} from '../../utils/awsS3FileUploader';
import { StabilizeCategory } from '../stabilizeCategory/stabilizeCategory.model';
import { TStabilizeExercise } from './stabilizeExercise.interface';
import { StabilizeExercise } from './stabilizeExercise.model';
import QueryBuilder from '../../builder/QueryBuilder';

const createStabilizeExerciseIntoDB = async (
  trainerId: string,
  payload: TStabilizeExercise,
  files: any,
) => {
  if (!payload.user) {
    throw new AppError(400, 'User ID is required');
  }

  const isCategoryExists = await StabilizeCategory.findOne({
    _id: payload.category,
    trainer: trainerId,
    isDeleted: false,
  });

  if (!isCategoryExists) {
    throw new AppError(404, 'Stabilize Category not found');
  }

  const isExerciseExists = await StabilizeExercise.findOne({
    title: payload.title,
    trainer: trainerId,
    user: payload.user,
    category: isCategoryExists._id,
    isDeleted: false,
  });

  if (isExerciseExists) {
    throw new AppError(400, 'This exercise already exists in this category');
  }

  // Handle image upload to S3
  if (files) {
    const { images } = files as UploadedFiles;

    if (!images?.length) {
      throw new AppError(404, 'At least one image is required');
    }

    if (images?.length) {
      const imgsArray = images.map((image) => ({
        file: image,
        path: `images/stabilize/exercise`,
      }));

      try {
        payload.images = await uploadManyToS3(imgsArray);
      } catch (error) {
        throw new AppError(500, 'Image upload failed');
      }
    }
  }

  const result = await StabilizeExercise.create({
    ...payload,
    trainer: trainerId,
  });

  if (!result) {
    throw new AppError(400, 'Failed to create stabilize exercise');
  }

  return result;
};

const getStabilizeExercisesForClientFromDB = async (
  clientId: string,
  categoryId: string,
  query: Record<string, unknown>,
) => {
  if (!clientId || !mongoose.Types.ObjectId.isValid(clientId)) {
    throw new AppError(400, 'Invalid client ID');
  }

  if (!categoryId || !mongoose.Types.ObjectId.isValid(categoryId)) {
    throw new AppError(400, 'Invalid category ID');
  }

  const stabilizeExerciseQuery = new QueryBuilder(
    StabilizeExercise.find({
      category: categoryId,
      isDeleted: false,
      user: clientId,
    }),
    query,
  )
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await stabilizeExerciseQuery.countTotal();
  const result = await stabilizeExerciseQuery.modelQuery;

  return { meta, result };
};

const getStabilizeExerciseByIdFromDB = async (id: string) => {
  const result = await StabilizeExercise.findById(id);

  if (!result) {
    throw new AppError(404, 'Stabilize exercise not found');
  }

  if (result.isDeleted) {
    throw new AppError(400, 'This stabilize exercise has been deleted');
  }

  return result;
};

const updateStabilizeExerciseIntoDB = async (
  id: string,
  payload: Partial<TStabilizeExercise>,
  files: any,
) => {
  const isExerciseExists = await StabilizeExercise.findById(id);

  if (!isExerciseExists)
    throw new AppError(404, 'Stabilize exercise does not exist');
  if (isExerciseExists.isDeleted)
    throw new AppError(400, 'This stabilize exercise has been deleted');

  if (payload.title && payload.title !== isExerciseExists.title) {
    const isDuplicateName = await StabilizeExercise.findOne({
      title: payload.title,
      trainer: isExerciseExists.trainer,
      user: isExerciseExists.user,
      category: isExerciseExists.category,
      isDeleted: false,
    });

    if (isDuplicateName) {
      throw new AppError(400, 'Exercise title already exists in this category');
    }
  }

  const { deleteKey } = payload;

  // Handle image upload to S3
  if (files) {
    const { images } = files as UploadedFiles;

    if (images?.length) {
      const imgsArray = images.map((image) => ({
        file: image,
        path: `images/stabilize/exercise`,
      }));

      try {
        payload.images = await uploadManyToS3(imgsArray); // Await all uploads before proceeding
      } catch (error) {
        throw new AppError(500, 'Image upload failed');
      }
    }
  }

  // Handle image deletions (if any)
  if (deleteKey && deleteKey.length > 0) {
    const newKey = deleteKey?.map(
      (key: any) => `images/stabilize/exercise/${key}`,
    );

    if (newKey.length > 0) {
      await deleteManyFromS3(newKey); // Delete images from S3
      // Remove deleted images from the product
      await StabilizeExercise.findByIdAndUpdate(
        id,
        {
          $pull: { images: { key: { $in: deleteKey } } },
        },
        { new: true },
      );
    }
  }

  try {
    const updatedExercise = await StabilizeExercise.findByIdAndUpdate(
      id,
      payload,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedExercise)
      throw new AppError(400, 'Stabilize exercise update failed');

    return updatedExercise;
  } catch (error: any) {
    console.error('updateStabilizeExerciseIntoDB Error:', error);
    throw new AppError(500, 'Failed to update stabilize exercise');
  }
};

const deleteStabilizeExerciseFromDB = async (id: string) => {
  const isExerciseExists = await StabilizeExercise.findById(id);

  if (!isExerciseExists)
    throw new AppError(404, 'Stabilize exercise not found');
  if (isExerciseExists.isDeleted)
    throw new AppError(400, 'Stabilize exercise is already deleted');

  const result = await StabilizeExercise.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );

  if (!result) throw new AppError(400, 'Failed to delete stabilize exercise');

  return result;
};

export const StabilizeExerciseServices = {
  createStabilizeExerciseIntoDB,
  getStabilizeExercisesForClientFromDB,
  getStabilizeExerciseByIdFromDB,
  updateStabilizeExerciseIntoDB,
  deleteStabilizeExerciseFromDB,
};
