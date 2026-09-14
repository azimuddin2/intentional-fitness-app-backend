import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { WeeklyJournalController } from './weeklyJournal.controller';
import { WeeklyJournalValidations } from './weeklyJournal.validation';

const router = express.Router();

router.post(
  '/create-week',
  auth('user'),
  WeeklyJournalController.createNewWeek,
);

router.get('/my-weeks', auth('user'), WeeklyJournalController.getMyWeeks);

router.get(
  '/user/:userId/weeks',
  auth('trainer'),
  WeeklyJournalController.getWeeksByUserId,
);

router.get(
  '/:weekId',
  auth('user', 'trainer'),
  WeeklyJournalController.getSingleWeek,
);

router.patch(
  '/:weekId/notes',
  auth('user'),
  validateRequest(WeeklyJournalValidations.updateWeekSummaryValidationSchema),
  WeeklyJournalController.updateWeekSummary,
);

router.patch(
  '/:weekId/daily-entry',
  auth('user'),
  validateRequest(WeeklyJournalValidations.submitDailyEntryValidationSchema),
  WeeklyJournalController.submitDailyEntry,
);

export const WeeklyJournalRoutes = router;
