import { USER_ROLE_VALUES } from '@gta6-guide/shared/roles';
import { THEME_VALUES, USER_STATUS_VALUES } from '@gta6-guide/shared/users';
import mongoose, {
  Schema,
  type HydratedDocument,
  type InferSchemaType,
  type Model,
} from 'mongoose';

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      minlength: 3,
      maxlength: 40,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    avatar: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      default: '',
      maxlength: 240,
    },
    role: {
      type: String,
      enum: USER_ROLE_VALUES,
      default: 'user',
      index: true,
    },
    status: {
      type: String,
      enum: USER_STATUS_VALUES,
      default: 'active',
      index: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    passwordChangedAt: {
      type: Date,
    },
    refreshTokenVersion: {
      type: Number,
      default: 0,
    },
    lastLoginAt: {
      type: Date,
    },
    preferences: {
      theme: {
        type: String,
        enum: THEME_VALUES,
        default: 'dark',
      },
      notifications: {
        editorial: {
          type: Boolean,
          default: true,
        },
        product: {
          type: Boolean,
          default: true,
        },
        comments: {
          type: Boolean,
          default: true,
        },
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

userSchema.index({ email: 1, status: 1 });
userSchema.index({ username: 1, status: 1 });

export type User = InferSchemaType<typeof userSchema>;
export type UserDocument = HydratedDocument<User>;
export type UserModel = Model<User>;

export const UserModel = mongoose.model<User>('User', userSchema);
