import { Router } from "express";
import { chatController } from "../controllers/chatController";
import authMiddleware from "../middlewares/auth-middleware";

const router = Router();

// 所有聊天路由都需要认证
router.use(authMiddleware);

// 房间相关路由
router.get("/rooms", chatController.getUserRooms);
router.post("/rooms/create", chatController.createRoom);
router.post("/rooms/join", chatController.joinRoom);
router.delete("/rooms/:roomId/leave", chatController.leaveRoom);
router.post("/rooms/:roomId/invite", chatController.inviteUsers);

// 消息相关路由
router.get("/rooms/:roomId/messages", chatController.getRoomMessages);
router.post("/messages", chatController.sendMessage);
router.post("/messages/read", chatController.markMessageAsRead);

export default router;
