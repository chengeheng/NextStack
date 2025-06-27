import { AxiosResponse } from "axios";
import { MutationFetcher } from "swr/mutation";

import request from "@/client/utils/request";

interface loginProps {
  username: string;
  password: string;
}

export const loginFetcher: MutationFetcher<
  AxiosResponse<void>,
  string,
  loginProps
> = (path, params) => {
  return request<loginProps, void>({
    method: "post",
    url: "/login",
    data: params.arg,
  });
};
