import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { GoalValidations } from './goal.validation';
import { GoalControllers } from './goal.controller';

const router = express.Router();

router.post(
  '/',
  auth('admin', 'user'),
  validateRequest(GoalValidations.createGoalValidationSchema),
  GoalControllers.createGoal,
);

router.get('/', auth('admin', 'user'), GoalControllers.getAllGoals);

router.get('/:id', auth('admin', 'user'), GoalControllers.getGoalById);

router.patch(
  '/:id',
  auth('admin', 'user'),
  validateRequest(GoalValidations.updateGoalValidationSchema),
  GoalControllers.updateGoal,
);

router.delete('/:id', auth('admin', 'user'), GoalControllers.deleteGoal);

export const GoalRoutes = router;
