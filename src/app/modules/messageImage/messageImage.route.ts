import express from 'express';
import multer, { memoryStorage } from 'multer';
import auth from '../../middlewares/auth';
import { MessageImageController } from './messageImage.controller';

const router = express.Router();
const upload = multer({ storage: memoryStorage() });

router.post(
  '/',
  auth('user', 'trainer'),
  upload.fields([{ name: 'images', maxCount: 10 }]),
  MessageImageController.createImageUpload,
);

export const MessageImageRoutes = router;
