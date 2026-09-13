import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { CheckInValidations } from './checkIn.validation';
import { CheckInControllers } from './checkIn.controller';
import multer, { memoryStorage } from 'multer';
import parseData from '../../middlewares/parseData';

const router = express.Router();
const upload = multer({ storage: memoryStorage() });

router.post(
  '/',
  auth('user'),
  upload.single('photo'),
  parseData(),
  validateRequest(CheckInValidations.createCheckInValidationSchema),
  CheckInControllers.createCheckIn,
);

router.get(
  '/metric/:metricId',
  auth('user'),
  CheckInControllers.getCheckInsByMetric,
);

router.get(
  '/user/:userId/metric/:metricId',
  auth('trainer'),
  CheckInControllers.getCheckInsByUser,
);

export const CheckInRoutes = router;
