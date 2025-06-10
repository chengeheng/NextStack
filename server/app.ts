import express from "express";
import cors from "cors";
import { responseHandler } from "./middlewares/responseHandler";
import { userRouter } from "./routers/userRouter";
import { authRouter } from "./routers/authRouter";

const app = express();

// 基础中间件
app.use(cors());
app.use(express.json());

// 响应格式化中间件 - 必须在路由之前
app.use(responseHandler);

// 路由
app.use("/api/system/user", userRouter);
app.use("/api/auth", authRouter);

// 错误处理中间件 - 必须在路由之后
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err);
    res.status(500).json({
      message: "Internal server error",
    });
  }
);

export default app;
