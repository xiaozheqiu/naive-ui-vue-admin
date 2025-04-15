import { createI18n } from "vue-i18n";

// 导入语言文件
import en from "@/locales/en.json";
import zh from "@/locales/zh.json";

const messages = { en, zh };

// 创建 i18n 实例
const i18n = createI18n({
  locale: "zh", // 默认语言
  fallbackLocale: "en", // 回退语言
  messages, // 语言配置,
});

export default i18n;
