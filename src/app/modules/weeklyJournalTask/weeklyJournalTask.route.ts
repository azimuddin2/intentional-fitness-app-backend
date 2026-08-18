import express from 'express';
import auth from '../../middlewares/auth';
import { WeeklyJournalTaskController } from './weeklyJournalTask.controller';

const router = express.Router();

router.post('/', auth('trainer'), WeeklyJournalTaskController.createTask);

router.get('/', auth('trainer', 'user'), WeeklyJournalTaskController.getTasks);

router.patch('/:id', auth('trainer'), WeeklyJournalTaskController.updateTask);

router.delete('/:id', auth('trainer'), WeeklyJournalTaskController.deleteTask);

export const WeeklyJournalTaskRoutes = router;
