import { Router } from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';
import validateRequest from '../../middlewares/validateRequest';
import { MessagesControllers } from './message.controller';
import { MessagesValidation } from './message.validation';

const router = Router();

router.post(
  '/send-messages',
  auth(USER_ROLE.user, USER_ROLE.trainer),
  validateRequest(MessagesValidation.sendMessageValidation),
  MessagesControllers.createMessages,
);

router.patch(
  '/seen/:chatId',
  auth(USER_ROLE.user, USER_ROLE.trainer),
  MessagesControllers.seenMessage,
);

router.patch(
  '/update/:id',
  auth(USER_ROLE.user, USER_ROLE.trainer),
  validateRequest(MessagesValidation.updateMessageValidation),
  MessagesControllers.updateMessages,
);

router.get('/my-messages/:chatId', MessagesControllers.getMessagesByChatId);

router.delete(
  '/:id',
  auth(USER_ROLE.user, USER_ROLE.trainer),
  MessagesControllers.deleteMessages,
);

router.get(
  '/:id',
  auth(USER_ROLE.user, USER_ROLE.trainer),
  MessagesControllers.getMessagesById,
);

router.get(
  '/',
  auth(USER_ROLE.user, USER_ROLE.trainer),
  MessagesControllers.getAllMessages,
);

export const MessagesRoutes = router;
