import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { WeeklyJournalCategoryService } from './weeklyJournalCategory.service';

const createCategory = catchAsync(async (req: Request, res: Response) => {
  const trainerId = req.user.userId;
  const { name } = req.body;

  const result = await WeeklyJournalCategoryService.createCategoryIntoDB(
    trainerId,
    name,
  );

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Category created successfully',
    data: result,
  });
});

const getCategories = catchAsync(async (req: Request, res: Response) => {
  const trainerId = req.user._id;

  const result =
    await WeeklyJournalCategoryService.getCategoriesByTrainerFromDB(trainerId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Categories retrieved successfully',
    data: result,
  });
});

const updateCategory = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;

  const result = await WeeklyJournalCategoryService.updateCategoryInDB(
    id,
    name,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Category updated successfully',
    data: result,
  });
});

const deleteCategory = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await WeeklyJournalCategoryService.deleteCategoryFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Category deleted successfully',
    data: result,
  });
});

export const WeeklyJournalCategoryController = {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
};
