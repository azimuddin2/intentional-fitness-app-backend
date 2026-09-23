import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { SurveyValidation } from './survey.validation';
import { SurveyControllers } from './survey.controller';

const router = express.Router();

router.post(
  '/',
  auth('admin'),
  validateRequest(SurveyValidation.createSurveyValidationSchema),
  SurveyControllers.createSurvey,
);

router.get('/', auth('admin'), SurveyControllers.getAllSurveys);

router.get(
  '/active',
  auth('trainer', 'user'),
  SurveyControllers.getActiveSurveys,
);

router.get(
  '/:id',
  auth('admin', 'trainer', 'user'),
  SurveyControllers.getSurveyById,
);

router.patch(
  '/:id',
  auth('admin'),
  validateRequest(SurveyValidation.updateSurveyValidationSchema),
  SurveyControllers.updateSurvey,
);

router.patch(
  '/:id/status',
  auth('admin'),
  SurveyControllers.changeSurveyStatus,
);

export const SurveyRoutes = router;
