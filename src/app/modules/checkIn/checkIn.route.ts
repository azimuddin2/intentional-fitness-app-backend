import express from 'express';

import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';

import { CheckInValidations } from './checkIn.validation';
import { CheckInControllers } from './checkIn.controller';

const router = express.Router();

router.post(
  '/',
  auth('user'),
  validateRequest(CheckInValidations.createCheckInValidationSchema),
  CheckInControllers.createCheckIn,
);

router.get('/', auth('user'), CheckInControllers.getMyCheckIns);

router.get(
  '/metric/:metricId',
  auth('user'),
  CheckInControllers.getCheckInsByMetric,
);

router.get('/:id', auth('user'), CheckInControllers.getCheckInById);

router.patch(
  '/:id',
  auth('user'),
  validateRequest(CheckInValidations.updateCheckInValidationSchema),
  CheckInControllers.updateCheckIn,
);

router.delete('/:id', auth('user'), CheckInControllers.deleteCheckIn);

export const CheckInRoutes = router;
