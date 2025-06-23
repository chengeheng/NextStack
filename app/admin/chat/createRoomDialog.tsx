"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "../../../components/ui/textarea";
import { RoomType } from "@/types/chat";
import { useAppDispatch } from "@/client/store/hooks";
import { createRoom } from "@/client/store/slices/chatSlice";

interface CreateRoomDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateRoomDialog: React.FC<CreateRoomDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({
    name: "",
    type: RoomType.GROUP,
    description: "",
    memberIds: [] as string[],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    try {
      await dispatch(createRoom(formData)).unwrap();
      setFormData({
        name: "",
        type: RoomType.GROUP,
        description: "",
        memberIds: [],
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to create room:", error);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">创建新房间</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">房间名称</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="输入房间名称"
              required
            />
          </div>

          <div>
            <Label htmlFor="type">房间类型</Label>
            <Select
              value={formData.type}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, type: value as RoomType }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={RoomType.PRIVATE}>私聊</SelectItem>
                <SelectItem value={RoomType.GROUP}>群聊</SelectItem>
                <SelectItem value={RoomType.CHANNEL}>频道</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description">房间描述</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="输入房间描述（可选）"
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              取消
            </Button>
            <Button type="submit" disabled={!formData.name.trim()}>
              创建
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRoomDialog;
