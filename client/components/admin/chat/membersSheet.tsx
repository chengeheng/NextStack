"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Users, UserPlus, Crown, Shield } from "lucide-react";
import { useAppSelector } from "@/client/store/hooks";
import { IRoom, UserRole } from "@/types/chat";
import InviteMembersDialog from "@/client/components/admin/chat/inviteMembersDialog";

interface MembersSheetProps {
  room: IRoom;
}

const MembersSheet: React.FC<MembersSheetProps> = ({ room }) => {
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const currentUser = useAppSelector((state) => state.user.user);

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case UserRole.OWNER:
        return <Crown className="h-3 w-3 text-yellow-600" />;
      case UserRole.ADMIN:
        return <Shield className="h-3 w-3 text-blue-600" />;
      default:
        return null;
    }
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case UserRole.OWNER:
        return "群主";
      case UserRole.ADMIN:
        return "管理员";
      case UserRole.MEMBER:
        return "成员";
      default:
        return "成员";
    }
  };

  const isOwner = currentUser?.id === room.ownerId;

  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Button size="sm" variant="ghost">
            <Users className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>房间成员 ({room.members.length})</SheetTitle>
          </SheetHeader>

          <div className="flex flex-col h-full">
            {/* 邀请按钮 */}
            <div className="p-4 border-b">
              <Button
                onClick={() => setShowInviteDialog(true)}
                className="w-full"
                disabled={!isOwner}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                邀请成员
              </Button>
              {!isOwner && (
                <p className="text-xs text-gray-500 mt-1">
                  只有群主可以邀请成员
                </p>
              )}
            </div>

            {/* 成员列表 */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {room.members.map((member) => (
                <div
                  key={member.userId}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback>
                        {member.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">
                          {member.username}
                        </span>
                        {getRoleIcon(member.role)}
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {getRoleLabel(member.role)}
                        </Badge>
                        {member.isOnline && (
                          <Badge variant="default" className="text-xs">
                            在线
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(member.joinedAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <InviteMembersDialog
        open={showInviteDialog}
        onOpenChange={setShowInviteDialog}
        roomId={room.id}
      />
    </>
  );
};

export default MembersSheet;
