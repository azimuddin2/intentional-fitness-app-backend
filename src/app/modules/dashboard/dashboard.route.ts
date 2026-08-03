import { Router } from 'express';
import { DashboardControllers } from './dashboard.controller';
import auth from '../../middlewares/auth';

const router = Router();

router.get('/users', auth('admin'), DashboardControllers.getTotalUsers);

router.get('/trainers', auth('admin'), DashboardControllers.getTotalTrainers);

export const DashboardRoutes = router;
