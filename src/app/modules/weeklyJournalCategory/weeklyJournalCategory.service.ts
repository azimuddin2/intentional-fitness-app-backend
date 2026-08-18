import { DEFAULT_CATEGORIES } from './weeklyJournalCategory.constant';
import { WeeklyJournalCategory } from './weeklyJournalCategory.model';

const seedDefaultCategoriesIntoDB = async (trainerId: string) => {
  const categories = DEFAULT_CATEGORIES.map((name) => ({
    trainer: trainerId,
    name,
  }));

  await WeeklyJournalCategory.insertMany(categories);
};

const createCategoryIntoDB = async (trainerId: string, name: string) => {
  const category = await WeeklyJournalCategory.create({
    trainer: trainerId,
    name,
  });

  return category;
};

const getCategoriesByTrainerFromDB = async (trainerId: string) => {
  const categories = await WeeklyJournalCategory.find({
    trainer: trainerId,
    isDeleted: false,
  });

  return categories;
};

const updateCategoryInDB = async (categoryId: string, name: string) => {
  const category = await WeeklyJournalCategory.findByIdAndUpdate(
    categoryId,
    { name },
    { new: true },
  );

  return category;
};

const deleteCategoryFromDB = async (categoryId: string) => {
  const category = await WeeklyJournalCategory.findByIdAndUpdate(
    categoryId,
    { isDeleted: true },
    { new: true },
  );

  return category;
};

export const WeeklyJournalCategoryService = {
  seedDefaultCategoriesIntoDB,
  createCategoryIntoDB,
  getCategoriesByTrainerFromDB,
  updateCategoryInDB,
  deleteCategoryFromDB,
};
