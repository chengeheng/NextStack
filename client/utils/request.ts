import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { getAccessTokenInCookie } from "./cookieUtils";

// let makeRequest =<P>:P
const makeRequest = <P, R>(
  options: AxiosRequestConfig<P>
): Promise<AxiosResponse<R, P>> => {
  const service = axios.create(options);
  service.interceptors.request.use((config) => {
    const headers = Object.assign({}, config.headers);
    const access_token = getAccessTokenInCookie();
    if (access_token) {
      headers.Authorization = headers.Authorization || `Bearer ${access_token}`;
    }
    // request middleware
    return { ...config, headers };
  });
  service.interceptors.response.use(
    (response) => {
      // 如果状态码是 200，但业务 code 不是 0，则抛出错误
      const data = response.data as any;
      if (data.code !== 0) {
        return Promise.reject(data);
      }
      return response;
    },
    (error) => {
      // 处理 HTTP 状态码
      if (error.response) {
        const { status } = error.response;
        if (status === 401) {
          // 401 未授权，重定向到登录页
          window.localStorage.removeItem("access_token");
          window.location.href = "/login";
        }
        return Promise.reject(error.response);
      }
      return Promise.reject(new Error("网络错误，请稍后重试"));
    }
  );
  return service.request(options);
};

const request = <P, R>(config: AxiosRequestConfig<P>) => {
  return makeRequest<P, R>(config);
};

export default request;
