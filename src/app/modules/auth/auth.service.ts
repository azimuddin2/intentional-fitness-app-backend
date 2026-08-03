import AppError from '../../errors/AppError';
import {
  TChangePassword,
  TJwtPayload,
  TLoginUser,
  TResetPassword,
} from './auth.interface';
import config from '../../config';
import { User } from '../user/user.model';
import { verifyToken } from '../../utils/verifyToken';
import { createToken, isValidFcmToken } from './auth.utils';
import { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { generateOtp } from '../../utils/generateOtp';
import moment from 'moment';
import { sendEmail } from '../../utils/sendEmail';
import { sendNotification } from '../notification/notification.utils';
import httpStatus from 'http-status';
import { Login_With, USER_ROLE } from '../user/user.constant';
import { OtpServices } from '../otp/otp.service';
import { TRole, TUser } from '../user/user.interface';

const loginUser = async (payload: TLoginUser) => {
  const user = await User.findOne({ email: payload.email });

  if (!user) {
    throw new AppError(404, 'No account found with this email.');
  }

  if (user?.isDeleted === true) {
    throw new AppError(
      403,
      'This account has been deactivated. Please contact support.',
    );
  }

  if (user?.status === 'blocked') {
    throw new AppError(
      403,
      'This account has been suspended. Please contact support.',
    );
  }

  const isPasswordMatched = await User.isPasswordMatched(
    payload?.password,
    user?.password,
  );
  if (!isPasswordMatched) {
    throw new AppError(401, 'Password does not match!');
  }

  // 🔴 User not verified → resend OTP, don't generate any token
  if (!user.isVerified) {
    await OtpServices.resendOtp(user.email);

    return {
      success: false,
      message: `Hi ${user.name}, your account is not verified yet. We've just sent an OTP to your email ${user.email}. Please check your inbox and enter the code to verify your account.`,
      requiresVerification: true,
      isVerified: user.isVerified,
      email: user.email,
    };
  }

  let updatedUser: TUser = user;

  if (payload.fcmToken) {
    updatedUser = (await User.findOneAndUpdate(
      { email: payload.email },
      { fcmToken: payload.fcmToken.trim() },
      { new: true, runValidators: true },
    )) as TUser;
  }

  const jwtPayload: TJwtPayload = {
    userId: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string,
  );

  return {
    accessToken,
    refreshToken,
    user: {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      role: updatedUser.role,
      status: updatedUser.status,
      gender: updatedUser.gender,
      image: updatedUser.image,
      isVerified: updatedUser.isVerified,
    },
  };
};

const refreshToken = async (token: string) => {
  if (!token) {
    throw new AppError(401, 'You are not authorized! Please Login');
  }

  const decoded = verifyToken(token, config.jwt_refresh_secret as string);

  const { email } = decoded;

  const user = await User.findOne({ email: email });

  if (!user) {
    throw new AppError(404, 'No account found with this email.');
  }

  if (user?.isDeleted === true) {
    throw new AppError(
      403,
      'This account has been deactivated. Please contact support.',
    );
  }

  if (user?.status === 'blocked') {
    throw new AppError(
      403,
      'This account has been suspended. Please contact support.',
    );
  }

  // create token and sent to the client
  const jwtPayload: TJwtPayload = {
    userId: user._id.toString(),
    name: user?.name,
    email: user?.email,
    role: user?.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  return {
    accessToken,
  };
};

const changePassword = async (
  userData: JwtPayload,
  payload: TChangePassword,
) => {
  const user = await User.isUserExistsByEmail(userData?.email);

  if (!user) {
    throw new AppError(404, 'No account found with this email.');
  }

  if (user?.isDeleted === true) {
    throw new AppError(
      403,
      'This account has been deactivated. Please contact support.',
    );
  }

  if (user?.status === 'blocked') {
    throw new AppError(
      403,
      'This account has been suspended. Please contact support.',
    );
  }

  // checking if the password is correct
  const isPasswordMatched = await User.isPasswordMatched(
    payload?.oldPassword,
    user?.password,
  );
  if (!isPasswordMatched) {
    throw new AppError(403, 'Password do not matched!');
  }

  // hash new password
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  await User.findOneAndUpdate(
    {
      _id: userData.userId,
      role: userData.role,
    },
    {
      password: newHashedPassword,
      needsPasswordChange: true,
      passwordChangeAt: new Date(),
    },
  );

  return null;
};

const forgotPassword = async (email: string) => {
  const user = await User.isUserExistsByEmail(email);

  if (!user) {
    throw new AppError(404, 'No account found with this email.');
  }

  if (user?.isDeleted === true) {
    throw new AppError(
      403,
      'This account has been deactivated. Please contact support.',
    );
  }

  if (user?.status === 'blocked') {
    throw new AppError(
      403,
      'This account has been suspended. Please contact support.',
    );
  }

  // create token and sent to the client
  const jwtPayload: TJwtPayload = {
    userId: user._id.toString(),
    name: user?.name,
    email: user?.email,
    role: user?.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    '5m',
  );

  const otp = generateOtp();

  const otpExpiryMinutes = 5; // OTP valid 5 minutes
  const expiresAt = moment().add(otpExpiryMinutes, 'minutes').toDate();

  await User.findByIdAndUpdate(user?._id, {
    verification: {
      otp,
      expiresAt,
      status: true,
      isPasswordReset: true,
    },
  });

  await sendEmail(
    email,
    'Your OTP for Password Reset',
    `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Reset Your Password</title>
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
                  Reset your password
                </h1>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding: 40px;">
                <p style="font-size: 15px; color: #666666; margin: 0 0 30px 0; text-align: center;">
                  Use the OTP below to reset your password. Do not share this code with anyone.
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
                  This OTP is valid for <strong style="color: #1F5C5C;">${otpExpiryMinutes} minutes</strong>
                  (expires at <strong style="color: #1F5C5C;">${expiresAt.toLocaleTimeString()}</strong>)
                </p>

                <hr style="border: none; border-top: 1px solid #eeeeee; margin: 30px 0;" />

                <p style="font-size: 13px; color: #999999; text-align: center; margin: 0;">
                  If you did not request a password reset, you can safely ignore this email.
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td align="center" style="background-color: #f9fafa; padding: 20px 40px;">
                <p style="font-size: 12px; color: #b0b0b0; margin: 0;">
                  &copy; ${new Date().getFullYear()} Your Company Name. All rights reserved.
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

  return { email, accessToken };
};

const resetPassword = async (token: string, payload: TResetPassword) => {
  if (!token) {
    throw new AppError(401, 'You are not authorized!');
  }

  const decoded = verifyToken(token, config.jwt_access_secret as string);

  const { userId } = decoded;

  const user = await User.findById({ _id: userId }).select(
    'verification isVerified',
  );

  if (!user) {
    throw new AppError(404, 'No account found with this email.');
  }

  if (user?.isDeleted === true) {
    throw new AppError(
      403,
      'This account has been deactivated. Please contact support.',
    );
  }

  if (user?.status === 'blocked') {
    throw new AppError(
      403,
      'This account has been suspended. Please contact support.',
    );
  }

  const verifyExpiresAt = user?.verification?.expiresAt as Date;
  if (new Date() > verifyExpiresAt) {
    throw new AppError(400, 'otp has expired. Please resend it');
  }

  if (!user?.verification?.status) {
    throw new AppError(400, 'Otp is not verified yet!');
  }

  const hashedPassword = await bcrypt.hash(
    payload?.newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  const result = await User.findByIdAndUpdate(userId, {
    password: hashedPassword,
    passwordChangedAt: new Date(),
    verification: {
      otp: 0,
      status: false,
    },
  }).select('-password');

  return result;
};

const logoutUser = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(404, 'No account found with this email.');
  }

  if (user?.isDeleted === true) {
    throw new AppError(
      403,
      'This account has been deactivated. Please contact support.',
    );
  }

  if (user?.status === 'blocked') {
    throw new AppError(
      403,
      'This account has been suspended. Please contact support.',
    );
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { fcmToken: null },
    { new: true },
  );

  const tokenToUse = updatedUser?.fcmToken;

  // Send notification only if token exists AND valid
  if (tokenToUse && updatedUser?.notifications) {
    sendNotification([tokenToUse], {
      title: 'Logout successfully',
      message: 'User logged out from your account',
      receiver: updatedUser._id as any,
      receiverEmail: updatedUser.email,
      receiverRole: updatedUser.role,
      sender: updatedUser._id as any,
      type: 'text',
    });
  }

  return null;
};

const googleLogin = async (payload: {
  email: string;
  fullName: string;
  role: TRole;
  picture?: string;
  fcmToken?: string;
}) => {
  if (!payload?.email || !payload?.fullName) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Email and name are required');
  }

  /* ____________________ FCM TOKEN VALIDATION ____________________ */
  if (payload?.fcmToken) {
    const isValid = await isValidFcmToken(payload.fcmToken);
    if (!isValid) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Invalid FCM token');
    }
  }

  /* ____________________ CHECK USER EXISTS ____________________ */
  const existingUser = await User.findOne({ email: payload.email }).select(
    '-password -confirmPassword -needsPasswordChange -verification -gender',
  );

  /* ____________________ EXISTING USER LOGIN ____________________ */
  if (existingUser) {
    if (existingUser.isDeleted) {
      throw new AppError(
        403,
        'This account has been deactivated. Please contact support.',
      );
    }
    if (existingUser.status === 'blocked') {
      throw new AppError(
        403,
        'This account has been suspended. Please contact support.',
      );
    }

    /* ____________________ UPDATE FCM TOKEN ____________________ */
    if (payload?.fcmToken) {
      await User.findByIdAndUpdate(existingUser._id, {
        fcmToken: payload.fcmToken,
      });
    }

    /* ____________________ CREATE JWT ____________________ */
    const jwtPayload: TJwtPayload = {
      userId: existingUser._id.toString(),
      name: existingUser.name,
      email: existingUser.email,
      role: existingUser.role,
    };

    const accessToken = createToken(
      jwtPayload,
      config.jwt_access_secret!,
      config.jwt_access_expires_in!,
    );
    const refreshToken = createToken(
      jwtPayload,
      config.jwt_refresh_secret!,
      config.jwt_refresh_expires_in!,
    );

    return { user: existingUser, accessToken, refreshToken };
  }

  const allowedRoles: TRole[] = [USER_ROLE.user, USER_ROLE.trainer];
  const role = allowedRoles.includes(payload.role)
    ? payload.role
    : USER_ROLE.user;

  /* ____________________ NEW USER CREATE ____________________ */
  const newUser = await User.create({
    name: payload.fullName,
    email: payload.email,
    phone: null,
    role: role || USER_ROLE.trainer,
    loginWith: Login_With.google,
    isVerified: true,
    verification: { status: true },
    image: payload?.picture || null,
    fcmToken: payload?.fcmToken || null,
  });

  /* ____________________ CREATE JWT FOR NEW USER ____________________ */
  const jwtPayload: TJwtPayload = {
    userId: newUser._id.toString(),
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret!,
    config.jwt_access_expires_in!,
  );
  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret!,
    config.jwt_refresh_expires_in!,
  );

  return { user: newUser, accessToken, refreshToken };
};

const appleLogin = async (payload: {
  email: string;
  fullName: string;
  role: TRole;
  fcmToken?: string;
}) => {
  if (!payload?.email || !payload?.fullName) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Email and name are required');
  }

  /* ____________________ FCM TOKEN VALIDATION ____________________ */
  if (payload?.fcmToken) {
    const isValid = await isValidFcmToken(payload.fcmToken);
    if (!isValid) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Invalid FCM token');
    }
  }

  /* ____________________ CHECK USER EXISTS ____________________ */
  const existingUser = await User.findOne({ email: payload.email }).select(
    '-password -confirmPassword -needsPasswordChange -verification -gender',
  );

  /* ____________________ EXISTING USER LOGIN ____________________ */
  if (existingUser) {
    if (existingUser.isDeleted) {
      throw new AppError(
        403,
        'This account has been deactivated. Please contact support.',
      );
    }
    if (existingUser.status === 'blocked') {
      throw new AppError(
        403,
        'This account has been suspended. Please contact support.',
      );
    }

    /* ____________________ UPDATE FCM TOKEN ____________________ */
    if (payload?.fcmToken) {
      await User.findByIdAndUpdate(existingUser._id, {
        fcmToken: payload.fcmToken,
      });
    }

    /* ____________________ CREATE JWT ____________________ */
    const jwtPayload: TJwtPayload = {
      userId: existingUser._id.toString(),
      name: existingUser.name,
      email: existingUser.email,
      role: existingUser.role,
    };

    const accessToken = createToken(
      jwtPayload,
      config.jwt_access_secret!,
      config.jwt_access_expires_in!,
    );
    const refreshToken = createToken(
      jwtPayload,
      config.jwt_refresh_secret!,
      config.jwt_refresh_expires_in!,
    );

    return { user: existingUser, accessToken, refreshToken };
  }

  const allowedRoles: TRole[] = [USER_ROLE.user, USER_ROLE.trainer];
  const role = allowedRoles.includes(payload.role)
    ? payload.role
    : USER_ROLE.user;

  /* ____________________ NEW USER CREATE ____________________ */
  const newUser = await User.create({
    name: payload.fullName,
    email: payload.email,
    phone: null,
    role: role || USER_ROLE.user,
    loginWith: Login_With.apple,
    isVerified: true,
    verification: { status: true },
    image: null,
    fcmToken: payload?.fcmToken || null,
  });

  /* ____________________ CREATE JWT FOR NEW USER ____________________ */
  const jwtPayload: TJwtPayload = {
    userId: newUser._id.toString(),
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret!,
    config.jwt_access_expires_in!,
  );
  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret!,
    config.jwt_refresh_expires_in!,
  );

  return { user: newUser, accessToken, refreshToken };
};

export const AuthServices = {
  loginUser,
  refreshToken,
  changePassword,
  forgotPassword,
  resetPassword,
  logoutUser,
  googleLogin,
  appleLogin,
};
