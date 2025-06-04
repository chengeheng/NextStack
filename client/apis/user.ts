import request from "@/client/utils/request";
import { AxiosResponse } from "axios";
import { MutationFetcher } from "swr/mutation";
import { UserType } from "@/types/server/user";

export const getUserListFetch: MutationFetcher<
  AxiosResponse<any>,
  string,
  UserType
> = (path, params) => {
  return request<UserType, void>({
    method: "get",
    url: "/api/user/list",
    data: params.arg,
  });
};
