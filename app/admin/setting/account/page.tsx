"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { UserType, UserRoleType } from "@/types/server/user";
import {
  useUsers,
  createUser,
  updateUser,
  deleteUser,
} from "@/client/apis/system/user";
import { toast } from "sonner";

interface FormValues {
  name: string;
  password?: string;
  confirmPassword?: string;
  role: UserRoleType;
  email?: string;
}

const UserManagement = () => {
  const { users, isLoading, isError, mutate } = useUsers();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserType | null>(null);
  const [formData, setFormData] = useState<FormValues>({
    name: "",
    password: "",
    confirmPassword: "",
    role: UserRoleType.USER,
    email: "",
  });
  const [formErrors, setFormErrors] = useState<{
    password?: string;
    confirmPassword?: string;
  }>({});

  // Validate password
  const validatePassword = (password: string) => {
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    return hasLetter && hasNumber;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate password if creating new user
    if (!editingUser) {
      const errors: { password?: string; confirmPassword?: string } = {};

      if (!validatePassword(formData.password || "")) {
        errors.password = "Password must contain both letters and numbers";
      }

      if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
      }

      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return;
      }
    }

    try {
      if (editingUser) {
        // Update user
        await updateUser(editingUser.id, {
          name: formData.name,
          email: formData.email,
          role: formData.role,
        });
        toast.success("User updated successfully");
      } else {
        // Create user
        await createUser({
          name: formData.name,
          password: formData.password!,
          email: formData.email,
          role: formData.role,
        });
        toast.success("User created successfully");
      }
      setIsDrawerOpen(false);
      mutate(); // Refresh the user list
    } catch (err) {
      toast.error("Operation failed");
      console.error("Operation failed:", err);
    }
  };

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user types
    if (name === "password" || name === "confirmPassword") {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleRoleChange = (value: string) => {
    setFormData((prev) => ({ ...prev, role: Number(value) as UserRoleType }));
  };

  const openDrawer = (user?: UserType) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name,
        email: user.email || "",
        role: user.role,
      });
    } else {
      setEditingUser(null);
      setFormData({
        name: "",
        password: "",
        confirmPassword: "",
        role: UserRoleType.USER,
        email: "",
      });
    }
    setFormErrors({});
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

      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent className="w-[400px] sm:w-[540px] p-4">
          <SheetHeader className="p-0">
            <SheetTitle>{editingUser ? "Edit User" : "Create User"}</SheetTitle>
          </SheetHeader>
          <form onSubmit={handleSubmit} className="space-y-6 mt-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Username</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full"
                />
              </div>

              {!editingUser && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      className="w-full"
                    />
                    {formErrors.password && (
                      <p className="text-sm text-red-500">
                        {formErrors.password}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                      className="w-full"
                    />
                    {formErrors.confirmPassword && (
                      <p className="text-sm text-red-500">
                        {formErrors.confirmPassword}
                      </p>
                    )}
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={formData.role.toString()}
                  onValueChange={handleRoleChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={UserRoleType.USER.toString()}>
                      User
                    </SelectItem>
                    <SelectItem value={UserRoleType.ADMIN.toString()}>
                      Admin
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-row gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDrawerOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">{editingUser ? "Update" : "Create"}</Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default UserManagement;
