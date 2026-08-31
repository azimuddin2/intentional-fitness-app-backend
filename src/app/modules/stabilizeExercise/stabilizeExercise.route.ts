import express from 'express';
import multer, { memoryStorage } from 'multer';
import { StabilizeExerciseControllers } from './stabilizeExercise.controller';
import parseData from '../../middlewares/parseData';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { StabilizeExerciseValidations } from './stabilizeExercise.validation';

const router = express.Router();

const upload = multer({
  storage: memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
    fieldSize: 25 * 1024 * 1024,
  },
});

router.post(
  '/',
  auth('trainer'),
  upload.fields([{ name: 'images', maxCount: 10 }]),
  parseData(),
  validateRequest(
    StabilizeExerciseValidations.createStabilizeExerciseValidationSchema,
  ),
  StabilizeExerciseControllers.createStabilizeExercise,
);

router.get(
  '/client/:clientId/category/:categoryId',
  auth('trainer', 'user'),
  StabilizeExerciseControllers.getStabilizeExercisesForClient,
);

router.get(
  '/:id',
  auth('user', 'trainer'),
  StabilizeExerciseControllers.getStabilizeExerciseById,
);

router.patch(
  '/:id',
  auth('trainer'),
  upload.fields([{ name: 'images', maxCount: 10 }]),
  parseData(),
  validateRequest(
    StabilizeExerciseValidations.updateStabilizeExerciseValidationSchema,
  ),
  StabilizeExerciseControllers.updateStabilizeExercise,
);

router.delete(
  '/:id',
  auth('trainer'),
  StabilizeExerciseControllers.deleteStabilizeExercise,
);

export const StabilizeExerciseRoutes = router;
