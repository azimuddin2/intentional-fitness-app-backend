import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { UserValidations } from './user.validation';
import { UserControllers } from './user.controller';
import auth from '../../middlewares/auth';
import multer, { memoryStorage } from 'multer';
import parseData from '../../middlewares/parseData';

const router = express.Router();
const upload = multer({ storage: memoryStorage() });

router.post(
  '/signup',
  validateRequest(UserValidations.createUserValidationSchema),
  UserControllers.signupUser,
);

router.get('/', auth('admin'), UserControllers.getAllUsers);

router.get(
  '/profile',
  auth('user', 'trainer', 'admin'),
  UserControllers.getUserProfile,
);

router.get(
  '/:id',
  auth('admin', 'user', 'trainer'),
  UserControllers.getUserById,
);

router.patch(
  '/profile',
  auth('user', 'trainer', 'admin'),
  upload.single('image'),
  parseData(),
  validateRequest(UserValidations.updateUserValidationSchema),
  UserControllers.updateUserProfile,
);

router.patch(
  '/profile/picture',
  auth('user', 'trainer', 'admin'),
  upload.single('profile'),
  UserControllers.updateUserPicture,
);

router.put(
  '/change-status/:id',
  auth('admin'),
  validateRequest(UserValidations.changeStatusValidationSchema),
  UserControllers.changeStatus,
);

router.delete('/', auth('trainer', 'user'), UserControllers.deleteUserAccount);

router.patch(
  '/update-notifications',
  auth('user', 'trainer', 'admin'),
  validateRequest(UserValidations.notificationSettingsValidationSchema),
  UserControllers.updateNotificationSettings,
);

export const UserRoutes = router;
