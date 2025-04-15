import { createApp } from "vue";
import App from "./App.vue";
import "./styles/style.css";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import i18n from "@/locales";

// 通用字体
import "vfonts/Lato.css";
// 等宽字体
import "vfonts/FiraCode.css";
import { createPinia } from "pinia";

import router from "./router/index";

const pinia = createPinia();

pinia.use(piniaPluginPersistedstate);

const app = createApp(App);

app.use(pinia);
app.use(router);
app.use(i18n);

app.mount("#app");
