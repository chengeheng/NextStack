import useSWR from "swr";
import request from "@/client/utils/request";
import { UserType } from "@/types/server/user";

// 获取用户列表
export const useUsers = () => {
  const { data, error, mutate } = useSWR<UserType[]>(
    "/system/users",
    async (url) => {
      const response = await request<null, UserType[]>({
        url,
        method: "GET",
      });
      return response.data;
    }
  );

  return {
    users: data || [],
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
};

// 创建用户
export const createUser = async (userData: {
  name: string;
  password: string;
  email?: string;
  role: number;
}) => {
  const response = await request<typeof userData, UserType>({
    url: "/system/user",
    method: "POST",
    data: userData,
  });
  return response.data;
};

// 更新用户
export const updateUser = async (
  id: string,
  userData: {
    name: string;
    email?: string;
    role: number;
  }
) => {
  const response = await request<typeof userData, UserType>({
    url: `/system/user/${id}`,
    method: "PUT",
    data: userData,
  });
  return response.data;
};

// 删除用户
export const deleteUser = async (id: string) => {
  const response = await request<null, null>({
    url: `/system/user/${id}`,
    method: "DELETE",
  });
  return response.data;
};

// 根据id获取用户
export const getUserById = async (id: string) => {
  const response = await request<null, UserType>({
    url: `/system/user/${id}`,
    method: "GET",
  });
  // 修改toolkit中userSlice中用户的信息
  return response.data;
};

// 获取当前登录用户信息
export const getCurrentUser = async () => {
  const response = await request<null, UserType>({
    url: "/system/user/current",
    method: "GET",
  });
  return response.data;
};
