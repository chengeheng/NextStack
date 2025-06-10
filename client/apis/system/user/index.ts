import useSWR from "swr";
import request from "@/client/utils/request";
import { UserType } from "@/types/server/user";

interface ApiResponse<T> {
  code: number;
  data: T;
  message: string;
}

// 获取用户列表
export const useUsers = () => {
  const { data, error, mutate } = useSWR<UserType[]>(
    "/api/system/user",
    async (url) => {
      const response = await request<null, ApiResponse<UserType[]>>({
        url,
        method: "GET",
      });
      return response.data.data;
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
  const response = await request<typeof userData, ApiResponse<UserType>>({
    url: "/api/system/user",
    method: "POST",
    data: userData,
  });
  return response.data.data;
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
  const response = await request<typeof userData, ApiResponse<UserType>>({
    url: `/api/system/user/${id}`,
    method: "PUT",
    data: userData,
  });
  return response.data.data;
};

// 删除用户
export const deleteUser = async (id: string) => {
  const response = await request<null, ApiResponse<null>>({
    url: `/api/system/user/${id}`,
    method: "DELETE",
  });
  return response.data.data;
};
