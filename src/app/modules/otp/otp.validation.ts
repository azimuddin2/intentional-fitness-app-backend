import { z } from 'zod';

const verifyOtpValidationSchema = z.object({
  body: z.object({
    otp: z
      .string({
        required_error: 'OTP is required',
      })
      .min(4, 'OTP must be at least 4 digits')
      .regex(/^\d+$/, 'OTP must contain only numbers'),
  }),
});

const resendOtpValidationSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: 'Email is required',
      })
      .email('Invalid email address'),
  }),
});

export const OtpValidations = {
  verifyOtpValidationSchema,
  resendOtpValidationSchema,
};
