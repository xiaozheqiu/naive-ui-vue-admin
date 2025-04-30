<template>
  <n-message-provider>
    <custom-config-provider>
      <router-view></router-view>
    </custom-config-provider>
  </n-message-provider>
</template>

<script setup lang="ts">

import CustomConfigProvider from "./components/CustomConfigProvider.vue";
</script>

<style scoped></style>
