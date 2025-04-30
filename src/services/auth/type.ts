export interface UserInfo {
  id: string;
  name: string;
  email: string;
}

/** 登录请求参数 */
export interface LoginParams {
  email: string;
  password: string; // 密码可能通过其他方式（如验证码）处理，设为可选
}

/** 登录响应数据 */
export interface LoginResponse {
  access_token: string;
  userInfo: UserInfo;
}

/** 注册请求参数 */
export interface RegisterParams {
  email: string;
  password: string; // 密码可能需要确认，或有其他字段
}

/** 注册响应数据 (可以根据实际情况调整) */
export interface RegisterResponse {
  success: boolean;
  message?: string;
}
