import http from "@/tools/axios";
import type {
  LoginParams,
  LoginResponse,
  RegisterParams,
  RegisterResponse,
} from "./type";

/**
 * 用户登录
 * @param data 登录凭证
 * @returns Promise<LoginResponse> 获取当前登录用户的信息
 */
export const login = (data: LoginParams): Promise<LoginResponse> => {
  return http.post<LoginResponse>("/admin/auth/login", data);
};

/**
 * 用户注册
 * @param data 注册信息
 * @returns Promise<RegisterResponse>
 */
export const register = (data: RegisterParams): Promise<RegisterResponse> => {
  return http.post<RegisterResponse>("/admin/auth/register", data);
};
