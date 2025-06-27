import { useEffect, useRef, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/client/store/hooks";
import {
  fetchUserRooms,
  fetchRoomMessages,
  sendMessage as sendMessageAction,
  setConnectionStatus,
  setCurrentRoom,
  addMessage,
  handleCommand,
  clearError,
} from "@/client/store/slices/chatSlice";
import chatSocket, { SocketEventHandlers } from "@/client/utils/chat/socket";
import { IMessage, ICommand, IRoom, MessageType } from "@/types/chat";

export const useChat = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);
  const {
    rooms,
    currentRoom,
    messages,
    typingUsers,
    isConnected,
    isLoading,
    error,
  } = useAppSelector((state) => state.chat);

  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 初始化socket连接
  const initializeSocket = useCallback(() => {
    if (!user?.id) {
      console.warn("User not available, cannot initialize socket");
      return;
    }

    const handlers: SocketEventHandlers = {
      onConnect: () => {
        console.log("Socket connected");
        dispatch(setConnectionStatus(true));
      },
      onDisconnect: () => {
        console.log("Socket disconnected");
        dispatch(setConnectionStatus(false));
      },
      onAuthenticated: (success, error) => {
        if (success) {
          console.log("Socket authenticated successfully");
          dispatch(fetchUserRooms());
        } else {
          console.error("Socket authentication failed:", error);
          dispatch(clearError());
        }
      },
      onMessage: (message: IMessage) => {
        console.log("Received message:", message);
        dispatch(addMessage(message));
      },
      onCommand: (command: ICommand) => {
        console.log("Received command:", command);
        dispatch(handleCommand(command));
      },
      onError: (error: string) => {
        console.error("Socket error:", error);
        dispatch(clearError());
      },
    };

    // 这里应该从cookie或localStorage获取token
    const token = "auth-token"; // 临时使用固定token
    chatSocket.connect(user.id, token, handlers);
  }, [user?.id, dispatch]);

  // 断开socket连接
  const disconnectSocket = useCallback(() => {
    chatSocket.disconnect();
    dispatch(setConnectionStatus(false));
  }, [dispatch]);

  // 选择房间
  const selectRoom = useCallback(
    async (room: IRoom) => {
      dispatch(setCurrentRoom(room));

      if (chatSocket.isConnected()) {
        chatSocket.joinRoom(room.id);
      }

      // 加载房间消息
      try {
        await dispatch(fetchRoomMessages(room.id)).unwrap();
      } catch (error) {
        console.error("Failed to load room messages:", error);
      }
    },
    [dispatch]
  );

  // 发送消息
  const sendMessage = useCallback(
    async (content: string, roomId?: string) => {
      const targetRoomId = roomId || currentRoom?.id;
      if (!targetRoomId || !content.trim()) return;

      const messageData = {
        roomId: targetRoomId,
        type: MessageType.TEXT,
        content: content.trim(),
      };

      try {
        await dispatch(sendMessageAction(messageData)).unwrap();

        // 停止输入状态
        if (chatSocket.isConnected()) {
          chatSocket.endTyping(targetRoomId);
        }
      } catch (error) {
        console.error("Failed to send message:", error);
      }
    },
    [dispatch, currentRoom?.id]
  );

  // 处理输入状态
  const handleTyping = useCallback(
    (isTyping: boolean, roomId?: string) => {
      const targetRoomId = roomId || currentRoom?.id;
      if (!targetRoomId || !chatSocket.isConnected()) return;

      if (isTyping) {
        chatSocket.startTyping(targetRoomId);
      } else {
        // 重置输入超时
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }

        typingTimeoutRef.current = setTimeout(() => {
          chatSocket.endTyping(targetRoomId);
        }, 1000);
      }
    },
    [currentRoom?.id]
  );

  // 标记消息已读
  const markMessageAsRead = useCallback(
    (messageIds: string[], roomId?: string) => {
      const targetRoomId = roomId || currentRoom?.id;
      if (!targetRoomId || !chatSocket.isConnected()) return;

      chatSocket.markMessageAsRead(targetRoomId, messageIds);
    },
    [currentRoom?.id]
  );

  // 初始化
  useEffect(() => {
    if (user?.id) {
      initializeSocket();
    }

    return () => {
      disconnectSocket();
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [user?.id, initializeSocket, disconnectSocket]);

  // 获取当前房间的消息
  const currentMessages = currentRoom ? messages[currentRoom.id] || [] : [];

  // 获取当前房间的输入状态
  const currentTypingUsers = currentRoom
    ? typingUsers[currentRoom.id] || []
    : [];

  return {
    // 状态
    rooms,
    currentRoom,
    messages: currentMessages,
    typingUsers: currentTypingUsers,
    isConnected,
    isLoading,
    error,

    // 方法
    selectRoom,
    sendMessage,
    handleTyping,
    markMessageAsRead,
    disconnectSocket,
  };
};
