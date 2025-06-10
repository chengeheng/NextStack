export enum UserRoleType {
  // 0: 账户锁定(无权限)
  // 1: 普通用户
  // 2: admin
  // 3: superadmin
  LOCKED = 0,
  USER = 1,
  ADMIN = 2,
  SUPERADMIN = 3,
}

export interface UserType {
  id: string;
  name: string;
  password: string;
  email?: string;
  role: UserRoleType;
  createdAt: number;
  updatedAt: number;
}
