import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { get } from "lodash";
import { v4 } from "uuid";

import { User } from "../models/userModel";
import * as config from "../config/index";
import { PasswordUtil } from "../utils/password";

const authController = {
  GenerateToken: (user) => {
    return jwt.sign(
      {
        uuid: get(user, "uuid"),
        username: get(user, "username"),
        userRole: get(user, "role"),
      },
      config.JWT_KEY,
      {
        jwtid: v4(),
        expiresIn: config.JWT_EXPIRY,
        issuer: config.JWT_ISSUER,
        audience: config.JWT_AUDIENCE,
        algorithm: config.JWT_ALG,
      }
    );
  },

  async login(req: Request, res: Response) {
    try {
      const { username, password } = req.body;
      const userInfo = await User.findOne({ name: username });
      if (userInfo) {
        // 验证密码
        const isPasswordValid = await PasswordUtil.verify(
          password,
          userInfo.password
        );
        if (isPasswordValid) {
          const token = authController.GenerateToken(userInfo);
          await res.cookie("authorization", token, {
            expires: new Date(Date.now() + config.JWT_EXPIRY),
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
          });
          res.success({ token: "Bearer " + token });
        } else {
          res.error(1, "密码错误！");
        }
      } else {
        res.error(1, "该用户不存在");
      }
    } catch (err) {
      res.error(1, "登录失败! 请稍后再试", err);
    }
  },

  async logout(req: Request, res: Response) {
    try {
      // 清除authorization cookie
      res.clearCookie("authorization", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });
      res.success({ message: "退出登录成功" });
    } catch (err) {
      res.error(1, "退出登录失败! 请稍后再试", err);
    }
  },
};

export default authController;
