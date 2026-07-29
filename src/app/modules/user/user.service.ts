import mongoose from 'mongoose';
import AppError from '../../errors/AppError';
import { TUser } from './user.interface';
import { User } from './user.model';
import { sendEmail } from '../../utils/sendEmail';
import QueryBuilder from '../../builder/QueryBuilder';
import { userSearchableFields } from './user.constant';
import { deleteFromS3, uploadToS3 } from '../../utils/awsS3FileUploader';
import { TJwtPayload } from '../auth/auth.interface';
import { createToken } from '../auth/auth.utils';
import config from '../../config';
import { generateOtp } from '../../utils/generateOtp';
import moment from 'moment';

const signupUserIntoDB = async (payload: TUser) => {
  // 1. Check if user already exists
  const existingUser = await User.findOne({ email: payload.email });
  if (existingUser) {
    throw new AppError(409, `${payload.email} already exists. Please Login`);
  }

  // 2. Generate OTP and expiration
  const otp = generateOtp();
  const expiresAt = moment().add(5, 'minutes').toDate();

  // 3. Prepare data with verification details
  const userData: Partial<TUser> = {
    ...payload,
    role: 'trainer',
    isVerified: false,
    verification: {
      otp,
      expiresAt,
      status: false,
    },
  };

  // 4. Create user in DB
  const result = await User.create(userData);

  // 5. Create JWT token (optional for next step)
  const jwtPayload: TJwtPayload = {
    userId: result._id,
    name: result?.name,
    email: result?.email,
    role: result?.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    '30m',
  );

  // 6. Send OTP email
  await sendEmail(
    result.email,
    'Your OTP Code',
    `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>OTP Verification</title>
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
                Verify Your Email
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 40px;">
              <p style="font-size: 15px; color: #333333; margin: 0 0 8px 0; text-align: center;">
                We have just sent you a code to verify your email
              </p>
              <p style="font-size: 15px; color: #1F5C5C; font-weight: 600; margin: 0 0 30px 0; text-align: center;">
                ${result.email}
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
                This code is valid until <strong style="color: #1F5C5C;">${expiresAt.toLocaleString()}</strong>
              </p>

              <hr style="border: none; border-top: 1px solid #eeeeee; margin: 30px 0;" />

              <p style="font-size: 13px; color: #999999; text-align: center; margin: 0;">
                If you did not request this code, you can safely ignore this email.
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

  return { accessToken };
};

const getAllUsersFromDB = async (query: Record<string, unknown>) => {
  const baseQuery = {
    ...query,
    isDeleted: false,
    role: { $nin: ['admin'] },
  };

  const queryBuilder = new QueryBuilder(User.find(), baseQuery)
    .search(userSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await queryBuilder.countTotal();
  const result = await queryBuilder.modelQuery;

  return { meta, result };
};

const getUserByIdFromDB = async (id: string) => {
  const result = await User.findById(id).select('-password');

  if (!result) {
    throw new AppError(404, 'This user not found');
  }

  if (result?.isDeleted === true) {
    throw new AppError(403, 'This user is deleted!');
  }

  if (result?.status === 'blocked') {
    throw new AppError(403, 'This user is blocked!');
  }

  return result;
};

const getUserProfileFromDB = async (email: string) => {
  const result = await User.findOne({ email: email }).select('-password');

  if (!result) {
    throw new AppError(404, 'This user not found');
  }

  if (result?.isDeleted === true) {
    throw new AppError(403, 'This user is deleted!');
  }

  if (result?.status === 'blocked') {
    throw new AppError(403, 'This user is blocked!');
  }

  return result;
};

const updateUserProfileIntoDB = async (
  email: string,
  payload: Partial<TUser>,
  file?: Express.Multer.File,
) => {
  // 🔍 Step 1: Check if user exists & get email
  const existingUser = await User.findOne({ email }).select('userId image');
  if (!existingUser) {
    throw new AppError(404, 'User not found');
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 📸 Step 2: Handle image upload
    if (file) {
      const uploadedUrl = await uploadToS3({
        file,
        fileName: `images/user/profile/${Date.now()}-${Math.floor(
          1000 + Math.random() * 9000,
        )}`,
      });

      // 🧹 Delete old image if exists
      if (existingUser.image) {
        await deleteFromS3(existingUser.image);
      }

      payload.image = uploadedUrl as string;
    }

    // 📝 Step 3: Update linked User
    const updatedUser = await User.findByIdAndUpdate(
      existingUser._id, // ✅ correct user reference
      { $set: { ...payload } },
      { new: true, runValidators: true, session },
    );
    if (!updatedUser) {
      throw new AppError(400, 'Failed to update user');
    }

    // ✅ Step 5: Commit transaction
    await session.commitTransaction();
    session.endSession();

    return updatedUser;
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    throw new AppError(500, error.message || 'User profile update failed');
  }
};

const updateUserPictureIntoDB = async (
  email: string,
  file: Express.Multer.File,
) => {
  // 🔍 Step 1: Check if user exists
  const existingUser = await User.findOne({ email }).select(
    'image status isDeleted',
  );
  if (!existingUser) {
    throw new AppError(404, 'User not found');
  }

  if (existingUser.isDeleted) {
    throw new AppError(403, 'This user is deleted!');
  }

  if (existingUser.status === 'blocked') {
    throw new AppError(403, 'This user is blocked!');
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const payload: Record<string, any> = {};

    // 📸 Step 2: Handle image upload
    if (file) {
      const uploadedUrl = await uploadToS3({
        file,
        fileName: `images/user/profile/${Date.now()}-${Math.floor(
          1000 + Math.random() * 9000,
        )}`,
      });

      // 🧹 Delete old image if exists
      if (existingUser.image) {
        await deleteFromS3(existingUser.image);
      }

      payload.image = uploadedUrl; // ✅ set image in payload
    }

    // 📝 Step 3: Update user
    const updatedUser = await User.findByIdAndUpdate(
      existingUser._id,
      { $set: payload },
      { new: true, runValidators: true, session },
    ).select('_id name email image');

    if (!updatedUser) {
      throw new AppError(400, 'Failed to update user');
    }

    // ✅ Step 4: Commit transaction
    await session.commitTransaction();
    session.endSession();

    return updatedUser;
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    throw new AppError(500, error.message || 'User profile update failed');
  }
};

const changeStatusIntoDB = async (id: string, payload: { status: string }) => {
  const result = await User.findByIdAndUpdate(id, payload, { new: true });

  if (!result) {
    throw new AppError(404, 'User not found');
  }

  return result;
};

const deleteUserAccountFromDB = async (userId: string) => {
  // 1️⃣ Check if user exists
  const user = await User.findById(userId);
  if (!user) throw new AppError(404, 'User not found');

  // 2️⃣ Mark account as deleted
  const deletedUser = await User.findByIdAndUpdate(
    userId,
    { isDeleted: true },
    { new: true },
  );
  if (!deletedUser) throw new AppError(400, 'Failed to delete user account');

  // 3️⃣ Send notification email
  const emailHtml = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Account Deleted</title>
  </head>
  <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Arial, sans-serif; background-color: #f4f6f6;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f6f6; padding: 40px 0;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.06);">

            <!-- Header -->
            <tr>
              <td align="center" style="background-color: #D93025; padding: 30px 40px;">
                <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 600;">
                  Account Deleted
                </h1>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding: 40px;">
                <p style="font-size: 15px; color: #333333; margin: 0 0 8px 0;">
                  Hi <strong>${deletedUser.name || 'User'}</strong>,
                </p>
                <p style="font-size: 15px; color: #333333; line-height: 1.6; margin: 0 0 20px 0;">
                  This is to confirm that your account associated with
                  <strong style="color: #1F5C5C;">${deletedUser.email}</strong>
                  has been successfully deleted, either as per your request or by admin action.
                </p>

                <!-- Warning box -->
                <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #FFF4F4; border-left: 4px solid #D93025; border-radius: 6px; margin: 20px 0;">
                  <tr>
                    <td style="padding: 16px 20px;">
                      <p style="font-size: 14px; color: #B02A2A; margin: 0; line-height: 1.5;">
                        If you did not request this action, please contact our support team
                        immediately — your data may still be recoverable within a limited period.
                      </p>
                    </td>
                  </tr>
                </table>

                <!-- Support CTA -->
                <table align="center" cellpadding="0" cellspacing="0" style="margin-top: 24px;">
                  <tr>
                    <td align="center" style="background-color: #1F5C5C; border-radius: 6px;">
                      <a href="mailto:support@intentionalfitness.com"
                         style="display: inline-block; padding: 12px 28px; font-size: 14px; font-weight: 600; color: #ffffff; text-decoration: none;">
                        Contact Support
                      </a>
                    </td>
                  </tr>
                </table>

                <hr style="border: none; border-top: 1px solid #eeeeee; margin: 30px 0;" />

                <p style="font-size: 13px; color: #999999; text-align: center; margin: 0;">
                  We're sorry to see you go. Thank you for being a part of our community.
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
`;

  await sendEmail(deletedUser.email, 'Account Deleted', emailHtml);

  return deletedUser;
};

const updateNotificationSettingsIntoDB = async (
  email: string,
  notifications: boolean,
) => {
  // 🔍 Step 1: Check if user exists & get email
  const existingUser = await User.findOne({ email }).select('');
  if (!existingUser) {
    throw new AppError(404, 'User not found');
  }

  if (existingUser?.isDeleted === true) {
    throw new AppError(403, 'This user account is deleted!');
  }

  if (existingUser?.status === 'blocked') {
    throw new AppError(403, 'This user is blocked!');
  }

  const updatedUser = await User.findOneAndUpdate(
    { email: email },
    { notifications },
    {
      new: true,
      runValidators: true,
    },
  ).select('email notifications fullName');

  if (!updatedUser) {
    throw new AppError(400, 'Notification settings update failed');
  }

  return updatedUser;
};

export const UserServices = {
  signupUserIntoDB,
  getAllUsersFromDB,
  getUserByIdFromDB,
  getUserProfileFromDB,
  updateUserProfileIntoDB,
  updateUserPictureIntoDB,
  changeStatusIntoDB,
  deleteUserAccountFromDB,
  updateNotificationSettingsIntoDB,
};
