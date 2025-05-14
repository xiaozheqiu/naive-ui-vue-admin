import type { LoginResponse } from "@/services/auth/type";
import { defineStore } from "pinia";
import { ref } from "vue";

// 定义 Auth Store
export const useAuthStore = defineStore(
  "auth",
  () => {
    // 使用单个 ref 存储 token 和用户信息
    const authData = ref<LoginResponse>({
        accessToken: "",
      userInfo: null,
    });

    // 设置 token
    function updateAuthData(data: LoginResponse) {
      authData.value = data;
    }

    // 退出登录
    function clearAuthData() {
      authData.value = { accessToken: "", userInfo: null }; // 重置整个 authData
    }

    return {
      authData,
      updateAuthData,
      clearAuthData,
    };
  },
  {
    persist: true, // 开启持久化
  },
);
