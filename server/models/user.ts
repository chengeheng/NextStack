import dayjs from "dayjs";
import mongoose from "mongoose";
import { v4 } from "uuid";
import { UserType, UserRoleType } from "@/types/server/user";

const Schema = mongoose.Schema;

const userSchema = new Schema<UserType>({
  id: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  createdAt: { type: Number, required: true },
  updatedAt: { type: Number, required: true },
  // 0: 账户锁定(无权限)
  // 1: 普通用户
  // 2: admin
  // 3: superadmin
  role: { type: Number, required: true },
});

userSchema.pre("validate", function (next) {
  this.id = this.id || v4();
  this.createdAt = this.createdAt || dayjs().valueOf();
  this.updatedAt = dayjs().valueOf();
  next();
});

export default mongoose.model("users", userSchema);
