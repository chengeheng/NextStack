"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChat } from "@/client/hooks/useChat";

const RoomList: React.FC = () => {
  const { rooms, currentRoom, selectRoom } = useChat();

  return (
    <ScrollArea className="flex-1">
      <div className="p-2">
        {rooms.map((room) => (
          <div
            key={room.id}
            className={`p-3 rounded-lg cursor-pointer transition-colors ${
              currentRoom?.id === room.id
                ? "bg-blue-50 border border-blue-200"
                : "hover:bg-gray-50"
            }`}
            onClick={() => selectRoom(room)}
          >
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={room.avatar} />
                <AvatarFallback>
                  {room.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900 truncate">
                    {room.name}
                  </h3>
                  {room.unreadCount > 0 && (
                    <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-800">
                      {room.unreadCount}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 truncate">
                  {room.lastMessage?.content || "暂无消息"}
                </p>
              </div>
            </div>
          </div>
        ))}

        {rooms.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>暂无聊天房间</p>
            <p className="text-sm mt-1">点击 + 创建新房间</p>
          </div>
        )}
      </div>
    </ScrollArea>
  );
};

export default RoomList;
