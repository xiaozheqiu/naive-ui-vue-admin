<script setup lang="ts">
import HelloWorld from "./components/HelloWorld.vue";
import ConfigProvider from "./components/ConfigProvider.vue";
import Layout from "./Layout/index.vue";
</script>

<template>
  <ConfigProvider>
    <Layout>
      <n-date-picker />
      <HelloWorld msg="Vite + Vue" />
    </Layout>
  </ConfigProvider>
</template>

<style scoped></style>
