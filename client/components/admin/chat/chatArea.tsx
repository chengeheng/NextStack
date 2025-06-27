"use client";

import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Send, MoreVertical } from "lucide-react";
import { useChat } from "@/client/hooks/useChat";
import { useAppSelector } from "@/client/store/hooks";
import { IMessage } from "@/types/chat";
import MembersSheet from "@/client/components/admin/chat/membersSheet";

const ChatArea: React.FC = () => {
  const { currentRoom, messages, typingUsers, sendMessage, handleTyping } =
    useChat();
  const { user } = useAppSelector((state) => state.user);
  const [messageInput, setMessageInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 格式化时间
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // 处理输入变化
  const handleInputChange = (value: string) => {
    setMessageInput(value);
    handleTyping(true);
  };

  // 处理发送消息
  const handleSendMessage = () => {
    if (!messageInput.trim()) return;

    sendMessage(messageInput);
    setMessageInput("");
    handleTyping(false);
  };

  // 处理回车发送
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // 判断消息是否为自己发送的
  const isOwnMessage = (message: IMessage) => {
    return message.senderId === user?.id;
  };

  return (
    <div className="flex-1 flex flex-col">
      {currentRoom ? (
        <>
          {/* 聊天头部 */}
          <div className="bg-white border-b border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={currentRoom.avatar} />
                  <AvatarFallback>
                    {currentRoom.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-sm font-medium">{currentRoom.name}</h3>
                  <p className="text-xs text-gray-500">
                    {currentRoom.members.length} 成员
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <MembersSheet room={currentRoom} />
                <Button size="sm" variant="ghost">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* 消息列表 */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => {
                const ownMessage = isOwnMessage(message);
                return (
                  <div
                    key={message.id}
                    className={`flex items-start space-x-3 ${
                      ownMessage ? "flex-row-reverse space-x-reverse" : ""
                    }`}
                  >
                    <Avatar className="h-8 w-8 mt-1">
                      <AvatarImage src={message.senderAvatar} />
                      <AvatarFallback>
                        {message.senderName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`flex-1 ${ownMessage ? "text-right" : ""}`}>
                      <div
                        className={`flex items-center space-x-2 ${
                          ownMessage ? "justify-end" : ""
                        }`}
                      >
                        <span className="text-sm font-medium">
                          {message.senderName}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatTime(message.createdAt)}
                        </span>
                      </div>
                      <div
                        className={`mt-1 text-sm text-gray-900 ${
                          ownMessage
                            ? "bg-blue-500 text-white rounded-lg rounded-tr-none px-3 py-2 inline-block"
                            : "bg-gray-100 rounded-lg rounded-tl-none px-3 py-2 inline-block"
                        }`}
                      >
                        {message.content}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* 输入状态提示 */}
              {typingUsers.length > 0 && (
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                  <span>{typingUsers.join(", ")} 正在输入...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* 消息输入 */}
          <div className="bg-white border-t border-gray-200 p-4">
            <div className="flex items-center space-x-2">
              <Input
                value={messageInput}
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="输入消息..."
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!messageInput.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      ) : (
        /* 空状态 */
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              选择一个聊天房间
            </h3>
            <p className="text-gray-500">从左侧选择一个房间开始聊天</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatArea;
