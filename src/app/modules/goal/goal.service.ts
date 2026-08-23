import AppError from '../../errors/AppError';
import QueryBuilder from '../../builder/QueryBuilder';
import { TGoal } from './goal.interface';
import { Goal } from './goal.model';
import mongoose from 'mongoose';

const createGoalIntoDB = async (payload: TGoal) => {
  const result = await Goal.create(payload);

  if (!result) {
    throw new AppError(400, 'Failed to create goal');
  }

  return result;
};

const getGoalByUserFromDB = async (
  userId: string,
  query: Record<string, unknown>,
) => {
  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    throw new AppError(400, 'Invalid user ID');
  }

  const goalCategoryQuery = new QueryBuilder(
    Goal.find({
      user: userId,
      isDeleted: false,
    }).populate('user', 'name email'),
    query,
  )
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await goalCategoryQuery.countTotal();
  const result = await goalCategoryQuery.modelQuery;

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

  try {
    const updatedGoal = await Goal.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    });

    if (!updatedGoal) {
      throw new AppError(400, 'Goal update failed');
    }

    return updatedGoal;
  } catch (error: any) {
    console.error('updateGoalIntoDB Error:', error);
    throw new AppError(500, 'Failed to update goal');
  }
};

const deleteGoalFromDB = async (id: string) => {
  const isGoalExists = await Goal.findById(id);

  if (!isGoalExists) {
    throw new AppError(404, 'Goal not found');
  }

  // Hard delete from database
  const result = await Goal.findByIdAndDelete(id);

  if (!result) {
    throw new AppError(400, 'Failed to delete goal');
  }

  return result;
};

export const GoalServices = {
  createGoalIntoDB,
  getGoalByUserFromDB,
  getGoalByIdFromDB,
  updateGoalIntoDB,
  deleteGoalFromDB,
};
