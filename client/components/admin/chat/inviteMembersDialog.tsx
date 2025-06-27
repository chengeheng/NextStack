"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Check, Search, UserPlus } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/client/store/hooks";
import { fetchUserRooms } from "@/client/store/slices/chatSlice";
import { UserType } from "@/types/user";

interface InviteMembersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roomId: string;
}

const InviteMembersDialog: React.FC<InviteMembersDialogProps> = ({
  open,
  onOpenChange,
  roomId,
}) => {
  const dispatch = useAppDispatch();
  const currentRoom = useAppSelector((state) => state.chat.currentRoom);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [allUsers, setAllUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(false);

  // 获取所有用户列表
  useEffect(() => {
    if (open) {
      fetchAllUsers();
    }
  }, [open]);

  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/system/users");
      const data = await response.json();
      if (data.code === 0) {
        setAllUsers(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  // 刷新房间列表
  const refreshRoomList = async () => {
    try {
      await dispatch(fetchUserRooms()).unwrap();
    } catch (error) {
      console.error("Failed to refresh room list:", error);
    }
  };

  // 过滤用户列表（排除已在房间中的用户）
  const filteredUsers = allUsers.filter((user) => {
    const isInRoom = currentRoom?.members.some(
      (member) => member.userId === user.id
    );
    const matchesSearch = user.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return !isInRoom && matchesSearch;
  });

  const handleUserToggle = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleInvite = async () => {
    if (selectedUsers.length === 0) return;

    try {
      // 这里需要实现邀请用户的API调用
      // await dispatch(inviteUsers({ roomId, userIds: selectedUsers })).unwrap();

      // 临时实现：直接调用API
      const response = await fetch(`/api/chat/rooms/${roomId}/invite`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userIds: selectedUsers }),
      });

      if (response.ok) {
        setSelectedUsers([]);
        onOpenChange(false);

        // 邀请成功后刷新房间列表
        await refreshRoomList();
      }
    } catch (error) {
      console.error("Failed to invite users:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>邀请成员</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* 搜索框 */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="搜索用户..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* 用户列表 */}
          <div className="max-h-60 overflow-y-auto space-y-2">
            {loading ? (
              <div className="text-center py-4 text-gray-500">加载中...</div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                {searchTerm ? "没有找到匹配的用户" : "没有可邀请的用户"}
              </div>
            ) : (
              filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleUserToggle(user.id)}
                >
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-sm font-medium">{user.name}</div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {selectedUsers.includes(user.id) && (
                      <Badge variant="default" className="text-xs">
                        <Check className="h-3 w-3 mr-1" />
                        已选择
                      </Badge>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button onClick={handleInvite} disabled={selectedUsers.length === 0}>
            <UserPlus className="h-4 w-4 mr-2" />
            邀请 ({selectedUsers.length})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InviteMembersDialog;
