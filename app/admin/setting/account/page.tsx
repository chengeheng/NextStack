"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { UserType, UserRoleType } from "@/types/server/user";
import { useUsers, deleteUser } from "@/client/apis/system/user";
import { toast } from "sonner";
import { UserSheet } from "./userSheet";

const UserManagement = () => {
  const { users, isLoading, isError, mutate } = useUsers();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserType | null>(null);
  const [currentUserRole] = useState<UserRoleType>(UserRoleType.ADMIN); // This should come from your auth context

  // Handle delete
  const handleDelete = async (id: string) => {
    try {
      await deleteUser(id);
      toast.success("User deleted successfully");
      mutate(); // Refresh the user list
    } catch (err) {
      toast.error("Failed to delete user");
      console.error("Failed to delete user:", err);
    }
  };

  const openDrawer = (user?: UserType) => {
    if (user) {
      setEditingUser(user);
    } else {
      setEditingUser(null);
    }
    setIsDrawerOpen(true);
  };

  const roleMap = {
    [UserRoleType.LOCKED]: "Locked",
    [UserRoleType.USER]: "User",
    [UserRoleType.ADMIN]: "Admin",
    [UserRoleType.SUPERADMIN]: "Super Admin",
  };

  if (isError) {
    return <div>Failed to load users</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-4">
        <Button onClick={() => openDrawer()}>
          <Plus className="w-4 h-4 mr-2" />
          Create User
        </Button>
      </div>

      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="space-y-4">
          {isLoading
            ? // Loading skeletons
              Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-3 w-[100px]" />
                  </div>
                  <div className="flex space-x-2">
                    <Skeleton className="h-8 w-8 rounded-md" />
                    <Skeleton className="h-8 w-8 rounded-md" />
                  </div>
                </div>
              ))
            : users?.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <h3 className="font-medium">{user.name}</h3>
                    <p className="text-sm text-gray-500">
                      {roleMap[user.role]}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openDrawer(user)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    {user.role !== UserRoleType.SUPERADMIN && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(user.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
        </div>
      </ScrollArea>

      <UserSheet
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        editingUser={editingUser}
        currentUserRole={currentUserRole}
        onSuccess={() => mutate()}
      />
    </div>
  );
};

export default UserManagement;
