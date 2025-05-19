<template>
  <ConfigProvider
    componentSize="middle"
    :theme="{
      token: {},
      algorithm:
        theme === 'dark' ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
    }"
  >
    <StyleProvider
      hash-priority="high"
      :transformers="[legacyLogicalPropertiesTransformer]"
    >
      <App> <slot></slot> </App>
    </StyleProvider>
  </ConfigProvider>
</template>

<script lang="ts" setup>
import { useSystemStore } from "@/store/system";
import {
  theme as antTheme,
  App,
  ConfigProvider,
  StyleProvider,
  legacyLogicalPropertiesTransformer,
} from "ant-design-vue";
import { storeToRefs } from "pinia";
import { themeConfig } from "@/config/theme";
const { theme } = storeToRefs(useSystemStore());

const { token } = antTheme.useToken();
console.log(theme, "theme");

console.log(token.value, "token");

interface Props {}
// 使用 defineProps 定义组件的 Props 类型
defineProps<Props>();
</script>
