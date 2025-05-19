<template>
  <div
    class="flex w-full justify-between items-center gap-4 px-2"
    v-if="config.isShowRouteHistory"
  >
    <div class="flex flex-row flex-grow overflow-x-auto p-1 items-center">
      <!-- 渲染路由标签记录 -->
      <div
        class="relative mr-2 group flex items-center"
        v-for="tab in tabs"
        :key="tab.path"
      >
        <CheckableTag
          :checked="tab.path === route.path"
          @click="$router.push(tab.path)"
          class="relative transition-all duration-300 pr-2 overflow-hidden group-hover:pr-7"
        >
          {{ tab.title }}
          <span
            class="absolute top-1/2 -translate-y-1/2 -right-5 opacity-0 transition-all duration-300 cursor-pointer flex items-center justify-center z-10 group-hover:right-1.5 group-hover:opacity-100"
            @click.stop="handleCloseTab(tab)"
          >
            <CustomIcon name="X" :size="14" :is-only-icon="true" />
          </span>
        </CheckableTag>
      </div>
    </div>

    <Dropdown placement="topRight">
      <CustomIcon name="Menu" :size="16"></CustomIcon>
      <template #overlay>
        <Menu @click="handleClick">
          <MenuItem v-for="option in options" :key="option.key">
            {{ option.label }}
          </MenuItem>
        </Menu>
      </template>
    </Dropdown>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useTabsStore } from "../store/tabs";
import { useRoute, useRouter } from "vue-router";
import {
  CheckableTag,
  Dropdown,
  MenuItem,
  Menu,
  type MenuProps,
} from "ant-design-vue";
import CustomIcon from "@/components/CustomIcon.vue";
import config from "@/config";

const { removeTab, clearTabs } = useTabsStore();
const { tabs } = storeToRefs(useTabsStore());
const route = useRoute();

const router = useRouter();

const handleClick: MenuProps["onClick"] = ({ key }) => {
  if (key === "refreshPage") {
    router.replace({
      path: route.path, // 保持路径不变
      query: { ...route.query, t: Date.now() }, // 添加时间戳
    });
  }
  if (key === "closeAll") {
    clearTabs();
  }
};

const handleCloseTab = (tab: any) => {
  // 不关闭当前激活的标签页
  if (tab.path === route.path && tabs.value.length > 1) {
    // 找到当前标签的索引
    const currentIndex = tabs.value.findIndex((item) => item.path === tab.path);
    // 决定跳转到前一个还是后一个标签
    const nextTab =
      tabs.value[currentIndex + 1] || tabs.value[currentIndex - 1];
    if (nextTab) {
      router.push(nextTab.path);
    }
  }
  removeTab(tab.path);
};

const options = [
  {
    label: "刷新页面",
    key: "refreshPage",
    click: () => {},
  },
  {
    label: "关闭所有",
    key: "closeAll",
    click: () => {
      clearTabs();
    },
  },
];

console.log(route.path, tabs.value, " route.path");
</script>

<style scoped>
/* 保留一些可能需要的深度选择器样式 */
:deep(.ant-tag-checkable) {
  @apply relative transition-all duration-300;
}
</style>
