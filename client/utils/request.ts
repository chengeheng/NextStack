import axios, {
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
// import { getAccessTokenInCookie } from "./cookieUtils";

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  retries?: number;
  retryDelay?: number;
  __retryCount?: number;
}

// 创建 axios 实例
const service = axios.create({
  timeout: 10000, // 请求超时时间
} as CustomAxiosRequestConfig);

// 请求队列
const pendingRequests = new Map();

// 生成请求的唯一键
const generateRequestKey = (config: AxiosRequestConfig) => {
  const { url, method, params, data } = config;
  return [url, method, JSON.stringify(params), JSON.stringify(data)].join("&");
};

// 添加请求到队列
const addPendingRequest = (config: AxiosRequestConfig) => {
  const requestKey = generateRequestKey(config);
  if (!pendingRequests.has(requestKey)) {
    config.cancelToken = new axios.CancelToken((cancel) => {
      pendingRequests.set(requestKey, cancel);
    });
  }
};

// 从队列中移除请求
const removePendingRequest = (config: AxiosRequestConfig) => {
  const requestKey = generateRequestKey(config);
  if (pendingRequests.has(requestKey)) {
    const cancel = pendingRequests.get(requestKey);
    cancel(requestKey);
    pendingRequests.delete(requestKey);
  }
};

// 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 添加 token
    const headers = Object.assign({}, config.headers);
    // const access_token = getAccessTokenInCookie();
    // console.log("access_token", access_token);
    // if (access_token) {
    //   headers.Authorization = headers.Authorization || `Bearer ${access_token}`;
    // }

    // 处理重复请求
    removePendingRequest(config);
    addPendingRequest(config);

    return { ...config, headers };
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    // 请求完成后，从队列中移除
    removePendingRequest(response.config);

    // 处理业务状态码
    const data = response.data as { code: number; data: unknown };
    if (data.code !== 0) {
      return Promise.reject(data);
    }
    return response.data;
  },
  async (error: AxiosError) => {
    // 请求完成后，从队列中移除
    if (error.config) {
      removePendingRequest(error.config);
    }

    // 处理 HTTP 状态码
    if (error.response) {
      const { status } = error.response;
      if (status === 401) {
        // 401 未授权，重定向到登录页
        window.localStorage.removeItem("access_token");
        window.location.href = "/login";
        return Promise.reject(error.response);
      }
    }

    // 处理网络错误
    if (error.code === "ECONNABORTED" && error.config) {
      // 请求超时，进行重试
      const config = error.config as CustomAxiosRequestConfig;
      config.__retryCount = config.__retryCount || 0;
      const retries = config.retries || 3;
      const retryDelay = config.retryDelay || 1000;

      if (config.__retryCount < retries) {
        config.__retryCount += 1;
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(service(config));
          }, retryDelay);
        });
      }
    }

    return Promise.reject(error);
  }
);

// 请求函数
const request = <P, R>(
  config: AxiosRequestConfig<P>
): Promise<AxiosResponse<R, P>> => {
  return service.request(config);
};

// 取消所有请求
const cancelAllRequests = () => {
  pendingRequests.forEach((cancel) => {
    cancel("Request cancelled");
  });
  pendingRequests.clear();
};

export { request, cancelAllRequests };
export default request;
