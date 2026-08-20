import mongoose from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { TStabilizeCategory } from './stabilizeCategory.interface';
import { StabilizeCategory } from './stabilizeCategory.model';

const createStabilizeCategoryIntoDB = async (
  trainerId: string,
  payload: TStabilizeCategory,
) => {
  const isCategoryExists = await StabilizeCategory.findOne({
    name: payload.name,
    trainer: trainerId,
    user: payload.user,
    isDeleted: false,
  });

  if (isCategoryExists) {
    throw new AppError(400, 'Stabilize category already exists for this user');
  }

  const result = await StabilizeCategory.create({
    ...payload,
    trainer: trainerId,
  });

  if (!result) {
    throw new AppError(400, 'Failed to create stabilize category');
  }

  return result;
};

const getStabilizeCategoriesByUserFromDB = async (
  userId: string,
  query: Record<string, unknown>,
) => {
  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    throw new AppError(400, 'Invalid user ID');
  }

  const stabilizeCategoryQuery = new QueryBuilder(
    StabilizeCategory.find({
      user: userId,
      isDeleted: false,
    }).populate('user', 'name email'),
    query,
  )
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await stabilizeCategoryQuery.countTotal();
  const result = await stabilizeCategoryQuery.modelQuery;

  return { meta, result };
};

const getStabilizeCategoryByIdFromDB = async (id: string) => {
  const result = await StabilizeCategory.findById(id);

  if (!result) {
    throw new AppError(404, 'Stabilize category not found');
  }

  if (result.isDeleted) {
    throw new AppError(400, 'This stabilize category has been deleted');
  }

  return result;
};

const updateStabilizeCategoryIntoDB = async (
  id: string,
  payload: Partial<TStabilizeCategory>,
) => {
  const isCategoryExists = await StabilizeCategory.findById(id);

  if (!isCategoryExists) {
    throw new AppError(404, 'Stabilize category does not exist');
  }

  if (isCategoryExists.isDeleted) {
    throw new AppError(400, 'This stabilize category has been deleted');
  }

  if (payload.name && payload.name !== isCategoryExists.name) {
    const isDuplicateName = await StabilizeCategory.findOne({
      name: payload.name,
      trainer: isCategoryExists.trainer,
      user: isCategoryExists.user,
      isDeleted: false,
    });

    if (isDuplicateName) {
      throw new AppError(
        400,
        'Stabilize category name already exists for this user',
      );
    }
  }

  try {
    const updatedCategory = await StabilizeCategory.findByIdAndUpdate(
      id,
      payload,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedCategory) {
      throw new AppError(400, 'Stabilize category update failed');
    }

    return updatedCategory;
  } catch (error: any) {
    console.error('updateStabilizeCategoryIntoDB Error:', error);
    throw new AppError(500, 'Failed to update stabilize category');
  }
};

const deleteStabilizeCategoryFromDB = async (id: string) => {
  const isCategoryExists = await StabilizeCategory.findById(id);

  if (!isCategoryExists) {
    throw new AppError(404, 'Stabilize category not found');
  }

  if (isCategoryExists.isDeleted) {
    throw new AppError(400, 'Stabilize category is already deleted');
  }

  const result = await StabilizeCategory.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );

  if (!result) {
    throw new AppError(400, 'Failed to delete stabilize category');
  }

  return result;
};

export const StabilizeCategoryServices = {
  createStabilizeCategoryIntoDB,
  getStabilizeCategoriesByUserFromDB,
  getStabilizeCategoryByIdFromDB,
  updateStabilizeCategoryIntoDB,
  deleteStabilizeCategoryFromDB,
};
