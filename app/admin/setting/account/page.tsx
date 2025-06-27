"use client";

import { useState, useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/client/store/hooks";
import { fetchCurrentUser } from "@/client/store/slices/userSlice";
import { useUsers, deleteUser } from "@/client/apis/system/user";
import { UserSheet } from "@/client/components/admin/setting/account/userSheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Search, Edit, Trash2, User } from "lucide-react";
import { UserType, UserRoleType } from "@/types/user";
import { toast } from "sonner";

export default function AccountPage() {
  const dispatch = useAppDispatch();
  const { user: currentUser, loading: userLoading } = useAppSelector(
    (state) => state.user
  );
  const { users, isLoading, mutate } = useUsers();
  const [searchTerm, setSearchTerm] = useState("");
  const [isUserSheetOpen, setIsUserSheetOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserType | null>(null);

  // 获取当前用户信息
  useEffect(() => {
    if (!currentUser) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, currentUser]);

  // 过滤用户列表
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 获取角色显示文本
  const getRoleLabel = (role: UserRoleType) => {
    switch (role) {
      case UserRoleType.SUPERADMIN:
        return { label: "Super Admin", variant: "destructive" as const };
      case UserRoleType.ADMIN:
        return { label: "Admin", variant: "default" as const };
      case UserRoleType.USER:
        return { label: "User", variant: "secondary" as const };
      case UserRoleType.LOCKED:
        return { label: "Locked", variant: "outline" as const };
      default:
        return { label: "Unknown", variant: "outline" as const };
    }
  };

  // 处理创建用户
  const handleCreateUser = () => {
    setEditingUser(null);
    setIsUserSheetOpen(true);
  };

  // 处理编辑用户
  const handleEditUser = (user: UserType) => {
    setEditingUser(user);
    setIsUserSheetOpen(true);
  };

  // 处理删除用户
  const handleDeleteUser = async (user: UserType) => {
    if (!currentUser) return;

    // 检查权限
    if (currentUser.role < UserRoleType.ADMIN) {
      toast.error("权限不足");
      return;
    }

    // 不能删除自己
    if (user.id === currentUser.id) {
      toast.error("不能删除自己的账户");
      return;
    }

    // 检查角色权限
    if (currentUser.role <= user.role) {
      toast.error("权限不足，无法删除该用户");
      return;
    }

    try {
      await deleteUser(user.id);
      toast.success("用户删除成功");
      mutate(); // 刷新用户列表
    } catch (error) {
      toast.error("删除失败");
      console.error("Delete user error:", error);
    }
  };

  // 处理用户操作成功
  const handleUserSuccess = () => {
    mutate(); // 刷新用户列表
  };

  const pageLoading = useMemo(() => {
    return userLoading || isLoading || !currentUser;
  }, [userLoading, isLoading, currentUser]);

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-lg">Loading user information...</div>
      </div>
    );
  }

  // 检查是否有管理权限
  if (currentUser.role < UserRoleType.ADMIN) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-lg text-red-500">权限不足</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">用户管理</h2>
          <p className="text-muted-foreground">管理系统中的用户账户和权限</p>
        </div>
        <Button onClick={handleCreateUser} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          创建用户
        </Button>
      </div>

      {/* 搜索栏 */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索用户..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {/* 用户列表 */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>用户</TableHead>
              <TableHead>邮箱</TableHead>
              <TableHead>角色</TableHead>
              <TableHead>创建时间</TableHead>
              <TableHead className="px-4">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  加载中...
                </TableCell>
              </TableRow>
            ) : filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  {searchTerm ? "未找到匹配的用户" : "暂无用户"}
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => {
                const roleInfo = getRoleLabel(user.role);
                const canEdit =
                  currentUser.role > user.role || user.id === currentUser.id;
                const canDelete =
                  currentUser.role > user.role && user.id !== currentUser.id;

                return (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback>
                            <User className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">
                            ID: {user.id}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{user.email || "-"}</TableCell>
                    <TableCell>
                      <Badge variant={roleInfo.variant}>{roleInfo.label}</Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {canEdit && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditUser(user)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                        {canDelete && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteUser(user)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* 用户表单 */}
      <UserSheet
        isOpen={isUserSheetOpen}
        onClose={() => setIsUserSheetOpen(false)}
        editingUser={editingUser}
        currentUserRole={currentUser.role}
        onSuccess={handleUserSuccess}
      />
    </div>
  );
}
