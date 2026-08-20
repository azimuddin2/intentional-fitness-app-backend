import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { TrainingProgramValidations } from './trainingProgram.validation';
import { TrainingProgramControllers } from './trainingProgram.controller';

const router = express.Router();

router.post(
  '/',
  auth('trainer'),
  validateRequest(
    TrainingProgramValidations.createTrainingProgramValidationSchema,
  ),
  TrainingProgramControllers.createTrainingProgram,
);

router.get(
  '/',
  auth('trainer', 'user'),
  TrainingProgramControllers.getTrainingProgramsByUser,
);

router.get(
  '/:id',
  auth('trainer', 'user'),
  TrainingProgramControllers.getTrainingProgramById,
);

router.patch(
  '/:id',
  auth('trainer'),
  validateRequest(
    TrainingProgramValidations.updateTrainingProgramValidationSchema,
  ),
  TrainingProgramControllers.updateTrainingProgram,
);

router.delete(
  '/:id',
  auth('trainer'),
  TrainingProgramControllers.deleteTrainingProgram,
);

export const TrainingProgramRoutes = router;
