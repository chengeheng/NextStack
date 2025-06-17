"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/client/store";
import { fetchCurrentUser } from "@/client/store/slices/userSlice";
import { User } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { UserRoleType } from "@/types/server/user";

const getUserRoleName = (role: UserRoleType): string => {
  switch (role) {
    case UserRoleType.LOCKED:
      return "已锁定";
    case UserRoleType.USER:
      return "普通用户";
    case UserRoleType.ADMIN:
      return "管理员";
    case UserRoleType.SUPERADMIN:
      return "超级管理员";
    default:
      return "未知角色";
  }
};

const ProfilePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, loading, error } = useSelector(
    (state: RootState) => state.user
  );

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

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

  if (error) {
    return (
      <div className="p-6">
        <Card className="max-w-2xl mx-auto border-red-500">
          <CardContent className="p-4">
            <div className="text-red-500">{error}</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>User Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
              {user?.avatar ? (
                <Image
                  src={user.avatar}
                  alt={user.name}
                  width={64}
                  height={64}
                  className="rounded-full object-cover"
                />
              ) : (
                <User className="h-8 w-8 text-gray-500" />
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold">{user?.name}</h2>
              <p className="text-gray-600">{user?.email}</p>
              <Separator className="my-2" />
              <p className="text-gray-500">
                Role:{" "}
                {user?.role !== undefined ? getUserRoleName(user.role) : "未知"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
