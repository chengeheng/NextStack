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
      enum: [
        UserRoleType.LOCKED,
        UserRoleType.USER,
        UserRoleType.ADMIN,
        UserRoleType.SUPERADMIN,
      ],
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
    toJSON: {
      transform: (doc, ret) => {
        // 转换 _id 为 id
        ret.id = ret._id.toString();
        delete ret._id;

        // 删除不需要的字段
        delete ret.__v;
        delete ret.password;

        // 添加额外的计算字段
        ret.roleName = UserRoleType[ret.role];

        return ret;
      },
    },
    toObject: {
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        delete ret.password;
        ret.roleName = UserRoleType[ret.role];
        return ret;
      },
    },
  }
);

// 创建索引
userSchema.index({ name: 1 }, { unique: true });
userSchema.index({ email: 1 }, { sparse: true });

// 添加虚拟字段
userSchema.virtual("isAdmin").get(function () {
  return (
    this.role === UserRoleType.ADMIN || this.role === UserRoleType.SUPERADMIN
  );
});

// 添加实例方法
userSchema.methods.toPublicJSON = function () {
  const obj = this.toJSON();
  // 可以在这里添加更多的数据转换逻辑
  return obj;
};

// 添加静态方法
userSchema.statics.findByRole = function (role: UserRoleType) {
  return this.find({ role });
};

export const User = mongoose.model<IUser>("User", userSchema);
