import mongoose, { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import config from '../../config';
import { TUser, UserModel } from './user.interface';
import { Gender, Login_With, UserRole, UserStatus } from './user.constant';

const userSchema = new Schema<TUser, UserModel>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [3, 'Name must be at least 3 characters'],
      maxlength: [20, 'Name can not exceed 20 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      unique: true,
      sparse: true,
      lowercase: true,
      validate: {
        validator: function (v: string) {
          if (!v) return true;
          return /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(v);
        },
        message: 'Invalid email address',
      },
    },
    phone: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
      default: null,
      validate: {
        validator: function (v) {
          if (!v) return true;
          return /^\+[1-9]\d{7,14}$/.test(v);
        },
        message: (props) =>
          `${props.value} is not a valid international phone number`,
      },
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      trim: true,
      minlength: [8, 'Password can be minimum 8 characters'],
    },
    confirmPassword: {
      type: String,
      required: [true, 'Password is required'],
      trim: true,
      minlength: [8, 'Password can be minimum 8 characters'],
    },
    needsPasswordChange: {
      type: Boolean,
      default: false,
    },
    passwordChangeAt: {
      type: Date,
    },
    image: {
      type: String,
      trim: true,
      default: null,
    },
    gender: {
      type: String,
      enum: {
        values: Gender,
        message: '{VALUE} is not valid',
      },
      trim: true,
      required: false,
      default: null,
    },
    role: {
      type: String,
      enum: {
        values: UserRole,
        message: '{VALUE} is not valid',
      },
      default: 'user',
    },
    status: {
      type: String,
      enum: {
        values: UserStatus,
        message: '{VALUE} is not valid',
      },
      default: 'ongoing',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verification: {
      otp: {
        type: mongoose.Schema.Types.Mixed,
        default: null,
      },
      expiresAt: {
        type: Date,
        default: null,
      },
      status: {
        type: Boolean,
        default: false,
      },
    },
    loginWith: {
      type: String,
      enum: Login_With,
      default: Login_With.credentials,
    },
    trainer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    fcmToken: {
      type: String,
      default: null,
    },
    notifications: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre('save', async function (next) {
  const user = this;

  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds),
  );

  user.confirmPassword = await bcrypt.hash(
    user.confirmPassword,
    Number(config.bcrypt_salt_rounds),
  );

  next();
});

// set '' after saving password
userSchema.post('save', function (doc, next) {
  doc.password = '';
  doc.confirmPassword = '';
  next();
});

userSchema.statics.isUserExistsByEmail = async function (email: string) {
  return await User.findOne({ email }).select('+password');
};

userSchema.statics.isJWTIssuedBeforePasswordChanged = async function (
  passwordChangedTimestamp: Date,
  jwtIssuedTimestamp: number,
) {
  const passwordChangedTime =
    new Date(passwordChangedTimestamp).getTime() / 100;

  return passwordChangedTime > jwtIssuedTimestamp;
};

userSchema.statics.isPasswordMatched = async function (
  plainTextPassword,
  hashPassword,
) {
  return await bcrypt.compare(plainTextPassword, hashPassword);
};

userSchema.statics.isJWTIssuedBeforePasswordChanged = async function (
  passwordChangedTimestamp: Date,
  jwtIssuedTimestamp: number,
) {
  const passwordChangedTime =
    new Date(passwordChangedTimestamp).getTime() / 100;

  return passwordChangedTime > jwtIssuedTimestamp;
};

export const User = model<TUser, UserModel>('User', userSchema);
