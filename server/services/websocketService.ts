import { Server as SocketIOServer } from "socket.io";
import { Server as HTTPServer } from "http";
import {
  IWebSocketMessage,
  IMessage,
  ICommand,
  CommandType,
} from "../../types/chat";
import { Room } from "../models/roomModel";
import { User } from "../models/userModel";

interface SocketUser {
  userId: string;
  username: string;
  avatar?: string;
  rooms: string[];
}

class WebSocketService {
  private io: SocketIOServer;
  private connectedUsers: Map<string, SocketUser> = new Map();

  constructor(server: HTTPServer) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin:
          process.env.NODE_ENV === "production"
            ? false
            : "http://localhost:3000",
        methods: ["GET", "POST"],
      },
    });

    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    this.io.on("connection", (socket) => {
      console.log(`User connected: ${socket.id}`);

      // 用户认证
      socket.on(
        "authenticate",
        async (data: { userId: string; token: string }) => {
          try {
            const user = await User.findById(data.userId);
            if (user) {
              const socketUser: SocketUser = {
                userId: user.id,
                username: user.name,
                avatar: user.avatar,
                rooms: [],
              };

              this.connectedUsers.set(socket.id, socketUser);
              socket.emit("authenticated", { success: true });
              console.log(`User authenticated: ${user.name}`);
            }
          } catch (error) {
            console.error("Authentication error:", error);
            socket.emit("authenticated", {
              success: false,
              error: "Authentication failed",
            });
          }
        }
      );

      // 加入房间
      socket.on("join_room", async (data: { roomId: string }) => {
        const user = this.connectedUsers.get(socket.id);
        if (!user) {
          socket.emit("error", { message: "User not authenticated" });
          return;
        }

        try {
          const room = await Room.findById(data.roomId);
          if (!room) {
            socket.emit("error", { message: "Room not found" });
            return;
          }

          const isMember = room.members.some(
            (member) => member.userId === user.userId
          );
          if (!isMember) {
            socket.emit("error", { message: "User not in room" });
            return;
          }

          socket.join(data.roomId);
          user.rooms.push(data.roomId);

          const command: ICommand = {
            type: CommandType.USER_JOIN,
            roomId: data.roomId,
            userId: user.userId,
            username: user.username,
            timestamp: Date.now(),
          };

          this.io.to(data.roomId).emit("command", command);
          console.log(`User ${user.username} joined room ${data.roomId}`);
        } catch (error) {
          console.error("Join room error:", error);
          socket.emit("error", { message: "Failed to join room" });
        }
      });

      // 离开房间
      socket.on("leave_room", (data: { roomId: string }) => {
        const user = this.connectedUsers.get(socket.id);
        if (!user) {
          socket.emit("error", { message: "User not authenticated" });
          return;
        }

        socket.leave(data.roomId);
        user.rooms = user.rooms.filter((roomId) => roomId !== data.roomId);

        const command: ICommand = {
          type: CommandType.USER_LEAVE,
          roomId: data.roomId,
          userId: user.userId,
          username: user.username,
          timestamp: Date.now(),
        };

        this.io.to(data.roomId).emit("command", command);
        console.log(`User ${user.username} left room ${data.roomId}`);
      });

      // 开始输入
      socket.on("typing_start", (data: { roomId: string }) => {
        const user = this.connectedUsers.get(socket.id);
        if (!user) return;

        const command: ICommand = {
          type: CommandType.TYPING_START,
          roomId: data.roomId,
          userId: user.userId,
          username: user.username,
          timestamp: Date.now(),
        };

        socket.to(data.roomId).emit("command", command);
      });

      // 结束输入
      socket.on("typing_end", (data: { roomId: string }) => {
        const user = this.connectedUsers.get(socket.id);
        if (!user) return;

        const command: ICommand = {
          type: CommandType.TYPING_END,
          roomId: data.roomId,
          userId: user.userId,
          username: user.username,
          timestamp: Date.now(),
        };

        socket.to(data.roomId).emit("command", command);
      });

      // 消息已读
      socket.on(
        "message_read",
        (data: { roomId: string; messageIds: string[] }) => {
          const user = this.connectedUsers.get(socket.id);
          if (!user) return;

          const command: ICommand = {
            type: CommandType.MESSAGE_READ,
            roomId: data.roomId,
            userId: user.userId,
            username: user.username,
            data: { messageIds: data.messageIds },
            timestamp: Date.now(),
          };

          this.io.to(data.roomId).emit("command", command);
        }
      );

      // 断开连接
      socket.on("disconnect", () => {
        const user = this.connectedUsers.get(socket.id);
        if (user) {
          user.rooms.forEach((roomId) => {
            const command: ICommand = {
              type: CommandType.USER_LEAVE,
              roomId,
              userId: user.userId,
              username: user.username,
              timestamp: Date.now(),
            };
            this.io.to(roomId).emit("command", command);
          });

          this.connectedUsers.delete(socket.id);
          console.log(`User disconnected: ${user.username}`);
        }
      });
    });
  }

  // 广播消息到房间
  public broadcastMessage(roomId: string, message: IMessage) {
    const wsMessage: IWebSocketMessage = {
      type: "message",
      data: message,
      timestamp: Date.now(),
    };

    this.io.to(roomId).emit("message", wsMessage);
  }

  // 广播命令到房间
  public broadcastCommand(roomId: string, command: ICommand) {
    const wsMessage: IWebSocketMessage = {
      type: "command",
      data: command,
      timestamp: Date.now(),
    };

    this.io.to(roomId).emit("command", wsMessage);
  }

  // 获取房间在线用户
  public getRoomOnlineUsers(roomId: string): SocketUser[] {
    const onlineUsers: SocketUser[] = [];
    this.connectedUsers.forEach((user) => {
      if (user.rooms.includes(roomId)) {
        onlineUsers.push(user);
      }
    });
    return onlineUsers;
  }

  // 获取所有在线用户
  public getAllOnlineUsers(): SocketUser[] {
    return Array.from(this.connectedUsers.values());
  }
}

export default WebSocketService;
