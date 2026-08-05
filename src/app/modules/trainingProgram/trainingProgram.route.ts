import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { StabilizeCategoryValidations } from './stabilizeCategory.validation';
import { StabilizeCategoryControllers } from './stabilizeCategory.controller';

const router = express.Router();

router.post(
  '/',
  auth('trainer'),
  validateRequest(
    StabilizeCategoryValidations.createStabilizeCategoryValidationSchema,
  ),
  StabilizeCategoryControllers.createStabilizeCategory,
);

router.get(
  '/',
  auth('trainer', 'user'),
  StabilizeCategoryControllers.getAllStabilizeCategories,
);

router.get(
  '/:id',
  auth('trainer', 'user'),
  StabilizeCategoryControllers.getStabilizeCategoryById,
);

router.patch(
  '/:id',
  auth('trainer'),
  validateRequest(
    StabilizeCategoryValidations.updateStabilizeCategoryValidationSchema,
  ),
  StabilizeCategoryControllers.updateStabilizeCategory,
);

router.delete(
  '/:id',
  auth('trainer'),
  StabilizeCategoryControllers.deleteStabilizeCategory,
);

export const StabilizeCategoryRoutes = router;
