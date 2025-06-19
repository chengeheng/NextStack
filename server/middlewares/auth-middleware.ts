import { Request, Response } from "express";

const authMiddleware = async (req: Request, res: Response, next) => {
  // const tokenHeaderKey = "Authorization";
  // const token = req.header(tokenHeaderKey);
  // if (!token) {
  //   return res.status(401).json({ error: "用户未登录" });
  // }
  // const verified = await jwt.verify(token, JWT_KEY);
  // if (verified) {
  //   next();
  // } else {
  req.passport.authenticate("jwt", { session: false }, (err, user) => {
    if (err) return next(err);
    if (!user) {
      res.status(401).send({ success: true, code: 0, message: "权限禁止" });
      return;
    }
    req.userInfo = user;
    next();
  })(req, res, next);
};

export default authMiddleware;
