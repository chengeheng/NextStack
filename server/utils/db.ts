import mongoose from "mongoose";
import { User } from "../models/userModel";
import { UserRoleType } from "../../types/server/user";
import { PasswordUtil } from "./password";
import * as config from "../config/index";

/**
 * 数据库工具类
 */
export class DBUtil {
  private static instance: DBUtil;
  private isConnected: boolean = false;

  private constructor() {}

  /**
   * 获取单例实例
   */
  public static getInstance(): DBUtil {
    if (!DBUtil.instance) {
      DBUtil.instance = new DBUtil();
    }
    return DBUtil.instance;
  }

  /**
   * 连接数据库
   */
  public async connect(): Promise<void> {
    if (this.isConnected) {
      console.log("Database already connected");
      return;
    }

    const { databaseConfig } = config;
    const mongoHost = `mongodb://${databaseConfig.username}:${databaseConfig.password}@${databaseConfig.host}:${databaseConfig.port}/${databaseConfig.database}`;

    try {
      await mongoose.connect(mongoHost, {
        authSource: "admin",
      });
      this.isConnected = true;
      console.log("Database connected successfully:", mongoHost);

      // 初始化管理员用户
      await this.initializeAdminUser();
    } catch (error) {
      console.error("Database connection error:", error);
      throw error;
    }
  }

  /**
   * 断开数据库连接
   */
  public async disconnect(): Promise<void> {
    if (!this.isConnected) {
      return;
    }

    try {
      await mongoose.disconnect();
      this.isConnected = false;
      console.log("Database disconnected successfully");
    } catch (error) {
      console.error("Database disconnection error:", error);
      throw error;
    }
  }

  /**
   * 初始化管理员用户
   */
  private async initializeAdminUser(): Promise<void> {
    try {
      // 检查是否存在管理员用户
      const adminUser = await User.findOne({ name: "admin" });

      if (!adminUser) {
        // 创建管理员用户
        const hashedPassword = await PasswordUtil.encrypt("123456");
        const admin = new User({
          name: "admin",
          password: hashedPassword,
          email: "admin@example.com",
          role: UserRoleType.SUPERADMIN,
        });

        await admin.save();
        console.log("Admin user created successfully");
      } else {
        console.log("Admin user already exists");
      }
    } catch (error) {
      console.error("Error initializing admin user:", error);
      throw error;
    }
  }

  /**
   * 获取数据库连接状态
   */
  public getConnectionStatus(): boolean {
    return this.isConnected;
  }
}
