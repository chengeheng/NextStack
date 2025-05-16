declare namespace Express {
  interface Request {
    passport: any;
    userInfo: any;
    isAuthenticated: boolean;
  }
}
