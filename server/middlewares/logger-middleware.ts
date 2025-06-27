import { Request, Response, NextFunction } from "express";
import { httpLogger } from "../utils/logger";

// 获取客户端IP地址
const getClientIP = (req: Request): string => {
  return (req.headers["x-forwarded-for"] ||
    req.headers["x-real-ip"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    "unknown") as string;
};

// 获取请求体大小
const getRequestSize = (req: Request): number => {
  const contentLength = req.headers["content-length"];
  return contentLength ? parseInt(contentLength, 10) : 0;
};

// 获取响应体大小
const getResponseSize = (res: Response): number => {
  const contentLength = res.getHeader("content-length");
  return contentLength ? parseInt(contentLength as string, 10) : 0;
};

// 格式化请求时间
const formatResponseTime = (time: number): string => {
  return `${time.toFixed(2)}ms`;
};

// HTTP请求日志中间件
export const httpRequestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const startTime = Date.now();
  const clientIP = getClientIP(req);
  const userAgent = req.headers["user-agent"] || "unknown";
  const requestSize = getRequestSize(req);

  // 记录请求开始
  const requestLog = {
    method: req.method,
    url: req.originalUrl,
    clientIP,
    userAgent,
    requestSize: `${requestSize} bytes`,
    timestamp: new Date().toISOString(),
  };

  httpLogger.info("HTTP Request Started", requestLog);

  // 重写res.end方法来捕获响应信息
  const originalEnd = res.end;
  res.end = function (chunk?: any, encoding?: any, cb?: () => void) {
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    const responseSize = getResponseSize(res);

    // 记录请求完成
    const responseLog = {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      clientIP,
      userAgent,
      requestSize: `${requestSize} bytes`,
      responseSize: `${responseSize} bytes`,
      responseTime: formatResponseTime(responseTime),
      timestamp: new Date().toISOString(),
    };

    // 根据状态码选择日志级别
    if (res.statusCode >= 400) {
      httpLogger.warn("HTTP Request Completed with Error", responseLog);
    } else {
      httpLogger.info("HTTP Request Completed", responseLog);
    }

    // 调用原始的end方法
    return originalEnd.call(this, chunk, encoding, cb);
  };

  next();
};

// 错误日志中间件
export const errorLogger = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const clientIP = getClientIP(req);

  const errorLog = {
    method: req.method,
    url: req.originalUrl,
    clientIP,
    userAgent: req.headers["user-agent"] || "unknown",
    error: {
      name: err.name,
      message: err.message,
      stack: err.stack,
    },
    timestamp: new Date().toISOString(),
  };

  httpLogger.error("HTTP Request Error", errorLog);

  next(err);
};

// 简化的请求日志中间件（如果只需要基本日志）
export const simpleRequestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const startTime = Date.now();
  const clientIP = getClientIP(req);

  res.on("finish", () => {
    const responseTime = Date.now() - startTime;
    const logMessage = `${req.method} ${req.originalUrl} ${res.statusCode} ${formatResponseTime(responseTime)} - ${clientIP}`;

    if (res.statusCode >= 400) {
      httpLogger.warn(logMessage);
    } else {
      httpLogger.info(logMessage);
    }
  });

  next();
};
