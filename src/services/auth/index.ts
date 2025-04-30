import http from "@/tools/axios";
import type {
  UserInfo,
  LoginParams,
  LoginResponse,
  RegisterParams,
  RegisterResponse,
} from "./type";

/**
 * 获取当前登录用户的信息
 * @returns Promise<UserInfo>
 */
export const getUserInfo = (): Promise<UserInfo> => {
  return http.get<UserInfo>("/user/profile");
};

/**
 * 用户登录
 * @param data 登录凭证
 * @returns Promise<LoginResponse>
 */
export const login = (data: LoginParams): Promise<LoginResponse> => {
  return http.post<LoginResponse>("/auth/login", data);
};

/**
 * 用户注册
 * @param data 注册信息
 * @returns Promise<RegisterResponse>
 */
export const register = (data: RegisterParams): Promise<RegisterResponse> => {
  return http.post<RegisterResponse>("/auth/register", data);
};
