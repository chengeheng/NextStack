import { hash, compare } from "bcryptjs";

/**
 * 密码加密配置
 */
const SALT_ROUNDS = 10;

/**
 * 密码加密工具类
 */
export class PasswordUtil {
  /**
   * 加密密码
   * @param password 原始密码
   * @returns 加密后的密码
   */
  static async encrypt(password: string): Promise<string> {
    try {
      return await hash(password, SALT_ROUNDS);
    } catch (error) {
      console.error("Password encryption failed:", error);
      throw new Error("密码加密失败");
    }
  }

  /**
   * 验证密码
   * @param password 原始密码
   * @param hashedPassword 加密后的密码
   * @returns 是否匹配
   */
  static async verify(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    try {
      return await compare(password, hashedPassword);
    } catch (error) {
      console.error("Password verification failed:", error);
      throw new Error("密码验证失败");
    }
  }

  /**
   * 验证密码强度
   * @param password 密码
   * @returns 是否满足强度要求
   */
  static validatePasswordStrength(password: string): boolean {
    // 至少8位，包含字母和数字
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return passwordRegex.test(password);
  }
}
