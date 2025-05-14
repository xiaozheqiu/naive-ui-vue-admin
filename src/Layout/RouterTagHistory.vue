<template>
  <div
    class="flex w-full justify-between items-center gap-4"
    :style="{ backgroundColor: themeVars.cardColor }"
    v-if="config.isShowRouteHistory"
  >
    <div class="flex flex-row flex-grow gap-2 overflow-x-auto p-1 items-center">
      <!-- 渲染路由标签记录 -->
      <n-tag
        v-for="tab in tabs"
        :key="tab.path"
        size="small"
        :checked="tab.path === route.path"
        checkable
        :bordered="false"
        class="transition-all group"
        @click="$router.push(tab.path)"
      >
        <div class="w-min flex flex-row items-center gap-1">
          <span class="truncate">{{ tab.title }}</span>
          <custom-icon
            name="X"
            :size="16"
            :class="[
              'cursor-pointer text-gray-400 w-0 opacity-0 group-hover:w-4 group-hover:opacity-100 transition-all duration-300 ease-in-out',
              tab.path === route.path
                ? 'group-hover:text-white'
                : 'group-hover:text-green-500',
            ]"
            @click.stop="removeTab(tab.path)"
          >
          </custom-icon>
        </div>
      </n-tag>
    </div>
    <n-popover>
      <template #trigger>
        <custom-icon name="Menu" :size="16" class="mr-2"> </custom-icon
      ></template>

      <div class="flex flex-col">
        <n-button
          :bordered="false"
          v-for="option in options"
          :key="option.key"
          @click="option.click"
          >{{ option.label }}</n-button
        >
      </div>
    </n-popover>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useTabsStore } from "../store/tabs";
import { useRoute, useRouter } from "vue-router";
import CustomIcon from "@/components/CustomIcon.vue";
import config from "@/config";

const { removeTab, clearTabs } = useTabsStore();
const { tabs } = storeToRefs(useTabsStore());
const route = useRoute();

const router = useRouter();

const options = [
  {
    label: "刷新页面",
    key: "refreshPage",
    click: () => {
      router.replace({
        path: route.path, // 保持路径不变
        query: { ...route.query, t: Date.now() }, // 添加时间戳
      });
    },
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
