import express from 'express';
import auth from '../../middlewares/auth';
import { WeeklyJournalCategoryController } from './weeklyJournalCategory.controller';

const router = express.Router();

router.post(
  '/',
  auth('trainer'),
  WeeklyJournalCategoryController.createCategory,
);

router.get(
  '/',
  auth('trainer', 'user'),
  WeeklyJournalCategoryController.getCategories,
);

router.patch(
  '/:id',
  auth('trainer'),
  WeeklyJournalCategoryController.updateCategory,
);

router.delete(
  '/:id',
  auth('trainer'),
  WeeklyJournalCategoryController.deleteCategory,
);

export const WeeklyJournalCategoryRoutes = router;
