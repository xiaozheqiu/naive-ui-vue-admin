<template>
  <a-layout-sider
    :collapsed-width="64"
    :width="240"
    :trigger="null"
    class="h-full flex flex-col max-h-full"
    :collapsed="isSidebarCollapsed"
    @collapse="(val: boolean) => setSidebarCollapsed(val)"
    :theme="theme"
  >
    <div class="logo h-[56px] flex items-center gap-2 justify-center">
      <img src="/logo.svg" alt="Logo" class="h-8 w-8" />
      <div
        class="text-lg font-bold whitespace-nowrap overflow-hidden min-w-10"
        v-if="!isSidebarCollapsed"
      >
        My Application
      </div>
    </div>
    <a-menu
      :items="sideMenusOptions"
      class="flex-grow"
      @select="onMenuChange"
      :theme="theme"
      mode="inline"
    />
  </a-layout-sider>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { ref, h } from "vue";
import { useRouter, type RouteRecordRaw } from "vue-router";
import { CommonRouter } from "../router/common";
import { useSystemStore } from "../store/system";
import CustomIcon from "@/components/CustomIcon.vue";
const { theme } = storeToRefs(useSystemStore());

const router = useRouter();
const currentKey = ref(router.currentRoute.value.path);

const { isSidebarCollapsed } = storeToRefs(useSystemStore());
const { setSidebarCollapsed } = useSystemStore();

function onMenuChange(item: { key: string }) {
  console.log(item, "onMenuChange");
  currentKey.value = item.key;
  router.push(item.key);
}

console.log(currentKey.value, "currentKey.value");

function mapRoutesToMenuOptions(
  routes: RouteRecordRaw[],
  parentPath: string = "",
): Array<{
  label: string | undefined;
  key: string;
  icon?: ReturnType<typeof any>;
  children?: any;
}> {
  return routes.map((route) => {
    // 构建完整路径，将父路径与当前路由路径连接起来
    const fullPath = route.path.startsWith("/")
      ? route.path // 如果路径以'/'开头，将其用作绝对路径
      : parentPath
        ? `${parentPath}/${route.path}`.replace(/\/+/g, "/") // 与父路径连接并将多个斜杠规范化为单个斜杠
        : `/${route.path}`; // 为根级路径添加前导斜杠

    return {
      label: route?.meta?.title as string | undefined,
      key: fullPath,
      icon: route.meta?.icon
        ? () => h(CustomIcon, { name: route?.meta?.icon, isOnlyIcon: true })
        : undefined,
      children: route.children
        ? mapRoutesToMenuOptions(route.children, fullPath)
        : undefined,
    };
  });
}

const sideMenusOptions = mapRoutesToMenuOptions(CommonRouter);
console.log(sideMenusOptions, "sideMenusOptions");
</script>
