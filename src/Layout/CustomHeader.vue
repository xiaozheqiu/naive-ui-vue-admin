<template>
  <n-layout-header
    class="h-[48px] px-2 flex justify-between items-center"
    bordered
    ><div class="flex justify-start items-center gap-2">
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
      <n-breadcrumb>
        <n-breadcrumb-item @click="$router.push('/')">
          <custom-icon name="House"></custom-icon>
        </n-breadcrumb-item>
        <n-breadcrumb-item
          v-for="item in breadcrumbItems"
          :key="item.path"
          :clickable="false"
        >
          {{ item.meta?.title || item.name }}
        </n-breadcrumb-item>
      </n-breadcrumb>
    </div>
    <div class="flex justify-end items-center gap-4">
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

      <n-popover>
        <template #trigger>
          <custom-icon name="Languages"></custom-icon>
        </template>

        <div class="flex flex-col">
          <n-button
            :bordered="false"
            v-for="option in languagesOptions"
            :key="option.key"
            @click="option.click"
            >{{ option.label }}</n-button
          >
        </div>
      </n-popover>

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

      <n-dropdown :options="dropdownOptions" @select="onDropdownSelect">
        <div class="flex items-center gap-2 group">
          <n-avatar
            round
            size="small"
            src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
          />
          <div class="">超级管理员</div>
          <n-icon
            class="group-hover:text-green-500 transition-transform duration-300 group-hover:rotate-180 inline-flex items-center justify-center"
          >
            <custom-icon name="ChevronDown" class=" "></custom-icon>
          </n-icon>
        </div>
      </n-dropdown>
    </div>
  </n-layout-header>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { icons, renderIcon } from "../tools/icons";
import { useSystemStore } from "../store/system";
import { useMessage } from "naive-ui";
import { onMounted, onUnmounted, ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "@/store/auth";
const { theme, isSidebarCollapsed } = storeToRefs(useSystemStore());
const { setSidebarCollapsed, changeTheme, setLanguage } = useSystemStore();
const message = useMessage();
const router = useRouter();
const route = useRoute();
const { clearAuthData } = useAuthStore();

interface IProps {}
const {} = defineProps<IProps>();
// 响应式变量：是否处于全屏状态
const isFullscreen = ref(false);

const dropdownOptions = [
  {
    label: "用户资料",
    key: "profile",
    icon: renderIcon(icons.EarOffIcon),
  },
  {
    label: "编辑用户资料",
    key: "editProfile",
    icon: renderIcon(icons.File),
  },
  {
    label: "退出登录",
    key: "logout",
    icon: renderIcon(icons.Globe2),
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
