import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { GoalValidations } from './goal.validation';
import { GoalControllers } from './goal.controller';

const router = express.Router();

router.post(
  '/',
  auth('trainer', 'user'),
  validateRequest(GoalValidations.createGoalValidationSchema),
  GoalControllers.createGoal,
);

router.get('/', auth('user'), GoalControllers.getMyGoals);

router.get('/find', auth('trainer', 'user'), GoalControllers.getGoalByUser);

router.get('/:id', auth('trainer', 'user'), GoalControllers.getGoalById);

router.patch(
  '/:id',
  auth('trainer', 'user'),
  validateRequest(GoalValidations.updateGoalValidationSchema),
  GoalControllers.updateGoal,
);

router.patch(
  '/:id/favorite',
  auth('trainer', 'user'),
  GoalControllers.markAsFavorite,
);

router.delete('/:id', auth('trainer', 'user'), GoalControllers.deleteGoal);

export const GoalRoutes = router;
