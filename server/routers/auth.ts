import express from "express";

import authController from "@/server/controllers/loginController";

const router = express.Router();

/**
 * GET（SELECT）：从服务器取出资源（一项或多项）。
 * POST（CREATE）：在服务器新建一个资源。
 * PUT（UPDATE）：在服务器更新资源（客户端提供完整资源数据）。
 * PATCH（UPDATE）：在服务器更新资源（客户端提供需要修改的资源数据）。
 * DELETE（DELETE）：从服务器删除资源。
 */

// 这里可以添加具体的路由处理逻辑，例如登录、注册等
router.post("/login", authController.login);

export default router;
