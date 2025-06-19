import { useState, useEffect } from "react";
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
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { UserType, UserRoleType } from "@/types/server/user";
import { createUser, updateUser } from "@/client/apis/system/user";
import { toast } from "sonner";

interface FormValues {
  name: string;
  password?: string;
  confirmPassword?: string;
  role: UserRoleType;
  email?: string;
}

interface UserSheetProps {
  isOpen: boolean;
  onClose: () => void;
  editingUser: UserType | null;
  currentUserRole: UserRoleType;
  onSuccess: () => void;
}

export const UserSheet = ({
  isOpen,
  onClose,
  editingUser,
  currentUserRole,
  onSuccess,
}: UserSheetProps) => {
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

  // Reset form data when editingUser changes
  useEffect(() => {
    if (editingUser) {
      // Fill form with user data when editing
      setFormData({
        name: editingUser.name,
        email: editingUser.email || "",
        role: editingUser.role,
      });
    } else {
      // Reset form when creating new user
      setFormData({
        name: "",
        password: "",
        confirmPassword: "",
        role: UserRoleType.USER,
        email: "",
      });
    }
    // Clear any previous errors
    setFormErrors({});
  }, [editingUser]);

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
      onClose();
      onSuccess();
    } catch (err) {
      toast.error("Operation failed");
      console.error("Operation failed:", err);
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

  // Determine if role selection should be disabled
  const isRoleDisabled = () => {
    if (!editingUser) return false;
    if (currentUserRole === UserRoleType.SUPERADMIN) return true;
    if (
      currentUserRole === UserRoleType.ADMIN &&
      editingUser.role === UserRoleType.ADMIN
    )
      return true;
    return false;
  };

  // Get available roles based on current user's role
  const getAvailableRoles = () => {
    if (currentUserRole === UserRoleType.SUPERADMIN) {
      return [
        { value: UserRoleType.USER.toString(), label: "User" },
        { value: UserRoleType.ADMIN.toString(), label: "Admin" },
      ];
    }
    if (currentUserRole === UserRoleType.ADMIN) {
      return [{ value: UserRoleType.USER.toString(), label: "User" }];
    }
    return [];
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
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
                disabled={isRoleDisabled()}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableRoles().map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-row gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{editingUser ? "Update" : "Create"}</Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
};
