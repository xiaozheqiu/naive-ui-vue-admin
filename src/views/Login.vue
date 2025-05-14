<template>
  <div class="login-container flex items-center justify-center h-screen">
    <n-card
      class="w-full max-w-sm shadow-lg"
      title="登 录"
      :bordered="false"
      size="large"
      :header-style="{ textAlign: 'center' }"
    >
      <n-form
        ref="formRef"
        :model="formValue"
        :rules="rules"
        @submit.prevent="handleLogin"
      >
        <n-form-item path="email" label="邮箱">
          <n-input v-model:value="formValue.email" placeholder="请输入用户名" />
        </n-form-item>
        <n-form-item path="password" label="密码">
          <n-input
            v-model:value="formValue.password"
            type="password"
            show-password-on="click"
            placeholder="请输入密码"
            @keyup.enter="handleLogin"
          />
        </n-form-item>
        
        <div class="flex justify-between items-center mb-4">
          <n-checkbox v-model:checked="rememberMe">记住我</n-checkbox>
          <n-button text type="primary" @click="handleForgotPassword">忘记密码？</n-button>
        </div>
        
        <n-button
          type="primary"
          attr-type="submit"
          block
          strong
          :loading="loading"
        >
          登录
        </n-button>
        
        <div class="flex justify-center mt-4">
          <span class="text-gray-500">还没有账号？</span>
          <n-button text type="primary" class="ml-1" @click="handleRegister">立即注册</n-button>
        </div>
      </n-form>
    </n-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import {
  NCard,
  NForm,
  NFormItem,
  NInput,
  NButton,
  NCheckbox,
  useMessage,
  type FormInst,
  type FormRules,
} from "naive-ui";
import { login } from "@/services/auth";
import { useAuthStore } from "@/store/auth";
const { updateAuthData } = useAuthStore();

const router = useRouter();
const message = useMessage();
const formRef = ref<FormInst | null>(null);
const loading = ref(false);
const rememberMe = ref(false);

const formValue = reactive({
  email: "",
  password: "",
});

const rules: FormRules = {
  email: [
    {
      required: true,
      message: "请输入正确的邮箱",
      trigger: ["input", "blur"],
      type: "email",
    },
  ],
  password: [
    { required: true, message: "请输入密码", trigger: ["input", "blur"] },
    {
      min: 6,
      max: 20,
      message: "密码长度在 6 到 20 个字符之间",
      trigger: ["input", "blur"],
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
  router.push('/register');
};

const handleLogin = (e: Event) => {
  e.preventDefault();
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      try {
        loading.value = true;
        // 记住用户登录状态
        if (rememberMe.value) {
          localStorage.setItem('remember', 'true');
        } else {
          localStorage.removeItem('remember');
        }
        
        // 模拟登录请求
        const res = await login(formValue);
        updateAuthData(res);
        message.success("登录成功");
        router.push("/");
      } catch (error) {
        console.log(error, "登录失败");
      }
      loading.value = false;
    } else {
      console.log(errors);
    }
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

/* 使卡片背景更清晰 */
.n-card {
  background-color: rgba(255, 255, 255, 0.9) !important; /* 增加一点透明度 */
  backdrop-filter: blur(5px); /* 添加模糊效果 */
}
</style>
