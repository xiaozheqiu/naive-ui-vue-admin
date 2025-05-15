<template>
  <div class="h-screen w-screen">
    <Layout class="h-screen w-screen flex flex-row">
      <SideMenus />
      <Layout>
        <CustomHeader />

        <!-- 渲染路由标签记录 -->
        <!-- <RouterTagHistory /> -->

        <LayoutContent>
          <div class="relative overflow-hidden p-[12px] m-h-[360px]">
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
        </LayoutContent>

        <a-layout-footer class="text-center !py-2">
          Naive UI Admin ©2025 Created by Your Company
        </a-layout-footer>
      </Layout>
    </Layout>
  </div>
</template>

<script setup lang="ts">
import CustomHeader from "./CustomHeader.vue";
import SideMenus from "./SideMenus.vue";
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import RouterTagHistory from "./RouterTagHistory.vue";
import { Layout, LayoutContent } from "ant-design-vue";
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
/* 保留原有的页面过渡效果 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
