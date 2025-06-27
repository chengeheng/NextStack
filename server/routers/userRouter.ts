import { Router } from "express";
import { userController } from "../controllers/userController";
import authMiddleware from "@/server/middlewares/auth-middleware";

const router = Router();
router.use(authMiddleware);

// Get all users
router.get("/system/users", userController.getAllUsers);

// Get current user (放在参数路由之前)
router.get("/system/user/current", userController.getCurrentUser);

// Get user by id (放在具体路由之后)
router.get("/system/user/:id", userController.getUserById);

// Create user
router.post("/system/user", userController.createUser);

// Update user
router.put("/system/user/:id", userController.updateUser);

// Delete user
router.delete("/system/user/:id", userController.deleteUser);

export default router;
