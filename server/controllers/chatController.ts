import { Request, Response } from "express";
import { Message } from "../models/messageModel";
import { Room } from "../models/roomModel";
import { User } from "../models/userModel";
import {
  ICreateMessageRequest,
  ICreateRoomRequest,
  IJoinRoomRequest,
  MessageStatus,
  UserRole,
} from "../../types/chat";
import { UserType } from "../../types/user";

interface RequestWithUser extends Request {
  userInfo: UserType;
}

export const chatController = {
  // 获取用户的所有房间
  async getUserRooms(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as RequestWithUser).userInfo.id;
      const rooms = await Room.find({
        "members.userId": userId,
        isActive: true,
      }).sort({ updatedAt: -1 });

      res.success(rooms);
    } catch (error) {
      console.error("Error fetching user rooms:", error);
      res.error(500, "Failed to fetch rooms");
    }
  },

  // 创建新房间
  async createRoom(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as RequestWithUser).userInfo.id;
      const { name, type, description, memberIds }: ICreateRoomRequest =
        req.body;

      if (!name || !type || !memberIds) {
        res.error(400, "Missing required fields");
        return;
      }

      // 获取所有成员信息
      const members = await User.find({ _id: { $in: memberIds } });
      const roomMembers = members.map((user) => ({
        userId: user._id.toString(),
        username: user.name,
        avatar: user.avatar,
        role: user._id.toString() === userId ? UserRole.OWNER : UserRole.MEMBER,
        joinedAt: Date.now(),
        lastSeenAt: Date.now(),
        isOnline: false,
      }));

      // 添加创建者到成员列表
      if (!memberIds.includes(userId)) {
        const creator = await User.findById(userId);
        if (creator) {
          roomMembers.unshift({
            userId: creator._id.toString(),
            username: creator.name,
            avatar: creator.avatar,
            role: UserRole.OWNER,
            joinedAt: Date.now(),
            lastSeenAt: Date.now(),
            isOnline: false,
          });
        }
      }

      const room = new Room({
        name,
        type,
        description,
        ownerId: userId,
        members: roomMembers,
        unreadCount: 0,
        isActive: true,
      });

      await room.save();
      res.success(room);
    } catch (error) {
      console.error("Error creating room:", error);
      res.error(500, "Failed to create room");
    }
  },

  // 获取房间消息
  async getRoomMessages(req: Request, res: Response): Promise<void> {
    try {
      const { roomId } = req.params;
      const { page = 1, limit = 50 } = req.query;
      const skip = (Number(page) - 1) * Number(limit);

      const messages = await Message.find({ roomId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit));

      res.success(messages.reverse());
    } catch (error) {
      console.error("Error fetching room messages:", error);
      res.error(500, "Failed to fetch messages");
    }
  },

  // 发送消息
  async sendMessage(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as RequestWithUser).userInfo.id;
      const {
        roomId,
        type,
        content,
        metadata,
        replyTo,
      }: ICreateMessageRequest = req.body;

      if (!roomId || !type || !content) {
        res.error(400, "Missing required fields");
        return;
      }
      console.log("sendMessage", roomId, userId);

      // 验证用户是否在房间中
      const room = await Room.findOne({
        _id: roomId,
        "members.userId": userId,
        isActive: true,
      });

      if (!room) {
        res.error(403, "User not in room");
        return;
      }

      const user = await User.findById(userId);
      if (!user) {
        res.error(404, "User not found");
        return;
      }

      const message = new Message({
        roomId,
        senderId: userId,
        senderName: user.name,
        senderAvatar: user.avatar,
        type,
        content,
        metadata,
        replyTo,
        status: MessageStatus.SENT,
        readBy: [userId], // 发送者自动标记为已读
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      await message.save();

      // 更新房间的最后消息
      await Room.findByIdAndUpdate(roomId, {
        lastMessage: {
          id: message._id.toString(),
          roomId: message.roomId,
          senderId: message.senderId,
          senderName: message.senderName,
          senderAvatar: message.senderAvatar,
          type: message.type,
          content: message.content,
          status: message.status,
          createdAt: message.createdAt,
          updatedAt: message.updatedAt,
        },
        updatedAt: Date.now(),
      });

      // 增加其他成员未读消息数
      await Room.updateMany(
        {
          _id: roomId,
          "members.userId": { $ne: userId },
        },
        { $inc: { unreadCount: 1 } }
      );

      res.success(message);
    } catch (error) {
      console.error("Error sending message:", error);
      res.error(500, "Failed to send message");
    }
  },

  // 标记消息为已读
  async markMessageAsRead(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as RequestWithUser).userInfo.id;
      const { roomId, messageIds } = req.body;

      if (!roomId || !messageIds || !Array.isArray(messageIds)) {
        res.error(400, "Missing required fields");
        return;
      }

      // 更新消息的已读状态
      await Message.updateMany(
        {
          _id: { $in: messageIds },
          roomId,
          readBy: { $ne: userId },
        },
        {
          $push: { readBy: userId },
          $set: { updatedAt: Date.now() },
        }
      );

      // 重置房间的未读消息数
      await Room.findByIdAndUpdate(roomId, {
        unreadCount: 0,
        updatedAt: Date.now(),
      });

      res.success({ message: "Messages marked as read" });
    } catch (error) {
      console.error("Error marking messages as read:", error);
      res.error(500, "Failed to mark messages as read");
    }
  },

  // 加入房间
  async joinRoom(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as RequestWithUser).userInfo.id;
      const { roomId }: IJoinRoomRequest = req.body;

      if (!roomId) {
        res.error(400, "Room ID is required");
        return;
      }

      const room = await Room.findById(roomId);
      if (!room) {
        res.error(404, "Room not found");
        return;
      }

      // 检查用户是否已经在房间中
      const existingMember = room.members.find(
        (member) => member.userId === userId
      );
      if (existingMember) {
        res.error(400, "User already in room");
        return;
      }

      const user = await User.findById(userId);
      if (!user) {
        res.error(404, "User not found");
        return;
      }

      // 添加用户到房间
      room.members.push({
        userId: user._id.toString(),
        username: user.name,
        avatar: user.avatar,
        role: UserRole.MEMBER,
        joinedAt: Date.now(),
        lastSeenAt: Date.now(),
        isOnline: false,
      });

      await room.save();
      res.success(room);
    } catch (error) {
      console.error("Error joining room:", error);
      res.error(500, "Failed to join room");
    }
  },

  // 离开房间
  async leaveRoom(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as RequestWithUser).userInfo.id;
      const { roomId } = req.params;

      const room = await Room.findById(roomId);
      if (!room) {
        res.error(404, "Room not found");
        return;
      }

      // 检查用户是否在房间中
      const memberIndex = room.members.findIndex(
        (member) => member.userId === userId
      );
      if (memberIndex === -1) {
        res.error(400, "User not in room");
        return;
      }

      // 如果是群主，不能离开（需要转让群主或解散群）
      if (room.ownerId === userId) {
        res.error(400, "Room owner cannot leave room");
        return;
      }

      // 移除用户
      room.members.splice(memberIndex, 1);
      await room.save();

      res.success({ message: "Left room successfully" });
    } catch (error) {
      console.error("Error leaving room:", error);
      res.error(500, "Failed to leave room");
    }
  },

  // 邀请用户到房间
  async inviteUsers(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as RequestWithUser).userInfo.id;
      const { roomId } = req.params;
      const { userIds }: { userIds: string[] } = req.body;

      if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
        res.error(400, "User IDs are required");
        return;
      }

      const room = await Room.findById(roomId);
      if (!room) {
        res.error(404, "Room not found");
        return;
      }

      // 检查当前用户是否是群主
      if (room.ownerId !== userId) {
        res.error(403, "Only room owner can invite users");
        return;
      }

      // 获取要邀请的用户信息
      const users = await User.find({ _id: { $in: userIds } });
      if (users.length === 0) {
        res.error(404, "No valid users found");
        return;
      }

      // 检查用户是否已经在房间中
      const existingMemberIds = room.members.map((member) => member.userId);
      const newMembers = users
        .filter((user) => !existingMemberIds.includes(user._id.toString()))
        .map((user) => ({
          userId: user._id.toString(),
          username: user.name,
          avatar: user.avatar,
          role: UserRole.MEMBER,
          joinedAt: Date.now(),
          lastSeenAt: Date.now(),
          isOnline: false,
        }));

      if (newMembers.length === 0) {
        res.error(400, "All users are already in the room");
        return;
      }

      // 添加新成员到房间
      room.members.push(...newMembers);
      await room.save();

      res.success({
        message: `Successfully invited ${newMembers.length} users`,
        invitedUsers: newMembers,
      });
    } catch (error) {
      console.error("Error inviting users:", error);
      res.error(500, "Failed to invite users");
    }
  },
};
