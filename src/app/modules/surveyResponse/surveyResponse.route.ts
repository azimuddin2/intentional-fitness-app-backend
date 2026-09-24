import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { SurveyResponseValidation } from './surveyResponse.validation';
import { SurveyResponseControllers } from './surveyResponse.controller';

const router = express.Router();

router.post(
  '/submit',
  auth('user'),
  validateRequest(
    SurveyResponseValidation.submitSurveyResponseValidationSchema,
  ),
  SurveyResponseControllers.submitSurveyResponse,
);

router.get('/my', auth('user'), SurveyResponseControllers.getMyResponses);

router.get('/', auth('admin'), SurveyResponseControllers.getAllResponses);

router.get(
  '/user/:userId',
  auth('trainer'),
  SurveyResponseControllers.getResponsesByUser,
);

router.get(
  '/:id',
  auth('admin', 'trainer'),
  SurveyResponseControllers.getSingleResponse,
);

export const SurveyResponseRoutes = router;
