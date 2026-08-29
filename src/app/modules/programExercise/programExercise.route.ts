import express from 'express';
import multer, { memoryStorage } from 'multer';
import { ProgramExerciseControllers } from './programExercise.controller';
import parseData from '../../middlewares/parseData';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { ProgramExerciseValidations } from './programExercise.validation';

const router = express.Router();
const upload = multer({
  storage: memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
    fieldSize: 25 * 1024 * 1024,
  },
});

router.post(
  '/',
  auth('trainer'),
  upload.single('image'),
  parseData(),
  validateRequest(
    ProgramExerciseValidations.createProgramExerciseValidationSchema,
  ),
  ProgramExerciseControllers.createProgramExercise,
);

router.get(
  '/client/:clientId/program/:programId',
  auth('trainer', 'user'),
  ProgramExerciseControllers.getProgramExercisesForClient,
);

router.get(
  '/:id',
  auth('trainer', 'user'),
  ProgramExerciseControllers.getProgramExerciseById,
);

router.patch(
  '/:id',
  auth('trainer'),
  upload.single('image'),
  parseData(),
  validateRequest(
    ProgramExerciseValidations.updateProgramExerciseValidationSchema,
  ),
  ProgramExerciseControllers.updateProgramExercise,
);

router.delete(
  '/:id',
  auth('trainer'),
  ProgramExerciseControllers.deleteProgramExercise,
);

export const ProgramExerciseRoutes = router;
