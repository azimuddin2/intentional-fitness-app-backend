import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { StabilizeScheduleValidations } from './stabilizeSchedule.validation';
import { StabilizeScheduleControllers } from './stabilizeSchedule.controller';

const router = express.Router();

router.post(
  '/',
  auth('trainer'),
  validateRequest(
    StabilizeScheduleValidations.createStabilizeScheduleValidationSchema,
  ),
  StabilizeScheduleControllers.createStabilizeSchedule,
);

router.patch(
  '/:scheduleId/add-exercise',
  auth('trainer'),
  validateRequest(
    StabilizeScheduleValidations.addExerciseToStabilizeScheduleValidationSchema,
  ),
  StabilizeScheduleControllers.addExerciseToStabilizeSchedule,
);

router.get(
  '/user/:userId/category/:categoryId/all',
  auth('trainer', 'user'),
  StabilizeScheduleControllers.getAllStabilizeSchedules,
);

router.get(
  '/:scheduleId/exercise/:exerciseId',
  auth('trainer', 'user'),
  StabilizeScheduleControllers.getSingleScheduledExercise,
);

router.patch(
  '/:id/remove-exercise',
  auth('trainer'),
  StabilizeScheduleControllers.removeExerciseFromStabilizeSchedule,
);

router.get(
  '/user/:userId/category/:categoryId',
  auth('trainer', 'user'),
  StabilizeScheduleControllers.getStabilizeScheduleByDate,
);

router.patch(
  '/:id/feedback',
  auth('user'),
  validateRequest(
    StabilizeScheduleValidations.updateStabilizeScheduledExerciseFeedbackValidationSchema,
  ),
  StabilizeScheduleControllers.updateStabilizeScheduledExerciseFeedback,
);

router.delete(
  '/:id',
  auth('trainer'),
  StabilizeScheduleControllers.deleteStabilizeSchedule,
);

export const StabilizeScheduleRoutes = router;
