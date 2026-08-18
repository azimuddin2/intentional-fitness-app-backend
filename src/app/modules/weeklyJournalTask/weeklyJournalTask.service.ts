import { DEFAULT_TASKS } from './weeklyJournalTask.constant';
import { WeeklyJournalTask } from './weeklyJournalTask.model';

const seedDefaultTasksIntoDB = async (trainerId: string) => {
  const tasks = DEFAULT_TASKS.map((name) => ({
    trainer: trainerId,
    name,
  }));

  await WeeklyJournalTask.insertMany(tasks);
};

const createTaskIntoDB = async (trainerId: string, name: string) => {
  const task = await WeeklyJournalTask.create({
    trainer: trainerId,
    name,
  });

  return task;
};

const getTasksByTrainerFromDB = async (trainerId: string) => {
  const tasks = await WeeklyJournalTask.find({
    trainer: trainerId,
    isDeleted: false,
  });

  return tasks;
};

const updateTaskInDB = async (taskId: string, name: string) => {
  const task = await WeeklyJournalTask.findByIdAndUpdate(
    taskId,
    { name },
    { new: true },
  );

  return task;
};

const deleteTaskFromDB = async (taskId: string) => {
  const task = await WeeklyJournalTask.findByIdAndUpdate(
    taskId,
    { isDeleted: true },
    { new: true },
  );

  return task;
};

export const WeeklyJournalTaskService = {
  seedDefaultTasksIntoDB,
  createTaskIntoDB,
  getTasksByTrainerFromDB,
  updateTaskInDB,
  deleteTaskFromDB,
};
