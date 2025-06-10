import mongoose, { Document, Schema } from "mongoose";
import { UserType, UserRoleType } from "../../types/server/user";

export interface IUser extends Document, Omit<UserType, "id"> {
  _id: string;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: false,
    },
    role: {
      type: Number,
      enum: Object.values(UserRoleType),
      default: UserRoleType.USER,
    },
    createdAt: {
      type: Number,
      default: Date.now,
    },
    updatedAt: {
      type: Number,
      default: Date.now,
    },
  },
  {
    timestamps: {
      currentTime: () => Date.now(),
    },
  }
);

// 创建索引
userSchema.index({ name: 1 }, { unique: true });
userSchema.index({ email: 1 }, { sparse: true });

export const User = mongoose.model<IUser>("User", userSchema);
