import { createApp } from "vue";
import App from "./App.vue";
import "./style.css";
// 通用字体
import "vfonts/Lato.css";
// 等宽字体
import "vfonts/FiraCode.css";
import { createPinia } from "pinia";

import router from "./router/index";

const pinia = createPinia();

const app = createApp(App);

app.use(pinia);
app.use(router);

app.mount("#app");
