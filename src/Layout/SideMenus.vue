<template>
  <n-layout-sider
    bordered
    show-trigger
    collapse-mode="width"
    :collapsed-width="64"
    :width="240"
    :native-scrollbar="false"
    style="max-height: 100%"
    class="h-full flex flex-col"
    :collapsed="isSidebarCollapsed"
    @collapse="setSidebarCollapsed(true)"
    @expand="setSidebarCollapsed(false)"
  >
    <div class="logo h-[48px] flex items-center gap-2 justify-center">
      <img src="/logo.png" alt="Logo" class="h-8 w-8" />
      <div
        class="text-lg font-bold whitespace-nowrap overflow-hidden min-w-10"
        v-if="!isSidebarCollapsed"
      >
        My Application
      </div>
    </div>
    <n-menu
      :collapsed-width="60"
      :icon-size="18"
      :collapsed-icon-size="18"
      :options="sideMenusOptions"
      class="flex-grow"
      :value="currentKey"
      @update:value="onMenuChange"
    />
  </n-layout-sider>
</template>

<script setup lang="ts">
import { type MenuOption } from "naive-ui";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { useRouter, type RouteRecordRaw } from "vue-router";
import { CommonRouter } from "../router/common";
import { useSystemStore } from "../store/system";
import { renderIcon } from "../tools/icons";

const router = useRouter();
const currentKey = ref(router.currentRoute.value.path);

const { isSidebarCollapsed } = storeToRefs(useSystemStore());
const { setSidebarCollapsed } = useSystemStore();

function onMenuChange(key: string, item: MenuOption) {
  console.log(key, item, "onMenuChange", currentKey.value);
  currentKey.value = key;
  router.push(key);
}

function mapRoutesToMenuOptions(
  routes: RouteRecordRaw[],
  parentPath: string = "",
): Array<{
  label: string | undefined;
  key: string;
  icon?: ReturnType<typeof renderIcon>;
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
      label: route.name as string | undefined,
      key: fullPath,
      icon: route.meta?.icon ? renderIcon(route.meta.icon) : undefined,
      children: route.children
        ? mapRoutesToMenuOptions(route.children, fullPath)
        : undefined,
    };
  });
}

const sideMenusOptions = mapRoutesToMenuOptions(CommonRouter);
</script>
