"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/client/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { UserRoleType } from "@/types/server/user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";

const getUserRoleName = (role: UserRoleType): string => {
  const roleMap = {
    [UserRoleType.LOCKED]: "账户锁定",
    [UserRoleType.USER]: "普通用户",
    [UserRoleType.ADMIN]: "管理员",
    [UserRoleType.SUPERADMIN]: "超级管理员",
  };
  return roleMap[role] || "未知角色";
};

const ProfilePage = () => {
  const { user, loading } = useSelector((state: RootState) => {
    return state.user;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="space-y-4 w-full max-w-2xl p-6">
          <Skeleton className="h-12 w-12 rounded-full" />
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6">
        <Card className="max-w-2xl mx-auto border-red-500">
          <CardContent className="p-4">
            <div className="text-red-500">用户信息加载失败</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="px-6">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>个人资料</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Avatar className="h-8 w-8 cursor-pointer">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">用户名</label>
              <p className="text-sm text-muted-foreground">{user.name}</p>
            </div>

            {user.email && (
              <div>
                <label className="text-sm font-medium">邮箱</label>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            )}

            <div>
              <label className="text-sm font-medium">角色</label>
              <p className="text-sm text-muted-foreground">
                {getUserRoleName(user.role)}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium">创建时间</label>
              <p className="text-sm text-muted-foreground">
                {new Date(user.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
