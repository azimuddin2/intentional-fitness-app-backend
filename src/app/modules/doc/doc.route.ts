import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { DocValidations } from './doc.validation';
import { DocControllers } from './doc.controller';
import multer, { memoryStorage } from 'multer';
import parseData from '../../middlewares/parseData';

const router = express.Router();
const upload = multer({ storage: memoryStorage() });

router.post(
  '/',
  auth('trainer', 'user'),
  upload.single('file'),
  parseData(),
  validateRequest(DocValidations.createDocValidationSchema),
  DocControllers.createDoc,
);

router.get('/my-docs', auth('trainer', 'user'), DocControllers.getMyDocs);

router.get('/user/:userId', auth('trainer'), DocControllers.getDocsByUser);

router.get('/:id', auth('trainer', 'user'), DocControllers.getDocById);

router.patch(
  '/:id',
  auth('trainer', 'user'),
  upload.single('file'),
  parseData(),
  validateRequest(DocValidations.updateDocValidationSchema),
  DocControllers.updateDoc,
);

router.delete('/:id', auth('trainer', 'user'), DocControllers.deleteDoc);

export const DocRoutes = router;
