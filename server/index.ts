import next from "next";
import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import session from "express-session";
import { createServer } from "http";

import passport from "./middlewares/passport-local";
import { responseHandler } from "./middlewares/responseHandler";
import * as config from "./config/index";
import { DBUtil } from "./utils/db";
import WebSocketService from "./services/websocketService";

import authRouter from "./routers/auth";
import userRouter from "./routers/userRouter";
import chatRouter from "./routers/chatRouter";

const port = parseInt(process.env.PORT || "3000", 10);
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev, turbo: true });
// without getRequestHandler() it will throw error
const handle = app.getRequestHandler();

// 初始化数据库连接
async function initializeDatabase() {
  try {
    const dbUtil = DBUtil.getInstance();
    await dbUtil.connect();
  } catch (error) {
    console.error("Failed to initialize database:", error);
    process.exit(1);
  }
}

app.prepare().then(async () => {
  // 初始化数据库
  await initializeDatabase();

  const server = express();
  const httpServer = createServer(server);

  // 初始化WebSocket服务
  const wsService = new WebSocketService(httpServer);

  // 将WebSocket服务添加到全局，供其他模块使用
  (global as Record<string, unknown>).wsService = wsService;

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
  server.use("/api", authRouter);
  server.use("/api", userRouter);
  server.use("/api/chat", chatRouter);
  server.use((req, res) => {
    return handle(req, res);
  });

  httpServer.listen(port, () => {
    console.log("server is running on port 3000");
  });
});
