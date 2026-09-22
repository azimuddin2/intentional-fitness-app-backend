import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { WorkoutValidations } from './workout.validation';
import { WorkoutControllers } from './workout.controller';

const router = express.Router();

router.post(
  '/',
  auth('user'),
  validateRequest(WorkoutValidations.createWorkoutValidationSchema),
  WorkoutControllers.createWorkout,
);

router.get('/', auth('user', 'trainer'), WorkoutControllers.getMyWorkouts);

export const WorkoutRoutes = router;
