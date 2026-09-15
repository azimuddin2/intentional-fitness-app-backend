import AppError from '../../errors/AppError';
import { StabilizeCategory } from '../stabilizeCategory/stabilizeCategory.model';
import { StabilizeExercise } from '../stabilizeExercise/stabilizeExercise.model';

export const verifyCategory = async (
  trainerId: string,
  userId: string,
  categoryId: string,
) => {
  const category = await StabilizeCategory.findOne({
    _id: categoryId,
    trainer: trainerId,
    user: userId,
    isDeleted: false,
  });

  if (!category) {
    throw new AppError(404, 'Stabilize Category not found for this user');
  }

  return category;
};

export const verifyExercises = async (
  trainerId: string,
  userId: string,
  categoryId: string,
  exerciseIds: string[],
) => {
  const validExercises = await StabilizeExercise.find({
    _id: { $in: exerciseIds },
    trainer: trainerId,
    user: userId,
    category: categoryId,
    isDeleted: false,
  });

  if (validExercises.length !== exerciseIds.length) {
    throw new AppError(
      400,
      'One or more exercises are invalid or do not belong to this category',
    );
  }
};
