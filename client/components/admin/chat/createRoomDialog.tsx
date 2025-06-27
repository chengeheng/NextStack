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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>创建新房间</DialogTitle>
        </DialogHeader>

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

          <DialogFooter>
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
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateRoomDialog;
