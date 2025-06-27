// 消息类型枚举
export enum MessageType {
  TEXT = "text",
  IMAGE = "image",
  FILE = "file",
  SYSTEM = "system",
  COMMAND = "command",
}

// 消息状态枚举
export enum MessageStatus {
  SENDING = "sending", // 发送中
  SENT = "sent", // 已发送
  DELIVERED = "delivered", // 已送达
  READ = "read", // 已读
  FAILED = "failed", // 发送失败
}

// 命令类型枚举
export enum CommandType {
  USER_JOIN = "user_join",
  USER_LEAVE = "user_leave",
  ROOM_CREATED = "room_created",
  ROOM_DELETED = "room_deleted",
  TYPING_START = "typing_start",
  TYPING_END = "typing_end",
  MESSAGE_READ = "message_read",
}

// 房间类型枚举
export enum RoomType {
  PRIVATE = "private", // 私聊
  GROUP = "group", // 群聊
  CHANNEL = "channel", // 频道
}

// 用户角色枚举
export enum UserRole {
  OWNER = "owner", // 群主
  ADMIN = "admin", // 管理员
  MEMBER = "member", // 普通成员
}

// 消息接口
export interface IMessage {
  id: string;
  roomId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  type: MessageType;
  content: string;
  metadata?: {
    fileName?: string;
    fileSize?: number;
    fileUrl?: string;
    imageUrl?: string;
    imageWidth?: number;
    imageHeight?: number;
  };
  status: MessageStatus;
  createdAt: number;
  updatedAt: number;
  readBy: string[]; // 已读用户ID列表
  replyTo?: string; // 回复的消息ID
}

// 房间接口
export interface IRoom {
  id: string;
  name: string;
  type: RoomType;
  description?: string;
  avatar?: string;
  ownerId: string;
  members: IRoomMember[];
  lastMessage?: IMessage;
  unreadCount: number;
  createdAt: number;
  updatedAt: number;
  isActive: boolean;
}

// 房间成员接口
export interface IRoomMember {
  userId: string;
  username: string;
  avatar?: string;
  role: UserRole;
  joinedAt: number;
  lastSeenAt: number;
  isOnline: boolean;
}

// WebSocket消息接口
export interface IWebSocketMessage {
  type: "message" | "command";
  data: IMessage | ICommand;
  timestamp: number;
}

// 命令接口
export interface ICommand {
  type: CommandType;
  roomId: string;
  userId?: string;
  username?: string;
  data?: Record<string, unknown>;
  timestamp: number;
}

// 聊天状态接口
export interface IChatState {
  rooms: IRoom[];
  currentRoom: IRoom | null;
  messages: { [roomId: string]: IMessage[] };
  unreadCounts: { [roomId: string]: number };
  typingUsers: { [roomId: string]: string[] };
  onlineUsers: string[];
}

// 创建消息请求接口
export interface ICreateMessageRequest {
  roomId: string;
  type: MessageType;
  content: string;
  metadata?: Record<string, unknown>;
  replyTo?: string;
}

// 创建房间请求接口
export interface ICreateRoomRequest {
  name: string;
  type: RoomType;
  description?: string;
  memberIds: string[];
}

// 加入房间请求接口
export interface IJoinRoomRequest {
  roomId: string;
  userId: string;
}

// 消息确认接口
export interface IMessageAck {
  messageId: string;
  roomId: string;
  userId: string;
  status: MessageStatus;
  timestamp: number;
}
