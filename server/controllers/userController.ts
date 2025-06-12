import { Request, Response } from "express";
import { UserRoleType } from "../../types/server/user";
import { User } from "../models/userModel";
import { PasswordUtil } from "../utils/password";

export const userController = {
  // Get all users
  getAllUsers: async (req: Request, res: Response): Promise<void> => {
    try {
      const users = await User.find({}, { password: 0 }).sort({
        createdAt: -1,
      });
      const usersResponse = users.map((user) => user.toJSON());
      res.success(usersResponse);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.error(500, "Failed to fetch users");
    }
  },

  // Create new user
  createUser: async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, password, email, role } = req.body;

      if (!name || !password || !email || !role) {
        res.error(400, "Missing required fields");
        return;
      }

      // 验证密码强度
      if (!PasswordUtil.validatePasswordStrength(password)) {
        res.error(400, "密码必须至少8位，包含字母和数字");
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        res.error(400, "Invalid email format");
        return;
      }

      // Convert role to number if it's a string
      const roleNumber = Number(role);
      if (!Object.values(UserRoleType).includes(roleNumber)) {
        res.error(400, "Invalid role");
        return;
      }

      const existingUser = await User.findOne({
        $or: [{ name }, { email }],
      });
      if (existingUser) {
        res.error(400, "User already exists");
        return;
      }

      // 加密密码
      const hashedPassword = await PasswordUtil.encrypt(password);
      const user = new User({
        name,
        password: hashedPassword,
        email,
        role: roleNumber,
      });

      await user.save();
      const userResponse = user.toJSON();
      res.success(userResponse);
    } catch (error) {
      console.error("Error creating user:", error);
      res.error(500, "Failed to create user");
    }
  },

  // Update user
  updateUser: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { name, email, role } = req.body;

      const user = await User.findById(id);
      if (!user) {
        res.error(404, "User not found");
        return;
      }

      if (user.role === UserRoleType.SUPERADMIN) {
        res.error(403, "Cannot modify superadmin");
        return;
      }

      if (name) user.name = name;
      if (email) user.email = email;
      if (role) user.role = role;

      await user.save();
      const userResponse = user.toJSON();
      res.success(userResponse);
    } catch (error) {
      console.error("Error updating user:", error);
      res.error(500, "Failed to update user");
    }
  },

  // Delete user
  deleteUser: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const user = await User.findById(id);
      if (!user) {
        res.error(404, "User not found");
        return;
      }

      if (user.role === UserRoleType.SUPERADMIN) {
        res.error(403, "Cannot delete superadmin");
        return;
      }

      await User.findByIdAndDelete(id);
      res.success(null);
    } catch (error) {
      console.error("Error deleting user:", error);
      res.error(500, "Failed to delete user");
    }
  },
  // 根据id获取用户详情
  getUserById: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const user = await User.findById(id);
      res.success(user);
    } catch (error) {
      console.error("Error getting user by id:", error);
      res.error(500, "Failed to get user by id");
    }
  },
};
