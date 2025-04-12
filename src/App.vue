<script setup lang="ts">
import ConfigProvider from "./components/ConfigProvider.vue";
</script>

<template>
  <ConfigProvider>
    <router-view></router-view>
  </ConfigProvider>
</template>

<style scoped></style>
