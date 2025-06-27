"use client";

import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/client/store/hooks";
import { fetchCurrentUser } from "@/client/store/slices/userSlice";
import { useChat } from "@/client/hooks/useChat";
import RoomList from "@/client/components/admin/chat/roomList";
import ChatArea from "@/client/components/admin/chat/chatArea";
import CreateRoomDialog from "@/client/components/admin/chat/createRoomDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function ChatPage() {
  const dispatch = useAppDispatch();
  const { user, loading: userLoading } = useAppSelector((state) => state.user);
  const { isConnected } = useChat();
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  // 获取当前用户信息
  useEffect(() => {
    if (!user) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, user]);

  if (userLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-lg">Loading user information...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-lg text-red-500">Please login first</div>
      </div>
    );
  }

  return (
    <div className="flex h-full bg-background">
      {/* 左侧房间列表 */}
      <div className="w-80 border-r border-border flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Chat Rooms</h2>
            <Button
              size="sm"
              onClick={() => setShowCreateDialog(true)}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Room
            </Button>
          </div>

          {/* 连接状态指示器 */}
          <div className="flex items-center gap-2 text-sm">
            <div
              className={`w-2 h-2 rounded-full ${
                isConnected ? "bg-green-500" : "bg-red-500"
              }`}
            />
            <span className={isConnected ? "text-green-600" : "text-red-600"}>
              {isConnected ? "Connected" : "Disconnected"}
            </span>
          </div>
        </div>

        <RoomList />
      </div>

      {/* 右侧聊天区域 */}
      <div className="flex-1 flex flex-col">
        <ChatArea />
      </div>

      {/* 创建房间对话框 */}
      <CreateRoomDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />
    </div>
  );
}
