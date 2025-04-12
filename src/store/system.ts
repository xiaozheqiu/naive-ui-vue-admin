import { defineStore } from "pinia";
import { ref } from "vue";

export const useSystemStore = defineStore("system", () => {
  const theme = ref<"dark" | "light">("light");
  const isLoading = ref<boolean>(false);

  // 是否收起侧边栏
  const isSidebarCollapsed = ref<boolean>(false);

  function setSidebarCollapsed(newCollapsed: boolean) {
    isSidebarCollapsed.value = newCollapsed;
  }

  function changeTheme() {
    theme.value = theme.value === "light" ? "dark" : "light";
  }

  function setLoading(newLoading: boolean) {
    isLoading.value = newLoading;
  }

  return {
    theme,
    isLoading,
    changeTheme,
    setLoading,
    isSidebarCollapsed,
    setSidebarCollapsed,
  };
});
