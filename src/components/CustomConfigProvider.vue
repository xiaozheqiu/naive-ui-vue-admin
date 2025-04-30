<template>
  <n-config-provider
    :theme="systemStore.theme === 'dark' ? darkTheme : undefined"
    :locale="zhCN"
    :date-locale="dateZhCN"
    :theme-overrides="themeOverrides"
  >
    <n-theme-editor>
      <slot></slot>
      <n-global-style />
    </n-theme-editor>
  </n-config-provider>
</template>

<script lang="ts" setup>
import type { GlobalThemeOverrides } from "naive-ui";
import { zhCN, dateZhCN } from "naive-ui";
import { useSystemStore } from "../store/system";
import { darkTheme } from "naive-ui";

interface Props {}
// 使用 defineProps 定义组件的 Props 类型
defineProps<Props>();

const systemStore = useSystemStore();

const themeOverrides: GlobalThemeOverrides = {
  common: {
    borderRadiusSmall: "4px",
    borderRadius: "8px",
    fontSize: "13px",
  },
  Card: {
    paddingMedium: "12px",
    paddingLarge: "24px",
  },
  Menu: {
    itemHeight: "30px",
  },
  Dropdown: {
    optionHeightSmall: "28px",
    optionHeightMedium: "28px",
    optionHeightLarge: "28px",
  },
};
</script>
