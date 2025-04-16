import axios from "axios";
import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
  CancelTokenSource,
} from "axios";

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
      baseURL: options?.baseURL || "http://api.example.com", // 替换为你的 API 地址
      timeout: options?.timeout || 10000, // 超时时间
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers || {}),
      },
    });

    this.pendingRequests = new Map();

    // 请求拦截器
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem("token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // 取消重复请求
        const requestKey = this.getRequestKey(config);
        if (this.pendingRequests.has(requestKey)) {
          this.pendingRequests.get(requestKey)?.cancel("重复请求被取消");
        }
        const source = axios.CancelToken.source();
        config.cancelToken = source.token;
        this.pendingRequests.set(requestKey, source);

        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      },
    );

    // 响应拦截器 - 这里进行了优化，直接返回 response.data
    this.instance.interceptors.response.use(
      (response: AxiosResponse<ApiResponse>) => {
        const { code, message, data } = response.data;

        // 移除已完成的请求
        const requestKey = this.getRequestKey(response.config);
        this.pendingRequests.delete(requestKey);

        if (code !== 200) {
          console.error(`API Error: ${message}`);
          return Promise.reject({ code, message });
        }

        // 直接返回 response.data，这样方法就不需要重复 return response.data
        return data;
      },
      (error: AxiosError<ApiErrorResponse>) => {
        // 处理请求被取消的情况
        if (axios.isCancel(error)) {
          console.log("请求被取消:", error.message);
          return Promise.reject(error);
        }

        const status = error.response?.status || 500;
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "网络错误或服务器未响应";

        // 移除已完成的请求
        if (error.config) {
          const requestKey = this.getRequestKey(error.config);
          this.pendingRequests.delete(requestKey);
        }

        // 全局错误提示（例如使用 toast）
        console.error(`HTTP Error ${status}: ${errorMessage}`);
        alert(`错误 ${status}: ${errorMessage}`); // 替换为实际的 UI 提示库

        return Promise.reject({ status, message: errorMessage });
      },
    );
  }

  // 辅助方法：生成请求的唯一键
  private getRequestKey(config: AxiosRequestConfig): string {
    return `${config.method}:${config.url}`;
  }

  // 封装 GET 请求
  public async get<T>(url: string, config?: RequestConfig): Promise<T> {
    // 由于拦截器已经处理了 response.data，这里直接返回
    return this.instance.get(url, config);
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
    config?: RequestConfig,
  ): Promise<T> {
    const formData = new FormData();
    formData.append("file", file);

    return this.instance.post(url, formData, {
      ...config,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  // 文件下载 - 特殊情况，需要返回 Blob 而不是 ApiResponse
  public async downloadFile(
    url: string,
    config?: RequestConfig,
  ): Promise<Blob> {
    return await this.instance.get(url, {
      ...config,
      responseType: "blob",
      // 临时取消拦截器对响应数据的处理，因为下载文件返回的是 Blob 而不是 JSON
      transformResponse: [(data) => data],
    });
  }

  // 取消所有挂起的请求
  public cancelAllRequests(message: string = "操作被取消"): void {
    this.pendingRequests.forEach((source) => {
      source.cancel(message);
    });
    this.pendingRequests.clear();
  }

  // 取消特定请求
  public cancelRequest(url: string, method: string = "get"): void {
    const requestKey = `${method}:${url}`;
    if (this.pendingRequests.has(requestKey)) {
      const source = this.pendingRequests.get(requestKey);
      source?.cancel("请求被手动取消");
      this.pendingRequests.delete(requestKey);
    }
  }
}

// 导出实例
const http = new HttpService(); // 替换为你的 API 地址和超时时间

export default http;
