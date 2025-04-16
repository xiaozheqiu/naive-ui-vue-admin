<script setup lang="ts">
import ConfigProvider from "./components/ConfigProvider.vue";
</script>

<template>
  <config-provider>
    <n-message-provider>
      <router-view></router-view>
    </n-message-provider>
  </config-provider>
</template>

<style scoped></style>
