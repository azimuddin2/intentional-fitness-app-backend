import AppError from '../../errors/AppError';
import QueryBuilder from '../../builder/QueryBuilder';
import { TGoal } from './goal.interface';
import { Goal } from './goal.model';
import mongoose from 'mongoose';

const createGoalIntoDB = async (userId: string, payload: TGoal) => {
  const result = await Goal.create({ ...payload, user: userId });

  if (!result) {
    throw new AppError(400, 'Failed to create goal');
  }

  return result;
};

const getMyGoalsFromDB = async (
  userId: string,
  query: Record<string, unknown>,
) => {
  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    throw new AppError(400, 'Invalid user ID');
  }

  const goalQuery = new QueryBuilder(
    Goal.find({
      user: userId,
    }),
    query,
  )
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await goalQuery.countTotal();
  const result = await goalQuery.modelQuery;

  return { meta, result };
};

const getGoalByUserFromDB = async (
  userId: string,
  query: Record<string, unknown>,
) => {
  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    throw new AppError(400, 'Invalid user ID');
  }

  const goalQuery = new QueryBuilder(
    Goal.find({
      user: userId,
    }),
    query,
  )
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await goalQuery.countTotal();
  const result = await goalQuery.modelQuery;

  return { meta, result };
};

const getGoalByIdFromDB = async (id: string) => {
  const result = await Goal.findById(id);

  if (!result) {
    throw new AppError(404, 'Goal not found');
  }

  return result;
};

const updateGoalIntoDB = async (id: string, payload: Partial<TGoal>) => {
  const isGoalExists = await Goal.findById(id);

  if (!isGoalExists) {
    throw new AppError(404, 'Goal does not exist');
  }

  const updatedGoal = await Goal.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!updatedGoal) {
    throw new AppError(400, 'Goal update failed');
  }

  return updatedGoal;
};

const markAsFavoriteIntoDB = async (id: string) => {
  const isGoalExists = await Goal.findById(id);

  if (!isGoalExists) {
    throw new AppError(404, 'Goal not found');
  }

  const result = await Goal.findByIdAndUpdate(
    id,
    { isFavorite: !isGoalExists.isFavorite },
    { new: true },
  );

  if (!result) {
    throw new AppError(400, 'Failed to update goal');
  }

  return result;
};

const deleteGoalFromDB = async (id: string) => {
  const isGoalExists = await Goal.findById(id);

  if (!isGoalExists) {
    throw new AppError(404, 'Goal not found');
  }

  const result = await Goal.findByIdAndDelete(id);

  if (!result) {
    throw new AppError(400, 'Failed to delete goal');
  }

  return result;
};

export const GoalServices = {
  createGoalIntoDB,
  getMyGoalsFromDB,
  getGoalByUserFromDB,
  getGoalByIdFromDB,
  updateGoalIntoDB,
  markAsFavoriteIntoDB,
  deleteGoalFromDB,
};
