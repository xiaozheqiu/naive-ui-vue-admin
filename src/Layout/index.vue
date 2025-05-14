<template>
  <div class="h-screen w-screen">
    <n-layout has-sider class="h-screen w-screen flex flex-row">
      <side-menus />

      <n-layout
        content-class="h-screen flex-grow flex flex-col"
        :style="{
          backgroundColor: systemStore.theme === 'dark' ? '#333' : '#f0f2f5',
        }"
      >
        <custom-header />

        <!-- 渲染路由标签记录 -->
        <router-tag-history />

        <div class="flex-grow relative overflow-hidden">
          <!-- 渲染子路由 -->
          <router-view
            :key="routeKey"
            v-slot="{ Component, route }"
            class="h-full absolute inset-0 p-3"
          >
            <transition name="fade">
              <component :is="Component" :key="route.path" />
            </transition>
          </router-view>
        </div>

        <n-layout-footer bordered class="h-10 flex items-center justify-center">
          Footer Footer Footer
        </n-layout-footer>
      </n-layout>
    </n-layout>
  </div>
</template>

<script setup lang="ts">
import CustomHeader from "./CustomHeader.vue";
import SideMenus from "./SideMenus.vue";
import RouterTagHistory from "./RouterTagHistory.vue";
import { useSystemStore } from "../store/system";
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
const systemStore = useSystemStore();
const route = useRoute();
const routeKey = ref(route.fullPath);

watch(
  () => route.fullPath,
  (newPath) => {
    routeKey.value = `${newPath}?reload=${Date.now()}`; // 确保 key 的值变化
  },
);
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease-in-out;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
