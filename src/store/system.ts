import { defineStore } from "pinia";
import { ref } from "vue";
import i18n from "../locales";

export const useSystemStore = defineStore(
  "system",
  () => {
    const theme = ref<"dark" | "light">("light");
    const isLoading = ref<boolean>(false);
    const language = ref<"zh" | "en">("zh");

    function setLanguage(newLanguage: "zh" | "en") {
      console.log(i18n, "i18n");
      language.value = newLanguage;
      i18n.global.locale = newLanguage;
    }

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
      setLanguage,
      language,
    };
  },
  {
    persist: true,
  },
);
