import { ObjectId } from 'mongoose';
import { TUser } from '../user/user.interface';
import { TStabilizeCategory } from '../stabilizeCategory/stabilizeCategory.interface';
import { TStabilizeExercise } from '../stabilizeExercise/stabilizeExercise.interface';
import { TTrainingProgram } from '../trainingProgram/trainingProgram.interface';
import { TProgramExercise } from '../programExercise/programExercise.interface';

export type TSourceType = 'StabilizeCategory' | 'TrainingProgram';
export type TExerciseSourceType = 'StabilizeExercise' | 'ProgramExercise';

export type TScheduledExercise = {
  exercise: ObjectId | TStabilizeExercise | TProgramExercise;
  exerciseSourceType: TExerciseSourceType;
  isCompleted: boolean;
  ratePerceivedExertion?: number;
  clientFeedback?: string;
};

export type TSchedule = {
  _id: ObjectId;
  trainer: ObjectId | TUser;
  user: ObjectId | TUser;

  sourceType: TSourceType;
  source: ObjectId | TStabilizeCategory | TTrainingProgram;

  exercises: TScheduledExercise[];

  date: Date;
  isDeleted: boolean;
};
