<template>
  <div class="h-screen w-screen">
    <a-layout class="h-screen w-screen flex flex-row">
      <side-menus />
      <a-layout>
        <custom-header />

        <!-- 渲染路由标签记录 -->
        <!-- <router-tag-history /> -->

        <a-layout-content class="m-[16px]">
          <div
            :style="{ background: token.colorBgContainer }"
            class="relative overflow-hidden p-[16px] m-h-[360px]"
          >
            <!-- 渲染子路由 -->
            <router-view
              :key="routeKey"
              v-slot="{ Component, route }"
              class="h-full"
            >
              <transition name="fade">
                <component :is="Component" :key="route.path" />
              </transition>
            </router-view>
          </div>
        </a-layout-content>

        <a-layout-footer class="text-center !py-2">
          Naive UI Admin ©2025 Created by Your Company
        </a-layout-footer>
      </a-layout>
    </a-layout>
  </div>
</template>

<script setup lang="ts">
import CustomHeader from "./CustomHeader.vue";
import SideMenus from "./SideMenus.vue";
import RouterTagHistory from "./RouterTagHistory.vue";
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import { theme as antTheme } from "ant-design-vue";
const { token } = antTheme.useToken();

const route = useRoute();
const routeKey = ref(route.fullPath);

// 监听路由变化
watch(
  () => route.fullPath,
  (newPath) => {
    routeKey.value = `${newPath}?reload=${Date.now()}`; // 确保 key 的值变化
  },
);
</script>

<style scoped>
.logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px;
}

.site-layout-sub-header-background {
  background: #fff;
}

.site-layout-background {
  background: #fff;
}

/* 保留原有的页面过渡效果 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

[data-theme="dark"] .site-layout-sub-header-background {
  background: #141414;
}
</style>
