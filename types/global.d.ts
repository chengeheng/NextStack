// 扩展 Express 类型以包含自定义方法和属性
declare namespace Express {
  interface Request {
    passport: import("passport").Authenticator;
    userInfo: import("@/types/user").UserType;
    isAuthenticated: boolean;
  }

  interface Response {
    success: (data?: unknown) => void;
    error: (code: number, message: string, error?: unknown) => void;
  }
}
