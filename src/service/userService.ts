import http from "../tools/axios";

// 定义用户信息的接口类型（根据实际 API 返回调整）
interface UserInfo {
  id: number;
  username: string;
  email: string;
  // ... 其他用户信息字段
}

// 定义更新用户信息的参数类型
interface UpdateUserPayload {
  email?: string;
  // ... 其他可更新的字段
}

/**
 * 获取当前登录用户的信息
 * @returns Promise<UserInfo>
 */
export const getUserInfo = (): Promise<UserInfo> => {
  // 使用 http.get 发起 GET 请求
  // 第一个参数是 URL 路径（相对于 baseURL）
  // 第二个参数是可选的查询参数 (query parameters)
  return http.get<UserInfo>("/user/profile");
};

/**
 * 根据用户 ID 获取用户信息
 * @param userId 用户 ID
 * @returns Promise<UserInfo>
 */
export const getUserById = (userId: number): Promise<UserInfo> => {
  // URL 中可以包含路径参数
  return http.get<UserInfo>(`/users/${userId}`);
};

/**
 * 更新指定用户的信息
 * @param userId 用户 ID
 * @param payload 更新的数据
 * @returns Promise<UserInfo> 返回更新后的用户信息
 */
export const updateUser = (
  userId: number,
  payload: UpdateUserPayload,
): Promise<UserInfo> => {
  // 使用 http.put 发起 PUT 请求
  // 第一个参数是 URL
  // 第二个参数是请求体 (request body) 数据
  return http.put<UserInfo>(`/users/${userId}`, payload);
};

/**
 * 创建新用户
 * @param userData 用户数据
 * @returns Promise<UserInfo> 返回创建的用户信息
 */
export const createUser = (userData: Omit<UserInfo, "id">): Promise<UserInfo> => {
  // 使用 http.post 发起 POST 请求
  return http.post<UserInfo>("/users", userData);
};

/**
 * 删除用户
 * @param userId 用户 ID
 * @returns Promise<void> 通常删除操作不返回具体数据，或返回简单成功消息，这里假设不返回 data
 */
export const deleteUser = (userId: number): Promise<void> => {
  // 使用 http.delete 发起 DELETE 请求
  return http.delete<void>(`/users/${userId}`);
};

// --- 如何在 Vue 组件或其他地方使用 ---
/*
import { getUserInfo, updateUser } from './userService';
import { onMounted, ref } from 'vue';

export default {
  setup() {
    const userInfo = ref<UserInfo | null>(null);
    const loading = ref(false);
    const error = ref<string | null>(null);

    const fetchUserInfo = async () => {
      loading.value = true;
      error.value = null;
      try {
        userInfo.value = await getUserInfo();
      } catch (err: any) {
        console.error("获取用户信息失败:", err);
        error.value = err.message || '获取用户信息失败';
        // 可以根据 err.isApiError, err.isHttpError, err.isCancel 做更细致的处理
      } finally {
        loading.value = false;
      }
    };

    const handleUpdateUser = async () => {
       if (!userInfo.value) return;
       loading.value = true;
       try {
         const updatedUser = await updateUser(userInfo.value.id, { email: 'new.email@example.com' });
         userInfo.value = updatedUser;
         alert('用户信息更新成功！');
       } catch (err: any) {
         console.error("更新用户信息失败:", err);
         alert(err.message || '更新失败');
       } finally {
         loading.value = false;
       }
    };

    onMounted(fetchUserInfo);

    return {
      userInfo,
      loading,
      error,
      handleUpdateUser,
    };
  },
};
*/
