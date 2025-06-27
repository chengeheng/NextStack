import { io, Socket } from "socket.io-client";
import { IMessage, ICommand, IWebSocketMessage } from "@/types/chat";

export interface SocketEventHandlers {
  onConnect?: () => void;
  onDisconnect?: () => void;
  onAuthenticated?: (success: boolean, error?: string) => void;
  onMessage?: (message: IMessage) => void;
  onCommand?: (command: ICommand) => void;
  onError?: (error: string) => void;
}

class ChatSocket {
  private socket: Socket | null = null;
  private eventHandlers: SocketEventHandlers = {};
  private isConnecting = false;

  constructor() {
    this.socket = null;
  }

  // 连接WebSocket
  connect(userId: string, token: string, handlers: SocketEventHandlers) {
    if (this.socket?.connected || this.isConnecting) {
      return;
    }

    this.eventHandlers = handlers;
    this.isConnecting = true;

    try {
      this.socket = io("http://localhost:3000", {
        transports: ["websocket", "polling"],
        timeout: 20000,
        forceNew: true,
      });

      this.setupEventListeners();

      // 连接成功后进行认证
      this.socket.on("connect", () => {
        console.log("WebSocket connected, authenticating...");
        this.eventHandlers.onConnect?.();

        // 发送认证信息
        this.socket?.emit("authenticate", { userId, token });
      });
    } catch (error) {
      console.error("Failed to create socket connection:", error);
      this.eventHandlers.onError?.("连接失败");
      this.isConnecting = false;
    }
  }

  // 设置事件监听器
  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.on(
      "authenticated",
      (data: { success: boolean; error?: string }) => {
        console.log("Authentication result:", data);
        this.isConnecting = false;
        this.eventHandlers.onAuthenticated?.(data.success, data.error);
      }
    );

    this.socket.on("message", (wsMessage: IWebSocketMessage) => {
      if (wsMessage.type === "message") {
        this.eventHandlers.onMessage?.(wsMessage.data as IMessage);
      }
    });

    this.socket.on("command", (wsMessage: IWebSocketMessage) => {
      if (wsMessage.type === "command") {
        this.eventHandlers.onCommand?.(wsMessage.data as ICommand);
      }
    });

    this.socket.on("error", (error: string) => {
      console.error("Socket error:", error);
      this.eventHandlers.onError?.(error);
    });

    this.socket.on("disconnect", (reason: string) => {
      console.log("WebSocket disconnected:", reason);
      this.isConnecting = false;
      this.eventHandlers.onDisconnect?.();
    });

    this.socket.on("connect_error", (error: Error) => {
      console.error("Connection error:", error);
      this.isConnecting = false;
      this.eventHandlers.onError?.(error.message);
    });
  }

  // 断开连接
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.isConnecting = false;
  }

  // 加入房间
  joinRoom(roomId: string) {
    if (this.socket?.connected) {
      this.socket.emit("join_room", { roomId });
    } else {
      console.warn("Socket not connected, cannot join room");
    }
  }

  // 离开房间
  leaveRoom(roomId: string) {
    if (this.socket?.connected) {
      this.socket.emit("leave_room", { roomId });
    }
  }

  // 开始输入
  startTyping(roomId: string) {
    if (this.socket?.connected) {
      this.socket.emit("typing_start", { roomId });
    }
  }

  // 结束输入
  endTyping(roomId: string) {
    if (this.socket?.connected) {
      this.socket.emit("typing_end", { roomId });
    }
  }

  // 标记消息已读
  markMessageAsRead(roomId: string, messageIds: string[]) {
    if (this.socket?.connected) {
      this.socket.emit("message_read", { roomId, messageIds });
    }
  }

  // 检查连接状态
  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  // 获取socket实例（用于调试）
  getSocket(): Socket | null {
    return this.socket;
  }
}

// 创建单例实例
const chatSocket = new ChatSocket();

export default chatSocket;
