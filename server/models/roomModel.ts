import mongoose, { Document, Schema } from "mongoose";
import { IRoom, RoomType, UserRole } from "../../types/chat";

export interface IRoomDocument extends Document, Omit<IRoom, "id"> {
  _id: string;
}

const roomMemberSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: false,
  },
  role: {
    type: String,
    enum: Object.values(UserRole),
    default: UserRole.MEMBER,
  },
  joinedAt: {
    type: Number,
    default: Date.now,
  },
  lastSeenAt: {
    type: Number,
    default: Date.now,
  },
  isOnline: {
    type: Boolean,
    default: false,
  },
});

const roomSchema = new Schema<IRoomDocument>(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(RoomType),
      default: RoomType.GROUP,
    },
    description: {
      type: String,
      required: false,
    },
    avatar: {
      type: String,
      required: false,
    },
    ownerId: {
      type: String,
      required: true,
      index: true,
    },
    members: [roomMemberSchema],
    lastMessage: {
      type: Schema.Types.Mixed,
      required: false,
    },
    unreadCount: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
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
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// 创建索引
roomSchema.index({ ownerId: 1, createdAt: -1 });
roomSchema.index({ "members.userId": 1 });

export const Room = mongoose.model<IRoomDocument>("Room", roomSchema);
