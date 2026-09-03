import express from 'express';

import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';

import { MetricValidations } from './metrics.validation';
import { MetricControllers } from './metrics.controller';

const router = express.Router();

router.post(
  '/',
  auth('trainer'),
  validateRequest(MetricValidations.createMetricValidationSchema),
  MetricControllers.createMetric,
);

router.get('/', auth('user'), MetricControllers.getMyMetrics);

router.get(
  '/find',
  auth('trainer', 'user'),
  MetricControllers.getMetricsByUser,
);

router.get('/:id', auth('trainer', 'user'), MetricControllers.getMetricById);

router.patch(
  '/:id',
  auth('trainer'),
  validateRequest(MetricValidations.updateMetricValidationSchema),
  MetricControllers.updateMetric,
);

router.delete('/:id', auth('trainer'), MetricControllers.deleteMetric);

export const MetricRoutes = router;
