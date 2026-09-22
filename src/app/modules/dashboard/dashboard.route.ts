import { Router } from 'express';
import { DashboardControllers } from './dashboard.controller';
import auth from '../../middlewares/auth';

const router = Router();

router.get('/users', auth('admin'), DashboardControllers.getTotalUsers);

router.get('/trainers', auth('admin'), DashboardControllers.getTotalTrainers);

router.get(
  '/user-chart',
  auth('admin'),
  DashboardControllers.getUserOverviewChart,
);

router.get(
  '/trainer-chart',
  auth('admin'),
  DashboardControllers.getTrainerOverviewChart,
);

export const DashboardRoutes = router;
