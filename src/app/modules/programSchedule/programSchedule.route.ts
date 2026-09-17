import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { ProgramScheduleValidations } from './programSchedule.validation';
import { ProgramScheduleControllers } from './programSchedule.controller';

const router = express.Router();

router.post(
  '/',
  auth('trainer'),
  validateRequest(
    ProgramScheduleValidations.createProgramScheduleValidationSchema,
  ),
  ProgramScheduleControllers.createProgramSchedule,
);

router.patch(
  '/:scheduleId/add-exercise',
  auth('trainer'),
  validateRequest(
    ProgramScheduleValidations.addExerciseToProgramScheduleValidationSchema,
  ),
  ProgramScheduleControllers.addExerciseToProgramSchedule,
);

router.get(
  '/user/:userId/program/:programId/all',
  auth('trainer', 'user'),
  ProgramScheduleControllers.getAllProgramSchedules,
);

router.get(
  '/:scheduleId/exercise/:exerciseId',
  auth('trainer', 'user'),
  ProgramScheduleControllers.getSingleScheduledExercise,
);

router.patch(
  '/:scheduleId/remove-exercise',
  auth('trainer'),
  ProgramScheduleControllers.removeExerciseFromProgramSchedule,
);

router.get(
  '/user/:userId/program/:programId',
  auth('trainer', 'user'),
  ProgramScheduleControllers.getProgramScheduleByDate,
);

router.get(
  '/today/program/:programId',
  auth('user'),
  ProgramScheduleControllers.getTodayScheduleForUser,
);

router.patch(
  '/:scheduleId/feedback',
  auth('user'),
  validateRequest(
    ProgramScheduleValidations.updateProgramScheduledExerciseFeedbackValidationSchema,
  ),
  ProgramScheduleControllers.updateProgramScheduledExerciseFeedback,
);

export const ProgramScheduleRoutes = router;
