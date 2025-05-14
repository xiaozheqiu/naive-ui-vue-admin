import { useAuthStore } from "@/store/auth";
import axios from "axios";
import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
  CancelTokenSource,
} from "axios";
import { createDiscreteApi } from "naive-ui";
import { storeToRefs } from "pinia";
import { stringify } from "qs"; // 用于序列化参数
const { message: MessageApi } = createDiscreteApi(["message"]);

// 定义请求配置类型（可扩展）
interface RequestConfig extends AxiosRequestConfig {
  customOption?: string;
}

// 定义响应数据的通用结构
interface ApiResponse<T = any> {
  code: number; // 状态码
  message: string; // 提示信息
  data: T; // 数据
}

// 定义错误响应结构
interface ApiErrorResponse {
  code: number;
  message: string;
}

interface InitOptions {
  baseURL?: string; // 基础 URL
  timeout?: number; // 超时时间
  headers?: Record<string, string>; // 请求头
}

// 创建 Axios 实例
export class HttpService {
  private instance: AxiosInstance;
  private pendingRequests: Map<string, CancelTokenSource>;

  constructor(options?: InitOptions) {
    this.instance = axios.create({
      baseURL: options?.baseURL || import.meta.env.VITE_API_BASE_URL,
      timeout: options?.timeout || 10000, // 超时时间
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers || {}),
      },
      paramsSerializer: (params) =>
        stringify(params, { arrayFormat: "brackets" }), // 使用 qs 库进行参数序列化，以支持复杂对象
    });

    this.pendingRequests = new Map();

    // 请求拦截器
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const { authData } = storeToRefs(useAuthStore());
        const token = authData.value.accessToken;
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // 取消重复请求 - 优化 key 生成
        const requestKey = this.getRequestKey(config);
        this.removePendingRequest(config); // 先移除旧的，避免取消自身

        const source = axios.CancelToken.source();
        config.cancelToken = source.token;
        this.pendingRequests.set(requestKey, source);

        return config;
      },
      (error: AxiosError) => {
        console.error("Request Error:", error); // 请求错误通常是配置问题，直接拒绝
        return Promise.reject(error);
      },
    );

    // 响应拦截器
    this.instance.interceptors.response.use(
      (response: AxiosResponse<ApiResponse>) => {
        this.removePendingRequest(response.config); // 移除已完成的请求

        // 增加对 response.data 结构的校验
        if (typeof response.data !== "object" || response.data === null) {
          console.error(
            "API Response Format Error: response.data is not an object",
            response,
          );
          return Promise.reject(new Error("服务器响应格式错误"));
        }

        const { code, message, data } = response.data;

        if (code !== 200) {
          console.error(`API Logic Error [${code}]: ${message}`);
          return Promise.reject({ isApiError: true, code, message, data });
        }

        return data; // 成功，直接返回核心数据
      },
      (error: AxiosError<ApiErrorResponse>) => {
        if (error.config) {
          this.removePendingRequest(error.config); // 移除请求（无论成功失败）
        }

        if (axios.isCancel(error)) {
          console.log("Request canceled:", error.message);
          return Promise.reject({ isCancel: true, message: error.message });
        }

        const { response, request = null, message = "" } = error;

        let status = 500;
        let errorMessage = "网络错误或服务器无法响应";

        // 直接处理 Axios 错误
        if (response) {
          const { data } = response || {};
          const { code, message } = data || {};
          status = code || 500;
          errorMessage = message || errorMessage;
        }
        // 处理不同的错误状态码
        else if (request) {
          console.log("Network Error or No Response:", request);
          errorMessage = message?.includes("timeout")
            ? "请求超时"
            : errorMessage;
        } else {
          console.log("Axios Setup Error:", message);
          errorMessage = `请求配置错误 ${message}`;
        }

        MessageApi.error(`Error ${status}: ${errorMessage}`);
        return Promise.reject({
          status,
          message: errorMessage,
          error,
        });
      },
    );
  }

  // 辅助方法：生成请求的唯一键（考虑方法、URL、参数和数据）
  private getRequestKey(
    config: AxiosRequestConfig | InternalAxiosRequestConfig,
  ): string {
    const { method, url, params, data } = config;
    return [
      method || "get",
      url,
      JSON.stringify(params),
      JSON.stringify(data),
    ].join("&");
  }

  // 辅助方法：移除挂起的请求
  private removePendingRequest(
    config: AxiosRequestConfig | InternalAxiosRequestConfig,
  ): void {
    const requestKey = this.getRequestKey(config);
    if (this.pendingRequests.has(requestKey)) {
      this.pendingRequests.delete(requestKey);
    }
  }

  // 封装 GET 请求
  public async get<T>(
    url: string,
    params?: any,
    config?: Omit<RequestConfig, "params">,
  ): Promise<T> {
    return this.instance.get(url, { ...config, params }); // 将 params 合并到 config 中
  }

  // 封装 POST 请求
  public async post<T>(
    url: string,
    data?: any,
    config?: RequestConfig,
  ): Promise<T> {
    return this.instance.post(url, data, config);
  }

  // 封装 PUT 请求
  public async put<T>(
    url: string,
    data?: any,
    config?: RequestConfig,
  ): Promise<T> {
    return this.instance.put(url, data, config);
  }

  // 封装 DELETE 请求
  public async delete<T>(url: string, config?: RequestConfig): Promise<T> {
    return this.instance.delete(url, config);
  }

  // 文件上传
  public async uploadFile<T>(
    url: string,
    file: File,
    data?: Record<string, any>, // 允许附带其他表单数据
    config?: RequestConfig, // 排除 headers，因为内部会设置
  ): Promise<T> {
    const formData = new FormData();
    formData.append("file", file);

    if (data) {
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          formData.append(key, data[key]);
        }
      }
    }

    return this.instance.post(url, formData, {
      ...config,
      headers: {
        "Content-Type": "multipart/form-data",
        ...(config?.headers || {}),
      },
    });
  }

  // 文件下载
  public async downloadFile(
    url: string,
    params?: any, // 添加 params 支持
    config?: Omit<
      RequestConfig,
      "params" | "responseType" | "transformResponse"
    >,
  ): Promise<Blob> {
    try {
      const response = await this.instance.get<Blob>(url, {
        ...config,
        params,
        responseType: "blob",
        transformResponse: [(data) => data], // 覆盖响应拦截器，直接返回原始响应体 (Blob)
      });
      return response; // 直接返回 Blob 数据
    } catch (error: any) {
      if (
        error &&
        error.response &&
        error.response.data instanceof Blob &&
        error.response.data.type.includes("application/json")
      ) {
        const errorJson = await error.response.data.text();
        try {
          const errorData = JSON.parse(errorJson);
          console.error("Download failed with JSON error:", errorData);
          throw { isApiError: true, ...errorData };
        } catch (parseError) {
          console.error("Failed to parse download error response:", parseError);
        }
      }
      throw error; // 否则，重新抛出原始或处理过的错误
    }
  }

  // 取消所有挂起的请求
  public cancelAllRequests(message: string = "操作被取消"): void {
    this.pendingRequests.forEach((source, key) => {
      source.cancel(`${message} (Request: ${key})`);
    });
    this.pendingRequests.clear();
  }

  // 取消特定请求
  public cancelRequest(
    url: string,
    method: string = "get",
    params?: any,
    data?: any,
  ): void {
    const requestKey = this.getRequestKey({ url, method, params, data });
    if (this.pendingRequests.has(requestKey)) {
      const source = this.pendingRequests.get(requestKey);
      source?.cancel(`请求 ${method.toUpperCase()} ${url} 被手动取消`);
      this.pendingRequests.delete(requestKey);
    } else {
      console.warn(`No pending request found for key: ${requestKey}`);
    }
  }
}

// 导出实例
const http = new HttpService(); // 使用默认配置

export default http;
