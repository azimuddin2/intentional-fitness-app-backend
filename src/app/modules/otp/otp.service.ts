import moment from 'moment';
import config from '../../config';
import AppError from '../../errors/AppError';
import { User } from '../user/user.model';
import { TJwtPayload } from '../auth/auth.interface';
import { TVerifyOtp } from './otp.interface';
import { verifyToken } from '../../utils/verifyToken';
import { generateOtp } from '../../utils/generateOtp';
import { sendEmail } from '../../utils/sendEmail';
import { createToken } from '../auth/auth.utils';

const verifyOtp = async (token: string, otp: TVerifyOtp) => {
  if (!token) {
    throw new AppError(401, 'You are not authorized! Please Login.');
  }

  const decoded = verifyToken(token, config.jwt_access_secret as string);

  const { email } = decoded;

  const user = await User.findOne({ email: email }).select(
    'name email verification isVerified role',
  );

  if (!user) {
    throw new AppError(404, 'This user is not found!');
  }

  if (user?.isDeleted === true) {
    throw new AppError(403, 'This user is deleted!');
  }

  if (user?.status === 'blocked') {
    throw new AppError(403, 'This user is blocked!');
  }

  const verifyExpiresAt = user?.verification?.expiresAt;
  if (new Date() > verifyExpiresAt) {
    throw new AppError(400, 'Otp has expired. Please resend it');
  }

  const verifyOtpCode = Number(user?.verification?.otp);
  if (Number(otp) !== verifyOtpCode) {
    throw new AppError(400, 'Otp did not match');
  }

  const updateUser = await User.findByIdAndUpdate(
    user?._id,
    {
      $set: {
        status: 'confirmed',
        isVerified: user?.isVerified === false ? true : user?.isVerified,
        verification: {
          otp: 0,
          expiresAt: moment().add(3, 'minute'),
          status: true,
        },
      },
    },
    { new: true },
  ).select('_id name email role isVerified status');

  const jwtPayload: TJwtPayload = {
    userId: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const jwtToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    '5m',
  );

  return { user: updateUser, token: jwtToken };
};

const resendOtp = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(404, 'This user is not found!');
  }

  if (user?.isDeleted === true) {
    throw new AppError(403, 'This user account is deleted!');
  }

  if (user?.status === 'blocked') {
    throw new AppError(403, 'This user is blocked!');
  }

  // Generate new OTP
  const otp = generateOtp();
  const expiresAt = moment().add(5, 'minutes').toDate();

  const updateOtp = await User.findByIdAndUpdate(user?._id, {
    $set: {
      verification: {
        otp,
        expiresAt,
        status: false,
      },
    },
  });

  if (!updateOtp) {
    throw new AppError(400, 'Failed to resend otp. Please try again later');
  }

  const jwtPayload: TJwtPayload = {
    userId: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const token = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    '5m',
  );

  await sendEmail(
    user.email,
    'Your New OTP Code for Email Verification',
    `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Resend OTP Verification</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Arial, sans-serif; background-color: #f4f6f6;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f6f6; padding: 40px 0;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.06);">

              <!-- Header -->
              <tr>
                <td align="center" style="background-color: #1F5C5C; padding: 30px 40px;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 600;">
                    New Verification Code
                  </h1>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding: 40px;">
                  <p style="font-size: 15px; color: #333333; margin: 0 0 8px 0; text-align: center;">
                    Hello <strong>${user.name}</strong>,
                  </p>
                  <p style="font-size: 15px; color: #666666; margin: 0 0 30px 0; text-align: center;">
                    As requested, here is your new OTP code. Your previous code is no longer valid.
                  </p>

                  <!-- OTP Box -->
                  <table align="center" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center" style="background-color: #1F5C5C; padding: 16px 40px; border-radius: 8px;">
                        <span style="font-size: 30px; font-weight: 700; letter-spacing: 8px; color: #ffffff;">
                          ${otp}
                        </span>
                      </td>
                    </tr>
                  </table>

                  <p style="font-size: 14px; color: #666666; text-align: center; margin: 24px 0 0 0;">
                    This code is valid for <strong style="color: #1F5C5C;">5 minutes</strong>
                    (expires at <strong style="color: #1F5C5C;">${expiresAt.toLocaleTimeString()}</strong>)
                  </p>

                  <hr style="border: none; border-top: 1px solid #eeeeee; margin: 30px 0;" />

                  <p style="font-size: 13px; color: #999999; text-align: center; margin: 0;">
                    If you did not request this code, please ignore this email or contact support.
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td align="center" style="background-color: #f9fafa; padding: 20px 40px;">
                  <p style="font-size: 12px; color: #b0b0b0; margin: 0;">
                    &copy; ${new Date().getFullYear()} Intentional Fitness. All rights reserved.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
    `,
  );

  return { token };
};

export const OtpServices = {
  verifyOtp,
  resendOtp,
};
