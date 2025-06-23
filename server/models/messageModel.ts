import mongoose, { Document, Schema } from "mongoose";
import { IMessage, MessageType, MessageStatus } from "../../types/chat";

export interface IMessageDocument extends Document, Omit<IMessage, "id"> {
  _id: string;
}

const messageSchema = new Schema<IMessageDocument>(
  {
    roomId: {
      type: String,
      required: true,
      index: true,
    },
    senderId: {
      type: String,
      required: true,
      index: true,
    },
    senderName: {
      type: String,
      required: true,
    },
    senderAvatar: {
      type: String,
      required: false,
    },
    type: {
      type: String,
      enum: Object.values(MessageType),
      default: MessageType.TEXT,
    },
    content: {
      type: String,
      required: true,
    },
    metadata: {
      fileName: String,
      fileSize: Number,
      fileUrl: String,
      imageUrl: String,
      imageWidth: Number,
      imageHeight: Number,
    },
    status: {
      type: String,
      enum: Object.values(MessageStatus),
      default: MessageStatus.SENDING,
    },
    readBy: [
      {
        type: String,
        default: [],
      },
    ],
    replyTo: {
      type: String,
      required: false,
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
messageSchema.index({ roomId: 1, createdAt: -1 });
messageSchema.index({ senderId: 1, createdAt: -1 });

export const Message = mongoose.model<IMessageDocument>(
  "Message",
  messageSchema
);
