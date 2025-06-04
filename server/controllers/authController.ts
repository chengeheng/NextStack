import userService from "@/server/services/userService";
import { Request, Response } from "express";

const authController = {
  async getUserList(req: Request, res: Response) {
    try {
      const users = await userService.getUserList();
      res.status(200).json(users);
    } catch (error) {
      console.error("Error fetching user list:", error);
      res.status(500).json({ message: "Failed to fetch user list" });
    }
  },
};

export default authController;
