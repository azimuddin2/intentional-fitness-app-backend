import { StabilizeCategory } from '../stabilizeCategory/stabilizeCategory.model';
import { TrainingProgram } from '../trainingProgram/trainingProgram.model';
import { StabilizeExercise } from '../stabilizeExercise/stabilizeExercise.model';
import { ProgramExercise } from '../programExercise/programExercise.model';
import { TSourceType, TExerciseSourceType } from './schedule.interface';
import AppError from '../../errors/AppError';

export const verifySource = async (
  trainerId: string,
  userId: string,
  sourceType: TSourceType,
  sourceId: string,
) => {
  const SourceModel =
    sourceType === 'StabilizeCategory' ? StabilizeCategory : TrainingProgram;

  const source = await SourceModel.findOne({
    _id: sourceId,
    trainer: trainerId,
    user: userId,
    isDeleted: false,
  });

  if (!source) {
    throw new AppError(404, `${sourceType} not found for this user`);
  }

  return source;
};

export const verifyExercises = async (
  trainerId: string,
  userId: string,
  sourceId: string,
  exerciseSourceType: TExerciseSourceType,
  exerciseIds: string[],
) => {
  let validExercisesCount = 0;

  if (exerciseSourceType === 'StabilizeExercise') {
    const validExercises = await StabilizeExercise.find({
      _id: { $in: exerciseIds },
      trainer: trainerId,
      user: userId,
      category: sourceId,
      isDeleted: false,
    });
    validExercisesCount = validExercises.length;
  } else {
    const validExercises = await ProgramExercise.find({
      _id: { $in: exerciseIds },
      trainer: trainerId,
      user: userId,
      program: sourceId,
      isDeleted: false,
    });
    validExercisesCount = validExercises.length;
  }

  if (validExercisesCount !== exerciseIds.length) {
    throw new AppError(
      400,
      'One or more exercises are invalid or do not belong to this source',
    );
  }
};
