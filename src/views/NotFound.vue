<template>
  <div class="flex flex-col items-center justify-center h-screen">
    <n-result status="404" title="抱歉，您访问的页面不存在" description="">
      <template #footer>
        <n-button @click="goHome">返回首页</n-button>
      </template>
    </n-result>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

const goHome = () => {
  router.push("/");
};
</script>

<style scoped>
/* Add any specific styles for the 404 page here */
.h-full {
  height: calc(
    100vh - var(--header-height, 60px) - var(--footer-height, 60px)
  ); /* Adjust based on your layout */
}
</style>
