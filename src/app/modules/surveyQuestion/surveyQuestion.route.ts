import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { SurveyQuestionValidation } from './surveyQuestion.validation';
import { SurveyQuestionControllers } from './surveyQuestion.controller';

const router = express.Router();

router.post(
  '/',
  auth('admin'),
  validateRequest(
    SurveyQuestionValidation.createSurveyQuestionValidationSchema,
  ),
  SurveyQuestionControllers.createSurveyQuestion,
);

router.get(
  '/:surveyId',
  auth('admin', 'trainer', 'user'),
  SurveyQuestionControllers.getQuestionsBySurvey,
);

router.get(
  '/single/:id',
  auth('admin', 'trainer', 'user'),
  SurveyQuestionControllers.getQuestionById,
);

router.patch(
  '/:id',
  auth('admin'),
  validateRequest(
    SurveyQuestionValidation.updateSurveyQuestionValidationSchema,
  ),
  SurveyQuestionControllers.updateSurveyQuestion,
);

router.delete(
  '/:id',
  auth('admin'),
  SurveyQuestionControllers.deleteSurveyQuestion,
);

export const SurveyQuestionRoutes = router;
