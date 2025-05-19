<template>
  <div class="login-container flex items-center justify-center h-screen">
    <a-card class="login-card w-full max-w-sm shadow-xl">
      <div class="flex justify-center items-center p-2 flex-col w-full">
        <div class="text-center text-xl font-semibold mb-2 flex items-center justify-center gap-2">
          <img src="/logo.svg" alt="Logo" class="h-8 w-8" />登 录
        </div>
        <a-form
          ref="formRef"
          :model="formValue"
          :rules="rules"
          @finish="handleLogin"
          layout="vertical"
          class="w-full"
        >
          <a-form-item name="email" label="邮箱" class="">
            <a-input v-model:value="formValue.email" placeholder="请输入邮箱">
              <template #prefix>
                <user-outlined />
              </template>
            </a-input>
          </a-form-item>
          <a-form-item name="password" label="密码" class="">
            <a-input-password
              v-model:value="formValue.password"
              placeholder="请输入密码"
              @pressEnter="handleLogin"
            >
              <template #prefix>
                <lock-outlined />
              </template>
            </a-input-password>
          </a-form-item>

          <div class="flex justify-between items-center mb-2">
            <a-checkbox v-model:checked="rememberMe">记住我</a-checkbox>
            <a-button type="link" @click="handleForgotPassword"
              >忘记密码？</a-button
            >
          </div>

          <a-button
            type="primary"
            html-type="submit"
            :loading="loading"
            class="w-full"
          >
            登录
          </a-button>

          <div class="flex justify-center items-center mt-2">
            <span class="text-gray-500">还没有账号？</span>
            <a-button type="link" @click="handleRegister">立即注册</a-button>
          </div>
        </a-form>
      </div>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { UserOutlined, LockOutlined } from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import type { FormInstance } from "ant-design-vue/es/form";
import { login } from "@/services/auth";
import { useAuthStore } from "@/store/auth";
const { updateAuthData } = useAuthStore();

const router = useRouter();
const formRef = ref<FormInstance | null>(null);
const loading = ref(false);
const rememberMe = ref(false);

const formValue = reactive({
  email: "",
  password: "",
});

// 修改为Ant Design Vue的规则格式
const rules = {
  email: [
    {
      required: true,
      type: "email",
      message: "请输入正确的邮箱",
      trigger: ["change", "blur"],
    },
  ],
  password: [
    { required: true, message: "请输入密码", trigger: ["change", "blur"] },
    {
      min: 6,
      max: 20,
      message: "密码长度在 6 到 20 个字符之间",
      trigger: ["change", "blur"],
    },
  ],
};

// 处理忘记密码点击事件
const handleForgotPassword = () => {
  message.info("忘记密码功能即将上线");
  // 这里可以跳转到忘记密码页面
  // router.push('/forgot-password');
};

// 处理注册按钮点击事件
const handleRegister = () => {
  router.push("/register");
};

// 更新登录处理函数以适应Ant Design Vue的表单提交方式
const handleLogin = () => {
  formRef.value
    ?.validateFields()
    .then(async () => {
      try {
        loading.value = true;
        // 记住用户登录状态
        if (rememberMe.value) {
          localStorage.setItem("remember", "true");
        } else {
          localStorage.removeItem("remember");
        }

        // 登录请求
        const res = await login(formValue);
        updateAuthData(res);
        message.success("登录成功");
        router.push("/");
      } catch (error) {
        console.log(error);
        message.error("登录失败");
      } finally {
        loading.value = false;
      }
    })
    .catch((errors) => {
      console.log(errors);
    });
};
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
  background-size: 400% 400%;
  animation: gradientBG 15s ease infinite;
}

@keyframes gradientBG {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* 更新卡片样式适应Ant Design Vue */
.login-card {
  background-color: rgba(255, 255, 255, 0.9) !important;
  backdrop-filter: blur(8px);
  border-radius: 12px;
}
</style>
