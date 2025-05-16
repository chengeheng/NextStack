import dayjs from "dayjs";
import mongoose from "mongoose";
import { v4 } from "uuid";

const Schema = mongoose.Schema;

const userSchema = new Schema({
  uuid: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  created: { type: Number || String },
  updated: { type: Number || String },
  // 0: 账户锁定(无权限)
  // 1: 普通用户
  // 2: admin
  // 3: superadmin
  role: { type: Number, required: true },
});

userSchema.pre("validate", function (next) {
  this.uuid = this.uuid || v4();
  this.created = this.created || dayjs().valueOf();
  this.updated = dayjs().valueOf();
  next();
});

export default mongoose.model("users", userSchema);
