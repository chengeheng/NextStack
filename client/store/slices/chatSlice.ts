import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  IChatState,
  IRoom,
  IMessage,
  ICommand,
  CommandType,
} from "@/types/chat";

export interface ChatState extends IChatState {
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  rooms: [],
  currentRoom: null,
  messages: {},
  unreadCounts: {},
  typingUsers: {},
  onlineUsers: [],
  isConnected: false,
  isLoading: false,
  error: null,
};

// 异步action：获取用户房间
export const fetchUserRooms = createAsyncThunk(
  "chat/fetchUserRooms",
  async () => {
    const response = await fetch("/api/chat/rooms", {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    return data.data;
  }
);

// 异步action：创建房间
export const createRoom = createAsyncThunk(
  "chat/createRoom",
  async (roomData: {
    name: string;
    type: string;
    description?: string;
    memberIds: string[];
  }) => {
    const response = await fetch("/api/chat/rooms/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(roomData),
    });
    const data = await response.json();
    return data.data;
  }
);

// 异步action：获取房间消息
export const fetchRoomMessages = createAsyncThunk(
  "chat/fetchRoomMessages",
  async (roomId: string) => {
    const response = await fetch(`/api/chat/rooms/${roomId}/messages`);
    const data = await response.json();
    return { roomId, messages: data.data };
  }
);

// 异步action：发送消息
export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async (messageData: {
    roomId: string;
    type: string;
    content: string;
    metadata?: any;
    replyTo?: string;
  }) => {
    const response = await fetch("/api/chat/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(messageData),
    });
    const data = await response.json();
    return data.data;
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    // 设置连接状态
    setConnectionStatus: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
    },

    // 设置当前房间
    setCurrentRoom: (state, action: PayloadAction<IRoom | null>) => {
      state.currentRoom = action.payload;
    },

    // 添加消息
    addMessage: (state, action: PayloadAction<IMessage>) => {
      const message = action.payload;
      if (!state.messages[message.roomId]) {
        state.messages[message.roomId] = [];
      }
      state.messages[message.roomId].push(message);
    },

    // 添加房间
    addRoom: (state, action: PayloadAction<IRoom>) => {
      const room = action.payload;
      const existingIndex = state.rooms.findIndex((r) => r.id === room.id);
      if (existingIndex >= 0) {
        state.rooms[existingIndex] = room;
      } else {
        state.rooms.unshift(room);
      }
    },

    // 更新房间
    updateRoom: (state, action: PayloadAction<IRoom>) => {
      const room = action.payload;
      const index = state.rooms.findIndex((r) => r.id === room.id);
      if (index >= 0) {
        state.rooms[index] = room;
      }
      if (state.currentRoom?.id === room.id) {
        state.currentRoom = room;
      }
    },

    // 处理命令
    handleCommand: (state, action: PayloadAction<ICommand>) => {
      const command = action.payload;

      switch (command.type) {
        case CommandType.TYPING_START:
          if (!state.typingUsers[command.roomId]) {
            state.typingUsers[command.roomId] = [];
          }
          if (
            command.username &&
            !state.typingUsers[command.roomId].includes(command.username)
          ) {
            state.typingUsers[command.roomId].push(command.username);
          }
          break;

        case CommandType.TYPING_END:
          if (state.typingUsers[command.roomId] && command.username) {
            state.typingUsers[command.roomId] = state.typingUsers[
              command.roomId
            ].filter((user) => user !== command.username);
          }
          break;

        case CommandType.MESSAGE_READ:
          // 处理消息已读状态
          break;
      }
    },

    // 清除错误
    clearError: (state) => {
      state.error = null;
    },

    // 重置状态
    resetChat: (state) => {
      state.rooms = [];
      state.currentRoom = null;
      state.messages = {};
      state.unreadCounts = {};
      state.typingUsers = {};
      state.onlineUsers = [];
      state.isConnected = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchUserRooms
      .addCase(fetchUserRooms.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserRooms.fulfilled, (state, action) => {
        state.isLoading = false;
        state.rooms = action.payload;
      })
      .addCase(fetchUserRooms.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch rooms";
      })
      // createRoom
      .addCase(createRoom.fulfilled, (state, action) => {
        const room = action.payload;
        const existingIndex = state.rooms.findIndex((r) => r.id === room.id);
        if (existingIndex >= 0) {
          state.rooms[existingIndex] = room;
        } else {
          state.rooms.unshift(room);
        }
      })
      // fetchRoomMessages
      .addCase(fetchRoomMessages.fulfilled, (state, action) => {
        const { roomId, messages } = action.payload;
        state.messages[roomId] = messages;
      })
      // sendMessage
      .addCase(sendMessage.fulfilled, (state, action) => {
        const message = action.payload;
        if (!state.messages[message.roomId]) {
          state.messages[message.roomId] = [];
        }
        state.messages[message.roomId].push(message);
      });
  },
});

export const {
  setConnectionStatus,
  setCurrentRoom,
  addMessage,
  addRoom,
  updateRoom,
  handleCommand,
  clearError,
  resetChat,
} = chatSlice.actions;

export default chatSlice.reducer;
