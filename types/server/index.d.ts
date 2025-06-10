// 扩展 Response 类型以包含自定义方法
declare namespace Express {
  interface Request {
    passport: any;
    userInfo: any;
    isAuthenticated: boolean;
  }
}
