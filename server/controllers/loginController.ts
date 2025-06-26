import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { get } from "lodash";
import { v4 } from "uuid";

import { User } from "../models/userModel";
import * as config from "../config/index";
import { PasswordUtil } from "../utils/password";
import { log } from "../utils/logger";

const authController = {
  GenerateToken: (user) => {
    return jwt.sign(
      {
        id: get(user, "id"),
        name: get(user, "name"),
        role: get(user, "role"),
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
      const clientIP =
        req.headers["x-forwarded-for"] ||
        req.connection.remoteAddress ||
        "unknown";

      log.info("Login attempt", {
        username,
        clientIP: clientIP as string,
        userAgent: req.headers["user-agent"] || "unknown",
      });

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

          log.info("Login successful", {
            username,
            userId: userInfo.id,
            clientIP: clientIP as string,
            role: userInfo.role,
          });

          res.success({ token: "Bearer " + token });
        } else {
          log.warn("Login failed - invalid password", {
            username,
            clientIP: clientIP as string,
          });
          res.error(1, "密码错误！");
        }
      } else {
        log.warn("Login failed - user not found", {
          username,
          clientIP: clientIP as string,
        });
        res.error(1, "该用户不存在");
      }
    } catch (err) {
      const clientIP =
        req.headers["x-forwarded-for"] ||
        req.connection.remoteAddress ||
        "unknown";
      log.error("Login error", {
        username: req.body.username,
        clientIP: clientIP as string,
        error: err instanceof Error ? err.message : String(err),
        stack: err instanceof Error ? err.stack : undefined,
      });
      res.error(1, "登录失败! 请稍后再试", err);
    }
  },

  async logout(req: Request, res: Response) {
    try {
      const clientIP =
        req.headers["x-forwarded-for"] ||
        req.connection.remoteAddress ||
        "unknown";
      const userId = (req as any).user?.id || "unknown";

      log.info("Logout attempt", {
        userId,
        clientIP: clientIP as string,
        userAgent: req.headers["user-agent"] || "unknown",
      });

      // 清除authorization cookie
      res.clearCookie("authorization", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });

      log.info("Logout successful", {
        userId,
        clientIP: clientIP as string,
      });

      res.success({ message: "退出登录成功" });
    } catch (err) {
      const clientIP =
        req.headers["x-forwarded-for"] ||
        req.connection.remoteAddress ||
        "unknown";
      log.error("Logout error", {
        userId: (req as any).user?.id || "unknown",
        clientIP: clientIP as string,
        error: err instanceof Error ? err.message : String(err),
        stack: err instanceof Error ? err.stack : undefined,
      });
      res.error(1, "退出登录失败! 请稍后再试", err);
    }
  },
};

export default authController;
