import next from "next";
import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import session from "express-session";
import { createServer } from "http";

import passport from "./middlewares/passport-local";
import { responseHandler } from "./middlewares/responseHandler";
import {
  httpRequestLogger,
  errorLogger,
} from "./middlewares/logger-middleware";
import { log } from "./utils/logger";
import * as config from "./config/index";
import { DBUtil } from "./utils/db";
import WebSocketService from "./services/websocketService";

import authRouter from "./routers/auth";
import userRouter from "./routers/userRouter";
import chatRouter from "./routers/chatRouter";
import logRouter from "./routers/logRouter";

const port = parseInt(process.env.PORT || "3000", 10);
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev, turbo: true });
// without getRequestHandler() it will throw error
const handle = app.getRequestHandler();

// 初始化数据库连接
async function initializeDatabase() {
  try {
    log.info("Initializing database connection...");
    const dbUtil = DBUtil.getInstance();
    await dbUtil.connect();
    log.info("Database connection established successfully");
  } catch (error) {
    log.error("Failed to initialize database", {
      error: error instanceof Error ? error.message : String(error),
    });
    process.exit(1);
  }
}

app.prepare().then(async () => {
  log.info("Next.js app prepared successfully");

  // 初始化数据库
  await initializeDatabase();

  const server = express();
  const httpServer = createServer(server);

  // 初始化WebSocket服务
  log.info("Initializing WebSocket service...");
  const wsService = new WebSocketService(httpServer);
  log.info("WebSocket service initialized successfully");

  // 将WebSocket服务添加到全局，供其他模块使用
  (global as Record<string, unknown>).wsService = wsService;

  // 添加HTTP请求日志中间件（必须在其他中间件之前）
  server.use(httpRequestLogger);

  // express config
  server.use(bodyParser.urlencoded({ extended: true }));
  server.use(bodyParser.json());
  server.use(cookieParser());
  server.use(
    session({
      secret: config.JWT_KEY,
      resave: false,
      saveUninitialized: true,
    })
  );

  // passport
  server.use(passport.initialize());
  // server.use(passport.session());

  server.use((req, res, next) => {
    req.passport = passport;
    next();
  });
  server.use(responseHandler);

  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));

  // API路由
  log.info("Setting up API routes...");
  server.use("/api", authRouter);
  server.use("/api", userRouter);
  server.use("/api/chat", chatRouter);
  server.use("/api/logs", logRouter);

  // Next.js处理
  server.use((req, res) => {
    return handle(req, res);
  });

  // 错误处理中间件（必须在最后）
  server.use(errorLogger);

  httpServer.listen(port, () => {
    log.info(`Server is running on port ${port}`, {
      environment: process.env.NODE_ENV || "development",
      port,
      timestamp: new Date().toISOString(),
    });
  });
});

// 优雅关闭处理
process.on("SIGTERM", () => {
  log.info("SIGTERM received, shutting down gracefully...");
  process.exit(0);
});

process.on("SIGINT", () => {
  log.info("SIGINT received, shutting down gracefully...");
  process.exit(0);
});

// 未捕获的异常处理
process.on("uncaughtException", (error) => {
  log.error("Uncaught Exception", {
    error: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
  });
  process.exit(1);
});

// 未处理的Promise拒绝处理
process.on("unhandledRejection", (reason, promise) => {
  log.error("Unhandled Rejection", {
    reason: reason instanceof Error ? reason.message : String(reason),
    promise: promise.toString(),
    timestamp: new Date().toISOString(),
  });
  process.exit(1);
});
