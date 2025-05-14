<template>
  <a-layout-header
    class="!pl-4 !pr-4 flex justify-between items-center !h-[56px]"
    :style="{ background: token.colorBgContainer }"
  >
    <div class="flex justify-start items-center gap-2 flex-grow">
      <custom-icon
        v-if="isSidebarCollapsed"
        name="PanelLeftOpen"
        @click="setSidebarCollapsed(!isSidebarCollapsed)"
      ></custom-icon>
      <custom-icon
        v-if="!isSidebarCollapsed"
        name="PanelLeftClose"
        @click="setSidebarCollapsed(!isSidebarCollapsed)"
      ></custom-icon>

      <!-- 路由导航栏 -->
      <a-breadcrumb>
        <a-breadcrumb-item @click="$router.push('/')">首页</a-breadcrumb-item>
        <a-breadcrumb-item
          v-for="item in breadcrumbItems"
          :key="item.path"
          :clickable="false"
        >
          {{ item.meta?.title || item.name }}
        </a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <div class="flex justify-end items-center gap-2">
      <custom-icon
        name="Expand"
        @click="fullScreenChange"
        v-if="!isFullscreen"
      ></custom-icon>
      <custom-icon
        name="Shrink"
        @click="fullScreenChange"
        v-if="isFullscreen"
      ></custom-icon>

      <custom-icon name="RotateCw" @click="reloadCurrentPage"></custom-icon>

      <a-dropdown>
        <custom-icon name="Languages" @click.prevent></custom-icon>
        <template #overlay>
          <a-menu>
            <a-menu-item v-for="option in languagesOptions" :key="option.key">
              <a href="javascript:;" @click="option.click">
                {{ option.label }}
              </a>
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>

      <custom-icon name="Bell"></custom-icon>

      <custom-icon
        @click="changeTheme()"
        name="Moon"
        v-if="theme === 'dark'"
      ></custom-icon>

      <custom-icon
        @click="changeTheme()"
        name="Sun"
        v-if="theme !== 'dark'"
      ></custom-icon>

      <a-dropdown class="!leading-[40px]">
        <div class="flex items-center group gap-0.5">
          <a-avatar
            size="small"
            src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
          />
          <span>超级管理员</span>

          <custom-icon
            name="ChevronDown"
            class="group-hover:text-green-500 transition-transform duration-300 group-hover:rotate-180 inline-flex items-center justify-center"
            is-only-icon
          ></custom-icon>
        </div>
        <template #overlay>
          <a-menu>
            <a-menu-item v-for="option in dropdownOptions" :key="option.key">
              <a href="javascript:;">
                <component :is="option.icon" v-if="option.icon" />
                {{ option.label }}
              </a>
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </div>
  </a-layout-header>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import CustomIcon from "@/components/CustomIcon.vue";
import { useSystemStore } from "../store/system";
import { message } from "ant-design-vue";
import { onMounted, onUnmounted, ref, computed, h } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "@/store/auth";
import { theme as antTheme } from "ant-design-vue";
const { theme, isSidebarCollapsed } = storeToRefs(useSystemStore());
const { setSidebarCollapsed, changeTheme, setLanguage } = useSystemStore();
const router = useRouter();
const route = useRoute();
const { clearAuthData } = useAuthStore();

const { token } = antTheme.useToken();

interface IProps {}
const {} = defineProps<IProps>();
// 响应式变量：是否处于全屏状态
const isFullscreen = ref(false);

const dropdownOptions = [
  {
    label: "用户资料",
    key: "profile",
    icon: () => h(CustomIcon, { name: "EarOffIcon" }),
  },
  {
    label: "编辑用户资料",
    key: "editProfile",
    icon: () => h(CustomIcon, { name: "File" }),
  },
  {
    label: "退出登录",
    key: "logout",
    icon: () => h(CustomIcon, { name: "Globe2" }),
  },
];

function onDropdownSelect(key: string) {
  if (key === "logout") {
    clearAuthData();
    router.push("/login");
  }
}

const languagesOptions = [
  {
    label: "English",
    key: "en",
    click: () => {
      message.success("Language changed to English");
      setLanguage("en");
    },
  },
  {
    label: "中文",
    key: "zh",
    click: () => {
      message.success("语言已更改为中文");
      setLanguage("zh");
    },
  },
];

// Computed property for breadcrumb items
const breadcrumbItems = computed(() => {
  // Filter routes that have a title or name, and exclude the root '/' unless it's the only match
  const matched = route.matched.filter((item) => item.meta?.title || item.name);
  if (matched.length > 1) {
    return matched.filter((item) => item.path !== "/"); // Exclude root if other items exist
  }
  console.log(matched, "matched");
  return matched; // Return all matches if only one (or none) exists
});

function fullScreenChange() {
  const element = document.documentElement;
  if (!document.fullscreenElement) {
    element.requestFullscreen().catch((err) => {
      console.error(
        `Error attempting to enable full-screen mode: ${err.message}`,
      );
    });
  } else {
    document.exitFullscreen();
  }
}

// 监听全屏状态变化
function handleFullscreenChange() {
  isFullscreen.value = !!document.fullscreenElement;
}

onMounted(() => {
  document.addEventListener("fullscreenchange", handleFullscreenChange);
});

onUnmounted(() => {
  document.removeEventListener("fullscreenchange", handleFullscreenChange);
});

function reloadCurrentPage() {
  router.replace({
    path: route.path, // 保持路径不变
    query: { ...route.query, t: Date.now() }, // 添加时间戳
  });
}
</script>
