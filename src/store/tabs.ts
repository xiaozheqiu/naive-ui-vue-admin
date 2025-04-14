import { defineStore } from "pinia";
import { ref, watch } from "vue";
import { useRouter, type RouteLocationNormalized } from "vue-router";

export interface Tab {
  title: string;
  path: string;
  href: string;
  isCancel?: boolean; // 是否可以关闭
}

const initTabs = [
  {
    title: "首页",
    path: "/",
    href: "/",
    isCancel: true,
  },
];
export const useTabsStore = defineStore("tabs", () => {
  const router = useRouter();
  // 从 sessionStorage 中获取 tabs
  const tabs = ref<Tab[]>(
    JSON.parse(sessionStorage.getItem("tabs") || JSON.stringify(initTabs))
  );

  function addTab(route: RouteLocationNormalized) {
    if (!tabs.value.find((tab) => tab.path === route.path)) {
      tabs.value.push({
        title: (route.meta.title || route.name || "未知") as string,
        path: route.path,
        href: route.fullPath,
        isCancel: true,
      });
    }
  }

  function removeTab(path: string) {
    tabs.value = tabs.value.filter((tab) => tab.path !== path);
  }

  function clearTabs() {
    tabs.value = initTabs;
    setTimeout(() => {
      router.push("/home");
    }, 100);
  }

  // 监听 tabs 的变化并同步到 sessionStorage
  watch(
    tabs,
    (newTabs) => {
      sessionStorage.setItem("tabs", JSON.stringify(newTabs));
    },
    { deep: true }
  );

  return {
    tabs,
    addTab,
    removeTab,
    clearTabs,
  };
});
