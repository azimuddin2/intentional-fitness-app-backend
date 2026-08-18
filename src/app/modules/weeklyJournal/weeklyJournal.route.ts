import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { WeeklyJournalController } from './weeklyJournal.controller';
import { WeeklyJournalValidations } from './weeklyJournal.validation';

const router = express.Router();

// Add Week (শুধু client/user নিজের জন্য বানাতে পারবে)
router.post(
  '/create-week',
  auth('user'),
  WeeklyJournalController.createNewWeek,
);

// Weeks List — client নিজের জন্য
router.get(
  '/my-weeks',
  auth('user'),
  WeeklyJournalController.getAllWeeksByClient,
);

// Weeks List — trainer কোনো নির্দিষ্ট client-এর জন্য
router.get(
  '/client/:clientId/weeks',
  auth('trainer'),
  WeeklyJournalController.getAllWeeksByClient,
);

// একটা নির্দিষ্ট Week-এর ডিটেইল (client + trainer দুইজনই দেখতে পারবে)
router.get(
  '/:weekId',
  auth('user', 'trainer'),
  WeeklyJournalController.getSingleWeek,
);

// Reflection (Insight/Feeling/Goals) আপডেট — শুধু client
router.patch(
  '/:weekId/reflection',
  auth('user'),
  validateRequest(WeeklyJournalValidations.updateReflectionValidationSchema),
  WeeklyJournalController.updateReflection,
);

// Daily Entry Submit (Notes+Tasks+Wellness) — শুধু client
router.patch(
  '/:weekId/daily-entry',
  auth('user'),
  validateRequest(WeeklyJournalValidations.submitDailyEntryValidationSchema),
  WeeklyJournalController.submitDailyEntry,
);

export const WeeklyJournalRoutes = router;
