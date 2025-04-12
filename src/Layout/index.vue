<template>
  <div class="h-screen w-screen">
    <n-layout has-sider class="h-screen w-screen flex flex-row">
      <SideMenus />

      <n-layout
        content-class="h-screen flex-grow flex flex-col gap-2"
        :style="{
          backgroundColor: systemStore.theme === 'dark' ? '#333' : '#f0f2f5',
        }">
        <CustomHeader />

        <div class="flex-grow p-2">
          <!-- 渲染子路由 -->
          <router-view></router-view>
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
import { useSystemStore } from "../store/system";
const systemStore = useSystemStore();
</script>
