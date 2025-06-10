import { Router } from "express";
import { userController } from "../controllers/userController";
import authMiddleware from "@/server/middlewares/auth-middleware";

const router = Router();
router.use(authMiddleware);
// Get all users
router.get("/system/user", userController.getAllUsers);

// Create new user
router.post("/system/user", userController.createUser);

// Update user
router.put("/system/user/:id", userController.updateUser);

// Delete user
router.delete("/system/user/:id", userController.deleteUser);

export default router;
