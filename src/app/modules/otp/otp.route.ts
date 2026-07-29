import express from 'express';
import { OtpControllers } from './otp.controller';
import validateRequest from '../../middlewares/validateRequest';
import { OtpValidations } from './otp.validation';

const router = express.Router();

router.post(
  '/verify-otp',
  validateRequest(OtpValidations.verifyOtpValidationSchema),
  OtpControllers.handleVerifyOtp,
);

router.post(
  '/resend-otp',
  validateRequest(OtpValidations.resendOtpValidationSchema),
  OtpControllers.handleResendOtp,
);

export const OtpRoutes = router;
