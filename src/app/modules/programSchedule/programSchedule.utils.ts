import AppError from '../../errors/AppError';
import { TrainingProgram } from '../trainingProgram/trainingProgram.model';
import { ProgramExercise } from '../programExercise/programExercise.model';

export const verifyProgram = async (
  trainerId: string,
  userId: string,
  programId: string,
) => {
  const program = await TrainingProgram.findOne({
    _id: programId,
    trainer: trainerId,
    user: userId,
    isDeleted: false,
  });

  if (!program) {
    throw new AppError(404, 'Training Program not found for this user');
  }

  return program;
};

export const verifyExercises = async (
  trainerId: string,
  userId: string,
  programId: string,
  exerciseIds: string[],
) => {
  const validExercises = await ProgramExercise.find({
    _id: { $in: exerciseIds },
    trainer: trainerId,
    user: userId,
    program: programId,
    isDeleted: false,
  });

  if (validExercises.length !== exerciseIds.length) {
    throw new AppError(
      400,
      'One or more exercises are invalid or do not belong to this program',
    );
  }
};
