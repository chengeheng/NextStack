import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import path from "path";

// 创建logs目录
const logsDir = path.join(process.cwd(), "logs");

// 自定义日志格式
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
    let log = `${timestamp} [${level.toUpperCase()}]: ${message}`;

    // 如果有额外的元数据，添加到日志中
    if (Object.keys(meta).length > 0) {
      log += ` ${JSON.stringify(meta)}`;
    }

    // 如果有错误堆栈，添加到日志中
    if (stack) {
      log += `\n${stack}`;
    }

    return log;
  })
);

// 创建HTTP请求日志传输器
const httpLogTransport = new DailyRotateFile({
  filename: path.join(logsDir, "http-%DATE%.log"),
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "14d", // 保留14天的日志
  level: "info",
});

// 创建服务器运行日志传输器
const serverLogTransport = new DailyRotateFile({
  filename: path.join(logsDir, "server-%DATE%.log"),
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "30d", // 保留30天的日志
  level: "info",
});

// 创建错误日志传输器
const errorLogTransport = new DailyRotateFile({
  filename: path.join(logsDir, "error-%DATE%.log"),
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "30d",
  level: "error",
});

// 创建HTTP请求日志记录器
export const httpLogger = winston.createLogger({
  level: "info",
  format: logFormat,
  transports: [
    httpLogTransport,
    // 开发环境下同时输出到控制台
    ...(process.env.NODE_ENV !== "production"
      ? [new winston.transports.Console()]
      : []),
  ],
});

// 创建服务器运行日志记录器
export const serverLogger = winston.createLogger({
  level: "info",
  format: logFormat,
  transports: [
    serverLogTransport,
    errorLogTransport,
    // 开发环境下同时输出到控制台
    ...(process.env.NODE_ENV !== "production"
      ? [new winston.transports.Console()]
      : []),
  ],
});

// 创建通用日志记录器
export const logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: logFormat,
  transports: [
    serverLogTransport,
    errorLogTransport,
    // 开发环境下同时输出到控制台
    ...(process.env.NODE_ENV !== "production"
      ? [new winston.transports.Console()]
      : []),
  ],
});

// 导出便捷的日志方法
export const log = {
  info: (message: string, meta?: any) => logger.info(message, meta),
  warn: (message: string, meta?: any) => logger.warn(message, meta),
  error: (message: string, meta?: any) => logger.error(message, meta),
  debug: (message: string, meta?: any) => logger.debug(message, meta),
  http: (message: string, meta?: any) => httpLogger.info(message, meta),
};

// 优雅关闭日志
process.on("SIGTERM", () => {
  logger.info("SIGTERM received, closing loggers...");
  httpLogger.close();
  serverLogger.close();
  logger.close();
});

process.on("SIGINT", () => {
  logger.info("SIGINT received, closing loggers...");
  httpLogger.close();
  serverLogger.close();
  logger.close();
});
