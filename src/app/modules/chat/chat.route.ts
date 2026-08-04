import { Router } from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLE } from '../user/user.constant';
import { ChatControllers } from './chat.controller';
import { ChatValidation } from './chat.validation';

const router = Router();

router.post(
  '/',
  auth(USER_ROLE.user, USER_ROLE.trainer),
  validateRequest(ChatValidation.createChatValidation),
  ChatControllers.createChat,
);

router.patch(
  '/:id',
  auth(USER_ROLE.user, USER_ROLE.trainer),
  validateRequest(ChatValidation.createChatValidation),
  ChatControllers.updateChat,
);

router.delete(
  '/:id',
  auth(USER_ROLE.user, USER_ROLE.trainer),
  ChatControllers.deleteChat,
);

router.get(
  '/my-chat-list',
  auth(USER_ROLE.user, USER_ROLE.trainer),
  ChatControllers.getMyChatList,
);

router.get(
  '/:id',
  auth(USER_ROLE.user, USER_ROLE.trainer),
  ChatControllers.getChatById,
);

export const ChatRoutes = router;
