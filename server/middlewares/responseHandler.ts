import { Request, Response, NextFunction } from "express";

interface ApiResponse<T = unknown> {
  code: number;
  data: T | null;
  message?: string;
}

// 创建统一的响应方法
const createResponse = (res: Response) => {
  const success = <T>(data: T): Response => {
    const response: ApiResponse<T> = {
      code: 0,
      data,
    };
    return res.send(response);
  };

  const error = (code: number, message: string): Response => {
    const response: ApiResponse = {
      code,
      data: null,
      message,
    };
    return res.send(response);
  };

  // 使用 Object.defineProperty 来添加方法
  Object.defineProperty(res, "success", {
    value: success,
    writable: false,
    configurable: false,
  });

  Object.defineProperty(res, "error", {
    value: error,
    writable: false,
    configurable: false,
  });
};

// 扩展 Response 类型
declare module "express" {
  interface Response {
    success<T>(data: T): Response;
    error(code: number, message: string, err?: unknown): Response;
  }
}

export const responseHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // 只处理 API 请求
  if (!req.path.startsWith("/api/")) {
    return next();
  }

  // 保存原始的 send 方法
  const originalSend = res.send;

  // 重写 send 方法
  res.send = function (body: unknown): Response {
    // 如果响应已经发送，直接返回
    if (res.headersSent) {
      return originalSend.call(this, body);
    }

    try {
      // 构造标准响应格式
      const response: ApiResponse = {
        code: res.statusCode < 400 ? 0 : res.statusCode,
        data: res.statusCode < 400 ? body : null,
        message:
          res.statusCode >= 400
            ? typeof body === "string"
              ? body
              : "Operation failed"
            : undefined,
      };

      // 使用原始的 send 方法发送格式化后的响应
      return originalSend.call(this, JSON.stringify(response));
    } catch (error) {
      console.error("Response serialization error:", req.path);
      console.error("Response serialization error:", error);
      // 如果序列化失败，尝试发送错误响应
      return originalSend.call(
        this,
        JSON.stringify({
          code: 500,
          err: error,
          message: "Internal server error",
        })
      );
    }
  };

  // 添加自定义响应方法
  createResponse(res);
  next();
};
