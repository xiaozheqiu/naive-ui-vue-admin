import { createApp } from "vue";
import App from "./App.vue";
import "./styles/style.css";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

import Antd from "ant-design-vue";
import "ant-design-vue/dist/reset.css";
import { createPinia } from "pinia";
import router from "@/router";

const pinia = createPinia();

pinia.use(piniaPluginPersistedstate);
console.log(router, "router");

const app = createApp(App);
app.use(Antd);
app.use(pinia);
app.use(router);

app.mount("#app");
